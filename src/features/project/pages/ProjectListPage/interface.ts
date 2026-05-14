export interface Project {
  id: number;
  name: string;
  envs: number;
  updated: string;
  color: string;
}

export interface ProjectListPageProps {
  projects?: Project[];
}