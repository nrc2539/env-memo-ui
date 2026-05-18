import { IconRefresh, IconTrash } from "@tabler/icons-react";

import { Tag } from "@/components/Tag";

import type { InvitationTableProps } from "./interface";
import { cn } from "@/libs/utils";

export function InvitationTable({
  invitations,
  resendingIds,
  onResend,
  onRemove,
}: InvitationTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
            <th className="px-2 sm:px-3 py-3">Email</th>
            <th className="px-1.5 sm:px-3 py-3">Role</th>
            <th className="px-1.5 sm:px-3 py-3">Status</th>
            <th className="w-24 px-2 sm:px-3 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((inv) => {
            const isResending = resendingIds.has(inv.id);
            return (
              <tr
                key={inv.id}
                className="border-b border-gray-100 text-sm last:border-0"
              >
                <td className="max-w-28 sm:max-w-50 truncate px-2 sm:px-3 py-3 font-medium text-gray-900">
                  {inv.email}
                </td>
                <td className="px-1.5 sm:px-3 py-3">
                  <Tag className="bg-blue-50 text-blue-700 text-[10px] md:text-xs">
                    {inv.role}
                  </Tag>
                </td>
                <td className="px-1.5 sm:px-3 py-3">
                  <Tag className="bg-yellow-50 text-yellow-700 text-[10px] md:text-xs">
                    {inv.status}
                  </Tag>
                </td>
                <td className="px-2 sm:px-3 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => onResend(inv)}
                      disabled={isResending}
                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-teal-50 hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Resend invitation"
                    >
                      <IconRefresh
                        size={16}
                        className={cn({ "animate-spin": isResending })}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(inv)}
                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      title="Remove invitation"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
