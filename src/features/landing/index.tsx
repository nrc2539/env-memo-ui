import { Link } from "react-router";
import { IconLeaf } from "@tabler/icons-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-teal-50 px-4">
      <div className="w-full max-w-lg text-center">
        <div className="rounded-2xl bg-white p-10 shadow-lg sm:p-12">
          <div className="flex items-center justify-center gap-2">
            <IconLeaf size={36} className="text-teal-600" />
            <h1 className="text-4xl font-bold text-teal-600">EnvMemo</h1>
          </div>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            A lightweight tool for managing environment variables and
            configuration memos across your projects. Keep your environment
            notes organized, accessible, and always up to date.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
