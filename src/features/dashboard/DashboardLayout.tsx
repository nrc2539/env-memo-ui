import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { IconFolder, IconSettings, IconLogout, IconMenu2 } from "@tabler/icons-react";

const navItems = [
  { to: "/dashboard/projects", label: "Projects", icon: IconFolder },
  { to: "/dashboard/settings", label: "Settings", icon: IconSettings },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-teal-700 transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 px-6">
          <Link to="/dashboard/projects" className="text-xl font-bold text-white">
            EnvMemo
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-teal-800 text-white"
                    : "text-teal-100 hover:bg-teal-600 hover:text-white"
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-teal-600 px-3 py-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-teal-100 transition hover:bg-teal-600 hover:text-white"
          >
            <IconLogout size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <IconMenu2 size={24} />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
              JD
            </div>
            <span className="text-sm font-medium text-gray-700">John Doe</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-hidden p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


