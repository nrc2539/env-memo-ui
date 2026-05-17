import { Tag } from "@/components/Tag";

import type { InvitationTableProps } from "./interface";

export function InvitationTable({ invitations }: InvitationTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
            <th className="px-2 sm:px-3 py-3">Email</th>
            <th className="px-2 sm:px-3 py-3">Role</th>
            <th className="px-2 sm:px-3 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((inv) => (
            <tr
              key={inv.id}
              className="border-b border-gray-100 text-sm last:border-0"
            >
              <td className="max-w-28 sm:max-w-50 truncate px-2 sm:px-3 py-3 font-medium text-gray-900">
                {inv.email}
              </td>
              <td className="px-2 sm:px-3 py-3">
                <Tag className="bg-blue-50 text-blue-700">{inv.role}</Tag>
              </td>
              <td className="px-2 sm:px-3 py-3">
                <Tag className="bg-yellow-50 text-yellow-700">{inv.status}</Tag>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
