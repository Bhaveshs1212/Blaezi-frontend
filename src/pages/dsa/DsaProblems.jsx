import { useMemo, useState, useEffect } from "react";
import { useDsa } from "../../context/DsaContext";
import { daysSince } from "../../utils/time";

import Breadcrumbs from "../../components/common/Breadcrumbs";
import Pagination from "../../components/common/Pagination";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const ITEMS_PER_PAGE = 10;

export default function DsaProblems() {
  const { problems, updateProblemStatus } = useDsa();

  /* ------------------ UI STATE ------------------ */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] =
    useState("all");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [difficultyDropdownOpen, setDifficultyDropdownOpen] = useState(false);

  /* ------------------ RESET SELECTION ON CONTEXT CHANGE ------------------ */
  useEffect(() => {
    setSelectedIds([]);
  }, [search, statusFilter, difficultyFilter, page]);

  /* ------------------ FILTER + SEARCH ------------------ */
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch = p.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        p.status === statusFilter;

      const matchesDifficulty =
        difficultyFilter === "all" ||
        p.difficulty === difficultyFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDifficulty
      );
    });
  }, [
    problems,
    search,
    statusFilter,
    difficultyFilter,
  ]);

  /* ------------------ PAGINATION ------------------ */
  const totalPages = Math.ceil(
    filteredProblems.length / ITEMS_PER_PAGE
  );

  const paginatedProblems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredProblems.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredProblems, page]);

  /* ------------------ SELECTION HANDLERS ------------------ */
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const bulkUpdateStatus = (status) => {
    selectedIds.forEach((id) => {
      updateProblemStatus(id, status);
    });
    clearSelection();
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">DSA Problems</h1>
        <p className="text-sm text-slate-600">
          Filter, revise, and track confidence over time
        </p>
      </div>


      <Breadcrumbs
        items={[
          { label: "DSA", href: "/dsa" },
          { label: "Problems" },
        ]}
      />

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative min-w-[180px]">
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              onBlur={() => setTimeout(() => setStatusDropdownOpen(false), 200)}
              className="w-full pl-4 pr-10 py-2.5 bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-50 border-2 border-blue-300 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105 hover:bg-gradient-to-br hover:from-blue-200 hover:via-indigo-200 hover:to-blue-100 text-left"
            >
              {statusFilter === "all" ? "All Status" : statusFilter === "solved" ? "✓ Solved" : statusFilter === "revising" ? "↻ Revising" : "⚠ Weak"}
            </button>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-700 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
            
            {statusDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border-2 border-blue-200 overflow-hidden">
                <div className="py-1">
                  {[
                    { value: "all", label: "All Status", icon: "" },
                    { value: "solved", label: "Solved", icon: "✓" },
                    { value: "revising", label: "Revising", icon: "↻" },
                    { value: "weak", label: "Weak", icon: "⚠" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setPage(1);
                        setStatusDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-2 transition-all duration-200 ${
                        statusFilter === option.value
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold"
                          : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-slate-700 font-medium"
                      }`}
                    >
                      {option.icon && <span className="text-lg">{option.icon}</span>}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Difficulty Dropdown */}
          <div className="relative min-w-[180px]">
            <button
              onClick={() => setDifficultyDropdownOpen(!difficultyDropdownOpen)}
              onBlur={() => setTimeout(() => setDifficultyDropdownOpen(false), 200)}
              className="w-full pl-4 pr-10 py-2.5 bg-gradient-to-br from-purple-100 via-violet-100 to-purple-50 border-2 border-purple-300 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105 hover:bg-gradient-to-br hover:from-purple-200 hover:via-violet-200 hover:to-purple-100 text-left"
            >
              {difficultyFilter === "all" ? "All Difficulty" : difficultyFilter}
            </button>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-700 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
            
            {difficultyDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border-2 border-purple-200 overflow-hidden">
                <div className="py-1">
                  {[
                    { value: "all", label: "All Difficulty", color: "", bgColor: "" },
                    { value: "Easy", label: "Easy", color: "text-blue-600", bgColor: "bg-blue-50", hoverBg: "hover:from-blue-100 hover:to-indigo-100", selectedBg: "from-blue-500 to-blue-600" },
                    { value: "Medium", label: "Medium", color: "text-indigo-600", bgColor: "bg-indigo-50", hoverBg: "hover:from-indigo-100 hover:to-purple-100", selectedBg: "from-indigo-500 to-purple-500" },
                    { value: "Hard", label: "Hard", color: "text-violet-600", bgColor: "bg-violet-50", hoverBg: "hover:from-violet-100 hover:to-purple-100", selectedBg: "from-violet-600 to-purple-600" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setDifficultyFilter(option.value);
                        setPage(1);
                        setDifficultyDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-200 ${
                        difficultyFilter === option.value
                          ? `bg-gradient-to-r ${option.selectedBg || "from-purple-500 to-violet-500"} text-white font-semibold shadow-md`
                          : `${option.color || "text-slate-700"} font-medium hover:bg-gradient-to-r ${option.hoverBg || "hover:from-purple-50 hover:to-violet-50"}`
                      }`}
                    >
                      {option.value !== "all" && (
                        <span className={`w-3 h-3 rounded-full ${
                          option.value === "Easy" ? "bg-blue-500" :
                          option.value === "Medium" ? "bg-indigo-500" :
                          "bg-violet-500"
                        }`}></span>
                      )}
                      <span>{option.label}</span>
                      {option.value === "Easy" && <span className="ml-auto text-xs opacity-70">⭐</span>}
                      {option.value === "Medium" && <span className="ml-auto text-xs opacity-70">⭐⭐</span>}
                      {option.value === "Hard" && <span className="ml-auto text-xs opacity-70">⭐⭐⭐</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
          <span className="text-sm font-semibold text-blue-700">
            {selectedIds.length} selected
          </span>

          <button
            onClick={() =>
              bulkUpdateStatus("solved")
            }
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md text-sm font-medium hover:shadow-md transition-all"
          >
            Mark Solved
          </button>

          <button
            onClick={() =>
              bulkUpdateStatus("revising")
            }
            className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-md text-sm font-medium hover:shadow-md transition-all"
          >
            Mark Revising
          </button>

          <button
            onClick={() =>
              bulkUpdateStatus("weak")
            }
            className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-md text-sm font-medium hover:shadow-md transition-all"
          >
            Mark Weak
          </button>

          <button
            onClick={clearSelection}
            className="ml-auto text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Problems List */}
      <div className="space-y-4">
        {paginatedProblems.map((problem) => (
          <Card key={problem.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(
                      problem.id
                    )}
                    onChange={() =>
                      toggleSelect(problem.id)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />

                  <CardTitle className="text-base font-semibold text-slate-900">
                    {problem.title}
                  </CardTitle>
                </div>

                <Badge
                  className={
                    problem.status === "solved"
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : problem.status === "revising"
                      ? "bg-purple-100 text-purple-700 border border-purple-200"
                      : problem.status === "weak"
                      ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }
                >
                  {problem.status || "untracked"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex gap-4 text-xs font-medium text-slate-600">
                <span>
                  Difficulty: <span className="text-slate-900">{problem.difficulty}</span>
                </span>
                <span>Topic: <span className="text-slate-900">{problem.topic}</span></span>
              </div>

              {problem.lastSolvedAt && (
                <p className="text-xs text-slate-500">
                  Last practiced{" "}
                  {daysSince(problem.lastSolvedAt)}{" "}
                  days ago
                </p>
              )}

              <div className="flex gap-2 text-sm pt-2">
                <button
                  onClick={() =>
                    updateProblemStatus(
                      problem.id,
                      "solved"
                    )
                  }
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md font-medium hover:shadow-md transition-all"
                >
                  Solved
                </button>

                <button
                  onClick={() =>
                    updateProblemStatus(
                      problem.id,
                      "revising"
                    )
                  }
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-md font-medium hover:shadow-md transition-all"
                >
                  Revising
                </button>

                <button
                  onClick={() =>
                    updateProblemStatus(
                      problem.id,
                      "weak"
                    )
                  }
                  className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-md font-medium hover:shadow-md transition-all"
                >
                  Weak
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
///select and bulkselect needs to be undersrood deeply