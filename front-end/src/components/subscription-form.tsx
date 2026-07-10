import { type FormEvent, useState } from "react";
import { Save, Search, Package } from "lucide-react";
import type { Plan } from "@/types/domain/plan";
import type { PackageOption } from "@/types/domain/package";
import type { MemberDto } from "@/types/domain/member";

export type SubscriptionFormValues = {
  memberId: number;
  packageId: number;
};

type SubscriptionFormProps = {
  plans: Plan[];
  packages: PackageOption[];
  isSubmitting?: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit: (values: SubscriptionFormValues) => void;
  onLookupMember: (id: number) => Promise<MemberDto | null>;
};

export function SubscriptionForm({
  plans,
  packages,
  isSubmitting = false,
  error,
  onCancel,
  onSubmit,
  onLookupMember,
}: SubscriptionFormProps) {
  const [memberId, setMemberId] = useState("");
  const [foundMember, setFoundMember] = useState<MemberDto | null>(null);
  const [memberError, setMemberError] = useState<string | null>(null);
  const [isLooking, setIsLooking] = useState(false);
  const [planFilter, setPlanFilter] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  const filteredPackages = planFilter
    ? packages.filter((p) => String(p.planId) === planFilter)
    : packages;

  async function handleLookup() {
    const id = Number(memberId);
    if (!id) {
      setMemberError("Enter a valid member ID.");
      return;
    }
    setMemberError(null);
    setFoundMember(null);
    setIsLooking(true);
    try {
      const member = await onLookupMember(id);
      if (member) setFoundMember(member);
      else setMemberError(`No member found with ID ${id}.`);
    } catch {
      setMemberError("Could not find member. Check the ID and try again.");
    } finally {
      setIsLooking(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!foundMember) {
      setMemberError("Look up a member first.");
      return;
    }
    if (!selectedPackage) return;
    onSubmit({ memberId: foundMember.id, packageId: Number(selectedPackage) });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* ── Member lookup ── */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-white/50">Member ID</span>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            placeholder="Enter member ID…"
            value={memberId}
            onChange={(e) => {
              setMemberId(e.target.value);
              setFoundMember(null);
              setMemberError(null);
            }}
            className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-volt/50 focus:outline-none"
          />
          <button
            type="button"
            disabled={isLooking || !memberId}
            onClick={handleLookup}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white/70 hover:bg-white/10 disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            {isLooking ? "Looking…" : "Lookup"}
          </button>
        </div>

        {/* Member not found */}
        {memberError && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {memberError}
          </div>
        )}

        {/* Member found */}
        {foundMember && (
          <div className="flex items-center gap-3 rounded-lg border border-volt/20 bg-volt/5 px-3 py-2.5">
            {foundMember.imageUrl ? (
              <img
                src={foundMember.imageUrl}
                alt={foundMember.firstName}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xs font-bold text-white/50">
                {foundMember.firstName[0]}
                {foundMember.lastName[0]}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-bold text-white">
                {foundMember.firstName} {foundMember.lastName}
              </div>
              <div className="text-xs text-white/50">{foundMember.email}</div>
            </div>
            <span className="ml-auto rounded-full bg-volt/20 px-2 py-0.5 text-[10px] font-bold text-volt">
              ✓ Found
            </span>
          </div>
        )}
      </div>

      {/* ── Plan filter ── */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-white/50">
          Filter by Plan <span className="normal-case text-white/30">(optional)</span>
        </span>
        <select
          value={planFilter}
          onChange={(e) => {
            setPlanFilter(e.target.value);
            setSelectedPackage("");
          }}
          className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white focus:border-volt/50 focus:outline-none"
        >
          <option value="">All plans</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* ── Package selector ── */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-white/50">Package</span>

        {filteredPackages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/10 py-6 text-center text-sm text-white/30">
            No packages for this plan.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPackages.map((pkg) => (
              <label
                key={pkg.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                  selectedPackage === String(pkg.id)
                    ? "border-volt/40 bg-volt/5"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <input
                  type="radio"
                  name="packageId"
                  value={pkg.id}
                  checked={selectedPackage === String(pkg.id)}
                  onChange={() => setSelectedPackage(String(pkg.id))}
                  className="accent-volt"
                  required
                />
                <Package className="h-4 w-4 shrink-0 text-white/40" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-white">{pkg.title}</div>
                  <div className="text-xs text-white/40">
                    {pkg.planTitle} · {pkg.numberOfMonthes} month
                    {pkg.numberOfMonthes === 1 ? "" : "s"} · {pkg.numberOfSessions} sessions
                  </div>
                </div>
                <div className="shrink-0 text-sm font-bold text-volt">${pkg.price}</div>
              </label>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-bold text-white/70 transition-colors hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !foundMember || !selectedPackage}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-volt px-5 py-2.5 text-sm font-bold text-carbon transition-all hover:scale-105 hover:shadow-volt disabled:pointer-events-none disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Saving..." : "Create Subscription"}
        </button>
      </div>
    </form>
  );
}
