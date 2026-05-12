import { useState } from "react";
import { Link } from "react-router";
import AuthLayout from "../../components/AuthLayout";
import { IconMail } from "@tabler/icons-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AuthLayout title="Check your email">
        <div className="mt-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
            <IconMail size={32} className="text-teal-600" />
          </div>
          <p className="mt-6 text-sm text-gray-600">
            We&apos;ve sent a password reset link to <strong>{email}</strong>.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Check your inbox and follow the instructions to reset your password.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-block w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
          >
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Forgot password?" subtitle="No worries, we'll send you reset instructions.">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            placeholder="Enter your email"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
        >
          Send reset link
        </button>

        <p className="text-center text-sm text-gray-500">
          <Link to="/login" className="font-medium text-teal-600 transition hover:text-teal-500">
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
