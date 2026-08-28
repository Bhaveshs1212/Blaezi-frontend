import api from '../lib/axios';

const PLAN_TYPES = new Set(['task', 'exam', 'project', 'dsa', 'interview', 'break', 'goal']);
const PRIORITIES = new Set(['high', 'medium', 'low']);
const SOURCE_TYPES = new Set(['task', 'goal', 'career', 'project', 'dsa', 'event']);
const TIME_RE = /^\d{2}:\d{2}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Normalize AI time strings to HH:MM 24h.
 * Accepts: "9:00", "09:00", "09:00:00", "9:00 AM", "2:30pm", etc.
 */
function normalizeTime(value) {
  if (value == null) return null;
  const raw = String(value).trim();
  if (!raw) return null;

  const strict = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (strict) {
    const h = Number(strict[1]);
    const m = Number(strict[2]);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    return null;
  }

  const ampm = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)\.?$/i);
  if (ampm) {
    let h = Number(ampm[1]);
    const m = Number(ampm[2]);
    const period = ampm[3].toLowerCase();
    if (h < 1 || h > 12 || m < 0 || m > 59) return null;
    if (period === 'am') {
      if (h === 12) h = 0;
    } else if (h !== 12) {
      h += 12;
    }
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  return null;
}

function normalizeType(value) {
  const t = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
  const aliases = {
    tasks: 'task',
    exams: 'exam',
    projects: 'project',
    study: 'exam',
    revision: 'exam',
    career: 'interview',
    interviews: 'interview',
    goals: 'goal',
    breaks: 'break',
    rest: 'break'
  };
  const mapped = aliases[t] || t;
  return PLAN_TYPES.has(mapped) ? mapped : null;
}

function getPuter() {
  if (typeof window === 'undefined' || !window.puter?.ai?.chat) {
    const err = new Error(
      'Puter.js is not loaded. Refresh the page, or check that https://js.puter.com/v2/ is reachable.'
    );
    err.code = 'PUTER_MISSING';
    throw err;
  }
  return window.puter;
}

/**
 * Fetch sanitized planning context from Blaezi backend.
 */
export async function fetchDailyPlanContext(options = {}) {
  const body = {};
  if (options.availableMinutes != null && options.availableMinutes !== '') {
    body.availableMinutes = Number(options.availableMinutes);
  }
  if (options.focus) {
    body.focus = options.focus;
  }
  const response = await api.post('/ai/daily-plan/context', body);
  return response.data?.data || response.data;
}

function extractContent(puterResponse) {
  if (puterResponse == null) return null;
  if (typeof puterResponse === 'string') return puterResponse;
  if (typeof puterResponse.message?.content === 'string') {
    return puterResponse.message.content;
  }
  if (Array.isArray(puterResponse.message?.content)) {
    return puterResponse.message.content
      .map((part) => (typeof part === 'string' ? part : part?.text || part?.content || ''))
      .join('');
  }
  if (typeof puterResponse.content === 'string') return puterResponse.content;
  if (typeof puterResponse.text === 'string') return puterResponse.text;
  if (typeof puterResponse === 'object' && puterResponse.schedule) {
    return JSON.stringify(puterResponse);
  }
  return null;
}

function parseJsonLoose(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty AI response');
  }
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error('AI returned invalid JSON');
  }
}

/**
 * Pull a human title out of messy Puter/LLM schedule objects.
 */
function extractTitle(item) {
  if (!item || typeof item !== 'object') return '';
  const candidates = [
    item.title,
    item.name,
    item.task,
    item.activity,
    item.label,
    item.subject,
    item.topic,
    item.heading,
    item.text,
    item.event,
    item.goal,
    item.project,
    item.description,
    item.focus,
    item.action
  ];
  for (const c of candidates) {
    if (c == null) continue;
    if (typeof c === 'object') {
      const nested = extractTitle(c);
      if (nested) return nested;
      continue;
    }
    const s = String(c).trim();
    if (s) return s.slice(0, 200);
  }
  return '';
}

/**
 * Normalize alternate top-level shapes from the model into { schedule, ... }.
 */
