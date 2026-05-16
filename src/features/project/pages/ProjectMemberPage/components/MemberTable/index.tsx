import { IconTrash } from "@tabler/icons-react";

import { Tag } from "@/components/Tag";

import type { MemberTableProps } from "./interface";

export function MemberTable({
  members,
  currentUserId,
  isOwner,
  onRemove,
}: MemberTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            {isOwner && <th className="px-4 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
            const isSelf = member.userId === currentUserId;
            return (
              <tr
                key={member.id}
                className="border-b border-gray-100 text-sm last:border-0"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {member.user.name}
                </td>
                <td className="px-4 py-3 text-gray-500">{member.user.email}</td>
                <td className="px-4 py-3">
                  <Tag className="bg-teal-50 text-teal-700">{member.role}</Tag>
                </td>
                {isOwner && (
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onRemove(member)}
                      disabled={isSelf}
                      className="rounded-lg p-1.5 text-gray-400 transition not-disabled:hover:bg-red-50 not-disabled:hover:text-red-500 disabled:cursor-not-allowed! disabled:opacity-30"
                      title={
                        isSelf
                          ? "Cannot remove yourself"
                          : `Remove ${member.user.name}`
                      }
                    >
                      <IconTrash size={16} />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
