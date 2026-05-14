import { Link } from "react-router";

import type { ProjectListPageProps } from "./interface";

const defaultProjects: ProjectListPageProps["projects"] = [
  { id: 1, name: "Frontend App", envs: 12, updated: "2 hours ago", color: "bg-teal-500" },
  { id: 2, name: "Backend API", envs: 8, updated: "1 day ago", color: "bg-blue-500" },
  { id: 3, name: "Mobile App", envs: 6, updated: "3 days ago", color: "bg-purple-500" },
  { id: 4, name: "Staging Config", envs: 4, updated: "1 week ago", color: "bg-amber-500" },
  { id: 5, name: "CI/CD Pipeline", envs: 3, updated: "2 weeks ago", color: "bg-rose-500" },
  { id: 6, name: "Analytics Service", envs: 9, updated: "3 weeks ago", color: "bg-indigo-500" },
];

export default function ProjectListPage({ projects = defaultProjects }: ProjectListPageProps) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <button
          type="button"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
        >
          New Project
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${project.color}`}>
                <span className="text-sm font-bold text-white">
                  {project.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-gray-900">{project.name}</h3>
                <p className="text-xs text-gray-500">{project.envs} environments</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-400">Updated {project.updated}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}