function coercePlanShape(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  if (Array.isArray(raw.schedule)) return raw;

  const alt =
    raw.blocks ||
    raw.timeline ||
    raw.plan ||
    raw.activities ||
    raw.items ||
    raw.scheduleItems ||
    raw.data?.schedule ||
    raw.dailyPlan?.schedule ||
    raw.result?.schedule;

  if (Array.isArray(alt)) {
    return { ...raw, schedule: alt };
  }

  if (raw.dailyPlan && typeof raw.dailyPlan === 'object') {
    return coercePlanShape({ ...raw, ...raw.dailyPlan });
  }
  if (raw.plan && typeof raw.plan === 'object' && !Array.isArray(raw.plan)) {
    return coercePlanShape({ ...raw, ...raw.plan });
  }

  return raw;
}

function parseTimeToMinutes(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number);
  return h * 60 + m;
}

function computeTotalMinutes(schedule) {
  return (schedule || []).reduce((sum, item) => {
    const start = parseTimeToMinutes(item.startTime);
    const end = parseTimeToMinutes(item.endTime);
    return sum + (end >= start ? end - start : 0);
  }, 0);
}

/**
 * Validate / normalize plan JSON to match Blaezi schedule schema.
 * Tolerant of Puter/LLM field-name drift; skips bad items when possible.
 */
export function validateDailyPlan(rawInput, currentDate) {
  const raw = coercePlanShape(rawInput);

  if (!raw || typeof raw !== 'object') {
    throw new Error('Plan must be an object');
  }

  const date = DATE_RE.test(raw.date) ? raw.date : currentDate;
  if (!date || !DATE_RE.test(date)) {
    throw new Error('Invalid plan date');
  }

  let summary = String(raw.summary || raw.overview || raw.description || '').trim();
  if (!summary) summary = 'Personalized plan for today';
  if (summary.length > 500) summary = summary.slice(0, 500);

  if (!Array.isArray(raw.schedule) || raw.schedule.length === 0) {
    throw new Error('Invalid schedule');
  }

  const scheduleSource = raw.schedule.slice(0, 20);
  const schedule = [];
  let skipped = 0;

  scheduleSource.forEach((item) => {
    let block = item;

    if (typeof item === 'string') {
      const m = item.match(/^(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})\s+(.+)$/);
      if (!m) {
        skipped += 1;
        return;
      }
      block = {
        startTime: m[1],
        endTime: m[2],
        title: m[3],
        type: 'task',
        priority: 'medium'
      };
    }

    if (!block || typeof block !== 'object') {
      skipped += 1;
      return;
    }

    const startTime = normalizeTime(block.startTime ?? block.start ?? block.from ?? block.begin);
    const endTime = normalizeTime(block.endTime ?? block.end ?? block.to ?? block.finish);
    if (!startTime || !endTime) {
      skipped += 1;
      return;
    }

    let title = extractTitle(block);
    if (!title) {
      const typeGuess = normalizeType(block.type || block.category || 'task') || 'task';
      title = typeGuess === 'break' ? 'Short break' : `Focus block (${typeGuess})`;
    }
    if (title.length > 200) title = title.slice(0, 200);

    const type = normalizeType(block.type || block.category || 'task') || 'task';
    let priority = String(block.priority || 'medium').toLowerCase().trim();
    if (!PRIORITIES.has(priority)) priority = 'medium';

    let reason = String(block.reason || block.why || block.notes || '').trim();
    if (!reason) reason = 'Prioritized from your Blaezi data';
    if (reason.length > 300) reason = reason.slice(0, 300);

    let sourceId = block.sourceId ?? null;
    if (sourceId != null) sourceId = String(sourceId);
    let sourceType = block.sourceType ?? null;
    if (sourceType != null) {
      sourceType = String(sourceType).toLowerCase();
      if (!SOURCE_TYPES.has(sourceType)) sourceType = null;
    }

    schedule.push({
      startTime,
      endTime,
      title,
      type,
      priority,
      reason,
      sourceId,
      sourceType
    });
  });

  if (schedule.length === 0) {
    throw new Error('AI returned a schedule with no usable time blocks');
  }

  const insights = Array.isArray(raw.insights)
    ? raw.insights.map((s) => String(s).slice(0, 300)).filter(Boolean).slice(0, 10)
    : [];
  const warnings = Array.isArray(raw.warnings)
    ? raw.warnings.map((s) => String(s).slice(0, 300)).filter(Boolean).slice(0, 10)
    : [];
  if (skipped > 0) {
    warnings.push(`Skipped ${skipped} incomplete block(s) from the AI response.`);
  }

  let totalPlannedMinutes = Number(raw.totalPlannedMinutes);
  const computed = computeTotalMinutes(schedule);
  if (!Number.isFinite(totalPlannedMinutes) || Math.abs(computed - totalPlannedMinutes) > 30) {
    totalPlannedMinutes = computed;
  }
  totalPlannedMinutes = Math.max(0, Math.min(24 * 60, Math.round(totalPlannedMinutes)));

  return {
    date,
    summary,
    totalPlannedMinutes,
    schedule,
    insights,
    warnings,
    insufficientData: false
  };
}

