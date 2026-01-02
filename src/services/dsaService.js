// This file is the ONLY place that talks to backend

export async function fetchDsaProblems() {
  // 🔹 Later replace with real API
  // return fetch("/api/dsa/problems").then(res => res.json());

  // TEMP: fallback mock (so app still works)
  const module = await import("../data/dsaProblems");
  return module.dsaProblems;
}

export async function updateProblemStatus(id, status) {
  // 🔹 Real backend call later
  // return fetch(`/api/dsa/problems/${id}`, {
  //   method: "PATCH",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ status }),
  // });

  // TEMP: simulate success
  return { success: true };
}
