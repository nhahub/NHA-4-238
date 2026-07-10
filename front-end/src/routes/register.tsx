import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell, AuthInput } from "@/components/auth-shell";
import { VoltButton } from "@/components/ui-bits";
import { useAuth } from "@/contexts/auth-context";
import { getRoleLandingPath } from "@/lib/auth-routes";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — IronCore" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");
    const agreed = data.get("agreeTerms") === "on";

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the terms & privacy policy.");
      return;
    }

    const image = data.get("image");
    if (image instanceof File && image.size === 0) {
      data.delete("image"); // don't send an empty file input
    }

    setIsSubmitting(true);
    try {
      const user = await register(data);
      navigate({ to: getRoleLandingPath(user.role) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Join IronCore."
      subtitle="Build your athlete profile in under 60 seconds."
      footer={
        <>
          Already a member?{" "}
          <Link to="/login" className="font-bold text-volt">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <AuthInput label="First name" name="firstName" placeholder="Marcus" required />
          <AuthInput label="Last name" name="lastName" placeholder="Thorne" required />
        </div>
        <AuthInput label="Date of birth" name="birthDate" type="date" required />
        <AuthInput label="Email" name="email" type="email" placeholder="you@example.com" required />
        <AuthInput
          label="Phone"
          name="phoneNumber"
          type="tel"
          placeholder="+1 (555) 010-0000"
          required
        />
        <AuthInput
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
        <AuthInput
          label="Confirm password"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
        />
        <AuthInput label="Profile photo (optional)" name="image" type="file" accept="image/*" />

        <label className="flex items-start gap-2 text-xs text-white/60">
          <input
            type="checkbox"
            name="agreeTerms"
            className="mt-0.5 h-3.5 w-3.5 rounded border-white/20 bg-slate-900 accent-volt"
          />
          I agree to the <span className="text-volt">terms</span> &{" "}
          <span className="text-volt">privacy policy</span>.
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <VoltButton type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create Account"}
        </VoltButton>
      </form>
    </AuthShell>
  );
}