function mapPuterError(error) {
  const message = String(error?.message || error || 'Puter AI request failed');
  const lower = message.toLowerCase();
  const err = new Error(message);
  if (
    lower.includes('auth') ||
    lower.includes('sign in') ||
    lower.includes('login') ||
    lower.includes('cancelled') ||
    lower.includes('canceled') ||
    lower.includes('permission')
  ) {
    err.code = 'PUTER_AUTH';
    err.message = 'Sign in to Puter to generate a plan.';
  } else if (
    lower.includes('usage') ||
    lower.includes('allowance') ||
    lower.includes('limit') ||
    lower.includes('quota') ||
    lower.includes('billing')
  ) {
    err.code = 'PUTER_LIMIT';
    err.message = 'Puter usage limit reached. Check your Puter account allowance.';
  } else if (error?.code === 'PUTER_MISSING') {
    err.code = 'PUTER_MISSING';
  } else {
    err.code = 'PUTER_ERROR';
  }
  err.cause = error;
  return err;
}

async function callPuterForPlan({ systemPrompt, userMessage, model }) {
  const puter = getPuter();
  const response = await puter.ai.chat(
    [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `${userMessage}

Return ONLY valid JSON with this shape:
{
  "date": "YYYY-MM-DD",
  "summary": "short string",
  "totalPlannedMinutes": 120,
  "schedule": [
    {
      "startTime": "09:00",
      "endTime": "09:45",
      "title": "Clear activity title",
      "type": "task",
      "priority": "high",
      "reason": "why this is scheduled",
      "sourceId": null,
      "sourceType": null
    }
  ],
  "insights": [],
  "warnings": []
}

Rules:
- Every schedule item MUST include a non-empty "title" string.
- Times must be 24-hour zero-padded HH:MM (example "09:00", not "9:00" or "9:00 AM").
- type must be one of: task, exam, project, dsa, interview, break, goal.
- priority must be one of: high, medium, low.`
      }
    ],
    {
      model: model || 'gpt-4o-mini',
      response_format: 'json'
    }
  );
  return extractContent(response);
}

/**
 * Generate a daily plan: Blaezi context API + Puter.js LLM (client-side).
 * @param {{ availableMinutes?: number, focus?: string }} [options]
 * @returns {Promise<object>} plan data
 */
export async function generateDailyPlan(options = {}) {
  const packageData = await fetchDailyPlanContext(options);

  if (packageData?.insufficientData) {
    return (
      packageData.fallbackPlan || {
        date: packageData.currentDate,
        summary: "You don't have enough scheduled activities yet.",
        totalPlannedMinutes: 0,
        schedule: [],
        insights: [
          'Add a few tasks, goals, exams, projects, or DSA progress and I can build a personalized plan.'
        ],
        warnings: [],
        insufficientData: true
      }
    );
  }

  const currentDate = packageData.currentDate;
  let lastError = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const content = await callPuterForPlan({
        systemPrompt: packageData.systemPrompt,
        userMessage: packageData.userMessage,
        model: 'gpt-4o-mini'
      });
      console.debug('[puterPlanner] raw AI content:', content);
      const raw = parseJsonLoose(content);
      return validateDailyPlan(raw, currentDate);
    } catch (error) {
      console.warn('[puterPlanner] attempt failed:', error?.message || error);
      lastError = error;
      if (error?.code === 'PUTER_MISSING' || error?.code === 'PUTER_AUTH' || error?.code === 'PUTER_LIMIT') {
        throw mapPuterError(error);
      }
      if (attempt === 0) continue;
      throw mapPuterError(error);
    }
  }

  throw mapPuterError(lastError);
}
