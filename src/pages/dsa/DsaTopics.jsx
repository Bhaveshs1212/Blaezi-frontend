import { useMemo, useState, useEffect } from "react";
import { useDsa } from "../../context/DsaContext";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card } from "../../components/ui/card";
import Breadcrumbs from "../../components/common/Breadcrumbs";

export default function DsaTopics() {
  const { problems, updateProblemStatus } = useDsa();
  
  // Debug: Log problems on mount and when they change
  useEffect(() => {
    console.log('DsaTopics: problems loaded, count:', problems.length);
    if (problems.length > 0) {
      console.log('DsaTopics: Sample problem:', problems[0]);
      console.log('DsaTopics: Problem has id?', !!problems[0].id, 'id value:', problems[0].id);
      console.log('DsaTopics: Problem has _id?', !!problems[0]._id, '_id value:', problems[0]._id);
    }
  }, [problems]);
  
  // Track which topics are expanded
  const [expandedTopics, setExpandedTopics] = useState(new Set());

  // STEP 1: Group problems by topic
  const groupedProblems = useMemo(() => {
    const groups = {};
    
    problems.forEach((problem) => {
      const topic = problem.topic || problem.category || "Uncategorized";
      
      if (!groups[topic]) {
        groups[topic] = {
          name: topic,
          problems: [],
          total: 0,
          solved: 0,
        };
      }
      
      groups[topic].problems.push(problem);
      groups[topic].total++;
      
      if (problem.status === "solved") {
        groups[topic].solved++;
      }
    });
    
    // Convert to array and sort alphabetically
    return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
  }, [problems]);

  // STEP 2: Calculate overall progress
  const overallProgress = useMemo(() => {
    const total = problems.length;
    const solved = problems.filter(p => p.status === "solved").length;
    const percentage = total === 0 ? 0 : Math.round((solved / total) * 100);
    
    // Count by difficulty
    const easy = problems.filter(p => p.difficulty === "Easy").length;
    const easySolved = problems.filter(p => p.difficulty === "Easy" && p.status === "solved").length;
    
    const medium = problems.filter(p => p.difficulty === "Medium").length;
    const mediumSolved = problems.filter(p => p.difficulty === "Medium" && p.status === "solved").length;
    
    const hard = problems.filter(p => p.difficulty === "Hard").length;
    const hardSolved = problems.filter(p => p.difficulty === "Hard" && p.status === "solved").length;
    
    return {
      total,
      solved,
      percentage,
      easy: { total: easy, solved: easySolved },
      medium: { total: medium, solved: mediumSolved },
      hard: { total: hard, solved: hardSolved },
    };
  }, [problems]);

  // STEP 3: Toggle topic expansion
  const toggleTopic = (topicName) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicName)) {
      newExpanded.delete(topicName);
    } else {
      newExpanded.add(topicName);
    }
    setExpandedTopics(newExpanded);
  };

  // STEP 4: Handle status change
  const handleStatusChange = (problemId, newStatus) => {
    console.log('Changing status for problem:', problemId, 'to:', newStatus);
    updateProblemStatus(problemId, newStatus);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">
          Striver's A2Z Sheet - Learn DSA from A to Z
        </h1>
        <p className="text-slate-600">
          This course is made for people who want to learn DSA from A to Z for free in a well-organised and structured manner.
        </p>
      </div>

      <Breadcrumbs
        items={[
          { label: "DSA", href: "/dsa" },
          { label: "Topics" },
        ]}
      />

      {/* Overall Progress */}
      <Card className="p-6 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Overall Progress</h3>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {overallProgress.solved} / {overallProgress.total}
              </p>
            </div>
            <div className="text-5xl font-bold text-slate-900">
              {overallProgress.percentage}%
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="flex gap-6 pt-4 border-t border-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-slate-700">
                Easy {overallProgress.easy.solved}/{overallProgress.easy.total}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm font-medium text-slate-700">
                Medium {overallProgress.medium.solved}/{overallProgress.medium.total}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium text-slate-700">
                Hard {overallProgress.hard.solved}/{overallProgress.hard.total}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Topic List */}
      <div className="space-y-3">
        {groupedProblems.map((topic) => (
          <TopicSection
            key={topic.name}
            topic={topic}
            isExpanded={expandedTopics.has(topic.name)}
            onToggle={() => toggleTopic(topic.name)}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {groupedProblems.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-slate-500">No problems found. Refresh to load Striver problems.</p>
        </Card>
      )}
    </div>
  );
}

/* ============ TOPIC SECTION COMPONENT ============ */
function TopicSection({ topic, isExpanded, onToggle, onStatusChange }) {
  const progressPercentage = topic.total === 0 ? 0 : Math.round((topic.solved / topic.total) * 100);

  return (
    <Card className="overflow-hidden">
      {/* Topic Header - Clickable */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-slate-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-600" />
          )}
          <h3 className="text-lg font-semibold text-slate-900 text-left">
            {topic.name}
          </h3>
        </div>

        <div className="flex items-center gap-6">
          {/* Progress Bar */}
          <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {/* Count */}
          <span className="text-sm font-medium text-slate-600 min-w-[60px] text-right">
            {topic.solved} / {topic.total}
          </span>
        </div>
      </button>

      {/* Problem List - Expanded */}
      {isExpanded && (
        <div className="border-t border-slate-200 bg-slate-50">
          {topic.problems.map((problem, index) => (
            <ProblemRow
              key={problem.id || problem._id || `${problem.title}-${index}`}
              problem={problem}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

/* ============ PROBLEM ROW COMPONENT ============ */
function ProblemRow({ problem, onStatusChange }) {
  const difficultyColors = {
    Easy: "bg-green-100 text-green-700 border-green-300",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Hard: "bg-red-100 text-red-700 border-red-300",
  };

  const statusOptions = [
    { value: "none", label: "Not Started", color: "bg-slate-100 text-slate-700" },
    { value: "solved", label: "✓ Solved", color: "bg-green-100 text-green-700" },
    { value: "revising", label: "↻ Revising", color: "bg-blue-100 text-blue-700" },
    { value: "weak", label: "⚠ Weak", color: "bg-orange-100 text-orange-700" },
  ];

  const currentStatus = statusOptions.find(s => s.value === problem.status) || statusOptions[0];

  return (
    <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 last:border-b-0 hover:bg-white transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          {problem.id && (
            <span className="text-xs text-slate-500 font-mono">#{problem.id.toString().slice(0, 8)}</span>
          )}
          <h4 className="text-sm font-medium text-slate-900 truncate">
            {problem.title}
          </h4>
          <span className={`px-2 py-0.5 text-xs font-medium rounded border ${difficultyColors[problem.difficulty] || difficultyColors.Medium}`}>
            {problem.difficulty}
          </span>
        </div>
        {problem.link && (
          <a
            href={problem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline mt-1 inline-block"
          >
            View Problem →
          </a>
        )}
      </div>

      {/* Status Selector */}
      <select
        value={problem.status || 'none'}
        onChange={(e) => {
          const problemId = problem.id || problem._id;
          console.log('Select changed for problem ID:', problemId, 'Title:', problem.title, 'New status:', e.target.value);
          if (problemId) {
            onStatusChange(problemId, e.target.value);
          } else {
            console.error('Cannot update problem - no ID found:', problem);
          }
        }}
        className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentStatus.color}`}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
