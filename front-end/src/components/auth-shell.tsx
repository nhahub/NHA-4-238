import { Link } from "@tanstack/react-router";
import { Brand } from "./brand";
import heroImg from "@/assets/hero-athlete.jpg";
import type { ReactNode } from "react";
import type { InputHTMLAttributes } from "react";
interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-carbon text-white lg:grid-cols-2">
      <div className="flex flex-col justify-between px-6 py-8 sm:px-12 lg:px-16">
        <Brand />
        <div className="mx-auto w-full max-w-md py-12">
          <h1 className="text-3xl font-extrabold tracking-tighter sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-white/50">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-white/60">{footer}</div>
        </div>
        <Link
          to="/"
          className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white"
        >
          ← Back to home
        </Link>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={heroImg}
          alt=""
          width={1600}
          height={1024}
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-carbon/60" />
        <div className="absolute bottom-12 left-12 right-12">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-volt">
            IronCore Academy
          </div>
          <p className="mt-4 max-w-md text-3xl font-extrabold tracking-tighter">
            "Discipline is the only variable. Show up, and we'll do the rest."
          </p>
          <p className="mt-4 text-sm text-white/60">— Viktor Drago, Head Coach</p>
        </div>
      </div>
    </div>
  );
}

export function AuthInput({ label, ...inputProps }: AuthInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/40">
        {label}
      </span>
      <input
        {...inputProps}
        className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm placeholder:text-white/30 focus:border-volt focus:outline-none"
      />
    </label>
  );
}
