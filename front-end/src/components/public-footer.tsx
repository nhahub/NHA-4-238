import { Link } from "@tanstack/react-router";
import { Brand } from "./brand";
import { Instagram, Twitter, Youtube } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-white/5 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <Brand />
            <p className="max-w-xs text-sm text-white/50">
              High-performance management for academies, trainers, and athletes who treat training
              as a discipline.
            </p>
            <div className="flex gap-3 text-white/40">
              <a href="#" aria-label="Instagram" className="hover:text-volt">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-volt">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-volt">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
          <FooterCol
            title="Academy"
            links={[
              ["Sports", "/sports"],
              ["Training Plans", "/plans"],
              ["Packages", "/packages"],
              ["Trainers", "/trainers"],
            ]}
          />
          <FooterCol
            title="Account"
            links={[
              ["Login", "/login"],
              ["Register", "/register"],
            ]}
          />
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
              Contact
            </h4>
            <p className="text-sm text-white/60">
              412 Iron Street, Suite 9<br />
              Brooklyn, NY 11211
            </p>
            <p className="text-sm text-white/60">
              hello@ironcore.fit
              <br />
              +1 (555) 010-IRON
            </p>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-[10px] uppercase tracking-[0.3em] text-white/30 md:flex-row md:items-center">
          <span>© 2026 IronCore Management System</span>
          <span>Built for serious operators.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">{title}</h4>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link to={href} className="text-sm text-white/60 transition-colors hover:text-volt">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
