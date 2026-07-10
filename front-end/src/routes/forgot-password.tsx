import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, AuthInput } from "@/components/auth-shell";
import { VoltButton } from "@/components/ui-bits";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — IronCore" }] }),
  component: Page,
});

function Page() {
  return (
    <AuthShell
      title="Reset password."
      subtitle="We'll send a reset link to your inbox."
      footer={<>Remembered it? <Link to="/login" className="font-bold text-volt">Sign in</Link></>}
    >
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <AuthInput label="Email" type="email" placeholder="you@example.com" />
        <VoltButton type="submit" className="w-full">Send Reset Link</VoltButton>
      </form>
    </AuthShell>
  );
}