// Shared sponsor/donation helpers. Amounts are ALWAYS authored in USD —
// the page displays dollars first, and only converts to INR at checkout
// time for Indian visitors (Razorpay settles everything to INR anyway).

export const QUICK_AMOUNTS_USD = [5, 10, 25, 50, 100] as const;
export const DEFAULT_AMOUNT_USD = 25;
export const MIN_AMOUNT_USD = 1;
export const MAX_AMOUNT_USD = 10_000;

// Hardcoded USD→INR fallback used when the live rate is unreachable.
// The server prefers the live rate (lib/fx.ts); this constant also seeds
// the client display until /api/sponsor/rate responds. Bump it if it ever
// drifts far from reality — today (Sep 2026) the market is ~95-96.
export const USD_TO_INR_RATE = 94;

export type ChargeCurrency = "USD" | "INR";

export interface DonorDetails {
  name: string;
  email: string;
  address: string;
  contact: string;
}

export const DONOR_STORAGE_KEY = "morph:sponsor:donor";

export const EMPTY_DONOR: DonorDetails = {
  name: "",
  email: "",
  address: "",
  contact: "",
};

export function usdToInr(usd: number, rate: number = USD_TO_INR_RATE): number {
  return Math.round(usd * rate);
}

/** Smallest currency subunit Razorpay expects: cents for USD, paise for INR. */
export function toSubunits(
  usd: number,
  currency: ChargeCurrency,
  rate: number = USD_TO_INR_RATE
): number {
  if (currency === "INR") return usdToInr(usd, rate) * 100;
  return Math.round(usd * 100);
}

export function formatUSD(usd: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: usd % 1 === 0 ? 0 : 2,
  }).format(usd);
}

export function formatINR(inr: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(inr);
}

export function isValidAmountUSD(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= MIN_AMOUNT_USD &&
    value <= MAX_AMOUNT_USD
  );
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Client-side heuristic: timezone Asia/Kolkata or an en-IN locale. */
export function looksLikeIndianVisitor(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return true;
  } catch {
    // ignore — fall through to language check
  }
  const lang = navigator.language ?? "";
  return lang.toLowerCase() === "en-in" || lang.toLowerCase().endsWith("-in");
}

export function loadDonorDetails(): DonorDetails {
  if (typeof window === "undefined") return { ...EMPTY_DONOR };
  try {
    const raw = window.localStorage.getItem(DONOR_STORAGE_KEY);
    if (!raw) return { ...EMPTY_DONOR };
    const parsed = JSON.parse(raw) as Partial<DonorDetails>;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      address: typeof parsed.address === "string" ? parsed.address : "",
      contact: typeof parsed.contact === "string" ? parsed.contact : "",
    };
  } catch {
    return { ...EMPTY_DONOR };
  }
}

export function saveDonorDetails(donor: DonorDetails): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DONOR_STORAGE_KEY, JSON.stringify(donor));
  } catch {
    // private mode etc. — prefill is best-effort
  }
}
