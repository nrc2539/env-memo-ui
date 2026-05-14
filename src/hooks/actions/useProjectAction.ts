import type { Project } from "@/features/project/pages/ProjectListPage/interface";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockProjects: Project[] = [
  { id: 1, name: "Frontend App", envs: 12, updated: "2 hours ago", color: "bg-teal-500" },
  { id: 2, name: "Backend API", envs: 8, updated: "1 day ago", color: "bg-blue-500" },
  { id: 3, name: "Mobile App", envs: 6, updated: "3 days ago", color: "bg-purple-500" },
  { id: 4, name: "Staging Config", envs: 4, updated: "1 week ago", color: "bg-amber-500" },
  { id: 5, name: "CI/CD Pipeline", envs: 3, updated: "2 weeks ago", color: "bg-rose-500" },
  { id: 6, name: "Analytics Service", envs: 9, updated: "3 weeks ago", color: "bg-indigo-500" },
];

let nextId = 7;

export function useProjectAction() {
  async function getProjects(): Promise<Project[]> {
    await delay(500);
    return [...mockProjects];
  }

  async function createProject(name: string): Promise<Project> {
    await delay(500);
    const newProject: Project = {
      id: nextId++,
      name,
      envs: 0,
      updated: "Just now",
      color: "bg-teal-500",
    };
    mockProjects.push(newProject);
    return newProject;
  }

  async function updateProject(id: number, name: string): Promise<Project> {
    await delay(500);
    const project = mockProjects.find((p) => p.id === id);
    if (!project) throw new Error("Project not found");
    project.name = name;
    project.updated = "Just now";
    return project;
  }

  async function deleteProject(id: number): Promise<void> {
    await delay(500);
    const index = mockProjects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Project not found");
    mockProjects.splice(index, 1);
  }

  return {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}