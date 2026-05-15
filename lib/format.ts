/**
 * Indian currency formatter (lakh / crore convention).
 */
export function formatINR(value: number, opts?: { decimals?: number; compact?: boolean }): string {
  const { decimals = 0, compact = false } = opts ?? {};
  if (!Number.isFinite(value)) return "₹ 0";
  if (compact) {
    const abs = Math.abs(value);
    if (abs >= 1e7) return `₹${(value / 1e7).toFixed(2)} Cr`;
    if (abs >= 1e5) return `₹${(value / 1e5).toFixed(2)} L`;
    if (abs >= 1e3) return `₹${(value / 1e3).toFixed(1)}K`;
    return `₹${value.toFixed(0)}`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

export function formatNumberIN(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

/** dd-MM-yyyy required by AdvisorKhoj. */
export function toAhDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function fromAhDate(s: string): Date | null {
  // accepts dd-MM-yyyy or yyyy-MM-dd
  const m1 = /^(\d{2})-(\d{2})-(\d{4})$/.exec(s);
  if (m1) return new Date(+m1[3], +m1[2] - 1, +m1[1]);
  const m2 = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m2) return new Date(+m2[1], +m2[2] - 1, +m2[3]);
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}
