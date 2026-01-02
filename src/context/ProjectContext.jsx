import { createContext, useContext, useEffect, useState } from "react";
import { fetchProjects } from "../services/projectService";
const STORAGE_KEY = "blaezi_projects";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);

 useEffect(() => {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    setProjects(JSON.parse(stored));
  } else {
    fetchProjects().then((data) => {
      setProjects(data);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );
    });
  }
}, []);
useEffect(() => {
  if (projects.length > 0) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(projects)
    );
  }
}, [projects]);


  const toggleMilestone = (projectId, milestoneId, completed) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
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
  };

  return (
    <ProjectContext.Provider
      value={{ projects, toggleMilestone }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectContext);
}
