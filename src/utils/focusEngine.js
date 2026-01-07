/**
 * Decide what the user should focus on
 * based on normalized pressure across pillars.
 *
 * @param {Array} pressureProfile
 * [
 *   { pillar: "projects", label: "Projects", pressure: number },
 *   { pillar: "dsa", label: "DSA", pressure: number },
 *   { pillar: "career", label: "Career / Exams", pressure: number }
 * ]
 */
export function getFocusRecommendation(pressureProfile) {
  if (!pressureProfile || pressureProfile.length === 0) {
    return {
      title: "Balanced Progress Achieved 🎯",
      message:
        "All pillars are stable. Maintain your current rhythm.",
      reason: "No pressure data available.",
      action: "maintain",
      level: "success",
    };
  }

  // Sort pillars by pressure (highest first)
  // When pressures are equal or very close (within 5 points), prioritize DSA
  const sorted = [...pressureProfile].sort((a, b) => {
    const diff = b.pressure - a.pressure;
    
    // If pressures are very close (within 5 points), prioritize DSA
    if (Math.abs(diff) <= 5) {
      if (a.pillar === "dsa") return -1;
      if (b.pillar === "dsa") return 1;
    }
    
    return diff;
  });

  const top = sorted[0];

  // If overall pressure is low, user is balanced
  if (top.pressure < 30) {
    return {
      title: "Balanced Progress Achieved 🎯",
      message:
        "All pillars are stable. Maintain your current rhythm.",
      reason: "No pillar shows significant pressure.",
      action: "maintain",
      level: "success",
    };
  }

  return {
    title: `${top.label} Need Attention`,
    message: `Your ${top.label.toLowerCase()} pillar requires focus right now.`,
    reason: `${top.label} pressure (${top.pressure}) is currently the highest.`,
    action: top.pillar,
    level: top.pressure > 70 ? "danger" : "warning",
  };
}
