import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { fetchProjects, updateProject, syncFromGitHub } from "../services/projectService";
import { useAuth } from "./AuthContext";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  console.log('[ProjectProvider] RENDER');
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from backend
  // Re-fetch when user authentication changes
  useEffect(() => {
    const loadProjects = async () => {
      // Don't fetch while auth is still loading
      if (authLoading) {
        return;
      }
      
      if (!isAuthenticated) {
        setProjects([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetchProjects();
        // Backend returns { success, data } format
        const data = response.data || response;
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [authLoading, isAuthenticated]);

  const toggleMilestone = useCallback(async (projectId, milestoneId, completed) => {
    try {
      // Update on backend
      await updateProject(projectId, {
        'milestones.$.completed': completed,
        lastWorkedAt: new Date().toISOString()
      });

      // Update local state
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId || project._id === projectId
            ? {
                ...project,
                lastWorkedAt: new Date().toISOString(),
                milestones: project.milestones.map((m) =>
                  m.id === milestoneId
                    ? { ...m, completed }
                    : m
                ),
              }
            : project
        )
      );
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  }, []);

  const updateProjectStatus = useCallback(async (projectId, status) => {
    try {
      // Update on backend
      await updateProject(projectId, { status });

      // Update local state
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId || project._id === projectId
            ? { ...project, status }
            : project
        )
      );
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  }, []);

  // Sync projects from GitHub - backend handles the fetching
  const syncProjects = useCallback(async (githubUsername) => {
    try {
      const result = await syncFromGitHub(githubUsername);
      // Reload projects after sync
      const response = await fetchProjects();
      const data = response.data || response;
      setProjects(Array.isArray(data) ? data : []);
      return result;
    } catch (error) {
      console.error('Error syncing from GitHub:', error);
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({ projects, toggleMilestone, updateProjectStatus, syncProjects, loading }),
    [projects, loading]
  );

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectContext);
}
