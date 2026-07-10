import { Link } from "@tanstack/react-router";

export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-volt shadow-volt">
        <div className="h-3 w-3 rotate-45 rounded-sm bg-carbon" />
      </div>
      <span className="text-lg font-extrabold uppercase italic tracking-tighter">
        Iron<span className="text-volt">Core</span>
      </span>
    </Link>
  );
}