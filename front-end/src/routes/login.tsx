import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell, AuthInput } from "@/components/auth-shell";
import { VoltButton } from "@/components/ui-bits";
import { useAuth } from "@/contexts/auth-context";
import type { Role } from "@/types/auth";
import { getRoleLandingPath } from "@/lib/auth-routes";

// login.tsx
export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({ meta: [{ title: "Login — IronCore" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const usernameOrEmail = String(formData.get("usernameOrEmail") ?? "");
    const password = String(formData.get("password") ?? "");
    const rememberMe = formData.get("rememberMe") === "on";

    setIsSubmitting(true);
    try {
      const user = await login({ usernameOrEmail, password }, rememberMe);
      navigate({ to: redirect ?? getRoleLandingPath(user.role) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back."
      subtitle="Log in to continue training."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="font-bold text-volt">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Username or Email"
          name="usernameOrEmail"
          type="text"
          placeholder="you@example.com"
          required
        />
        <AuthInput
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-white/60">
            <input
              type="checkbox"
              name="rememberMe"
              className="h-3.5 w-3.5 rounded border-white/20 bg-slate-900 accent-volt"
            />
            Remember me
          </label>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <VoltButton type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign In"}
        </VoltButton>
      </form>
    </AuthShell>
  );
}
