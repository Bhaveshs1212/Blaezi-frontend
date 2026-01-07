import { useMemo, useState } from "react";
import { useProjects } from "../../context/ProjectContext";
import { useAuth } from "../../context/AuthContext";
import ProjectCard from "./ProjectCard";
import { daysSince } from "../../utils/time";
import { Button } from "../../components/ui/button";
import { Github } from "lucide-react";

export default function Projects() {
  const { projects, syncProjects } = useProjects();
  const { user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const handleGitHubSync = async () => {
    setSyncing(true);
    setSyncMessage("");
    
    try {
      // Check if user has GitHub username configured
      if (!user?.githubUsername) {
        setSyncMessage("Please add your GitHub username in Settings first!");
        setTimeout(() => setSyncMessage(""), 5000);
        setSyncing(false);
        return;
      }

      setSyncMessage("🔄 Syncing repositories from GitHub...");

      // Backend handles fetching from GitHub and storing
      const result = await syncProjects(user.githubUsername);
      
      console.log('Sync result:', result);
      
      if (!result.count || result.count === 0) {
        setSyncMessage("⚠️ No repositories were synced. Check if your GitHub username has public repos or if backend has validation errors.");
      } else {
        setSyncMessage(`✓ Successfully synced ${result.count || result.synced || 0} repositories from GitHub!`);
      }
      setTimeout(() => setSyncMessage(""), 8000);
    } catch (error) {
      console.error('GitHub sync error:', error);
      let errorMsg = 'Sync failed';
      
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setSyncMessage(`❌ ${errorMsg}`);
      setTimeout(() => setSyncMessage(""), 8000);
    } finally {
      setSyncing(false);
    }
  };

  // Use backend's healthStatus, override only if status is completed
  const projectsWithHealth = useMemo(() => {
    if (!Array.isArray(projects)) return [];
    
    return projects.map((project) => {
      // If project is marked as completed, show completed status
      const health = project.status === 'completed' 
        ? 'completed' 
        : (project.healthStatus || 'on-track');

      return { 
        ...project, 
        health,
        title: project.name || project.title || 'Untitled Project',
        milestones: project.milestones || []
      };
    });
  }, [projects]);

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <header className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Projects
          </h1>
          <p className="text-lg text-gray-500 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Track execution and maintain momentum
          </p>
        </div>
        
        {/* GitHub Sync Button */}
        <Button
          onClick={handleGitHubSync}
          disabled={syncing}
          className="flex items-center gap-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-full px-6 py-3 font-semibold"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <Github className="w-4 h-4" />
          {syncing ? "Syncing..." : "Sync from GitHub"}
        </Button>
      </header>

      {/* Sync Message */}
      {syncMessage && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
          {syncMessage}
        </div>
      )}

      {/* OVERVIEW */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <OverviewCard
          label="On Track"
          value={projectsWithHealth.filter(p => p.health === "on-track").length}
          color="text-[#6366F1]"
        />
        <OverviewCard
          label="At Risk"
          value={projectsWithHealth.filter(p => p.health === "at-risk").length}
          color="text-[#6366F1]"
        />
        <OverviewCard
          label="Delayed"
          value={projectsWithHealth.filter(p => p.health === "delayed").length}
          color="text-[#6366F1]"
        />
      </section>

      {/* PROJECT LIST */}
      <section className="space-y-6">
        {projectsWithHealth.length === 0 ? (
          <EmptyState />
        ) : (
          projectsWithHealth.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </section>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function OverviewCard({ label, value, color }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</p>
      <p className={`text-4xl font-bold ${color}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-16 text-center">
      <p className="text-gray-600 text-lg font-light mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        No projects yet
      </p>
      <p className="text-gray-500 text-base font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Sync from GitHub to start tracking your projects
      </p>
    </div>
  );
}
