import { Link } from "react-router";
import { DateTime } from "luxon";

import { ProjectMenu } from "@/features/project/components/ProjectMenu";
import { Role } from "@/enums/roleEnum";
import type { ProjectCardProps } from "./interface";

function relativeTime(date: string): string {
  const relative = DateTime.fromISO(date).toRelative();
  return relative ?? "unknown";
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const isOwner = project.role === Role.OWNER;

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      {isOwner && (
        <div className="absolute right-4 top-4 flex items-center gap-1">
          <ProjectMenu project={project} onEdit={onEdit} onDelete={onDelete} />
        </div>
      )}

      <Link to={`/projects/${project.id}`} className="block">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-gray-900">
            {project.name}
          </h3>
          <p className="text-xs text-gray-500">
            {project.description || "No description"}
          </p>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Updated {relativeTime(project.updatedAt)}
        </p>
      </Link>
    </div>
  );
}
