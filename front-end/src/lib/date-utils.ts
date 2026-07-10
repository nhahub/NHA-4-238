// src/lib/date-utils.ts

/** Backend sends dates as "yyyy-MM-dd" (see MemberDto/StaffDto DTOs). Pass through if valid, else empty. */
export function toDateInputValue(raw?: string | null): string {
  if (!raw) return "";
  return /^\d{4}-\d{2}-\d{2}/.test(raw) ? raw.slice(0, 10) : "";
}

/** For display purposes (e.g. "Member since"), not for form inputs. */
export function formatDisplayDate(raw?: string | null): string {
  if (!raw) return "N/A";
  const date = new Date(raw);
  return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
}