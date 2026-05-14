import { Link } from "react-router";

import { ProjectMenu } from "@/features/project/components/ProjectMenu";
import type { ProjectCardProps } from "./interface";

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="absolute right-4 top-4">
        <ProjectMenu project={project} onEdit={onEdit} onDelete={onDelete} />
      </div>

      <Link
        to={`/projects/${project.id}`}
        className="block"
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
    </div>
  );
}