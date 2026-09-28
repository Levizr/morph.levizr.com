"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Loader2,
  CheckCircle2,
  Users,
  AlertCircle,
} from "lucide-react";
import {
  QUICK_AMOUNTS_USD,
  DEFAULT_AMOUNT_USD,
  MIN_AMOUNT_USD,
  MAX_AMOUNT_USD,
  formatUSD,
  formatINR,
  usdToInr,
  isValidAmountUSD,
  isValidEmail,
  looksLikeIndianVisitor,
  loadDonorDetails,
  saveDonorDetails,
  type ChargeCurrency,
  type DonorDetails,
} from "@/lib/sponsor";

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const FALLBACK_URL = "https://razorpay.me/@levizr";

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayCheckoutInstance {
  open: () => void;
  on: (
    event: "payment.failed",
    cb: (response: { error: { description?: string } }) => void
  ) => void;
}

declare global {
  interface Window {
    Razorpay?: new (
      options: RazorpayCheckoutOptions
    ) => RazorpayCheckoutInstance;
  }
}

function loadCheckoutScript(): Promise<void> {
  if (typeof window !== "undefined" && window.Razorpay) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CHECKOUT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("checkout-load")),
        { once: true }
      );
      return;
    }
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("checkout-load"));
    document.body.appendChild(script);
  });
}

interface Supporter {
  name: string;
  amountUSD: number;
  at: string;
}

type Phase = "form" | "creating" | "verifying" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-accent";

export function DonateCard() {
  const [amount, setAmount] = useState<number>(DEFAULT_AMOUNT_USD);
  const [custom, setCustom] = useState("");
  // Lazy initializers (localStorage / locale reads) — no setState-in-effect.
  const [currency, setCurrency] = useState<ChargeCurrency>(() =>
    looksLikeIndianVisitor() ? "INR" : "USD"
  );
  const [donor, setDonor] = useState<DonorDetails>(() => loadDonorDetails());
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);
  const [paidAmount, setPaidAmount] = useState<number | null>(null);
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [totals, setTotals] = useState({ total: 0, totalUSD: 0 });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    fetch("/api/sponsor/donors")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!mounted.current || !data) return;
        setSupporters(Array.isArray(data.donors) ? data.donors : []);
        setTotals({
          total: Number(data.total) || 0,
          totalUSD: Number(data.totalUSD) || 0,
        });
      })
      .catch(() => {});
    return () => {
      mounted.current = false;
    };
  }, []);

  const refreshSupporters = useCallback(() => {
    fetch("/api/sponsor/donors")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!mounted.current || !data) return;
        setSupporters(Array.isArray(data.donors) ? data.donors : []);
        setTotals({
          total: Number(data.total) || 0,
          totalUSD: Number(data.totalUSD) || 0,
        });
      })
      .catch(() => {});
  }, []);

  const pickAmount = (value: number) => {
    setAmount(value);
    setCustom("");
  };

  const onCustomChange = (value: string) => {
    setCustom(value);
    const parsed = Number.parseFloat(value);
    setAmount(Number.isFinite(parsed) ? parsed : Number.NaN);
  };

  const fail = (message: string) => {
    if (!mounted.current) return;
    setError(message);
    setPhase("error");
  };

  const donate = async () => {
    setError(null);
    if (!isValidAmountUSD(amount)) {
      fail(`Enter an amount between $${MIN_AMOUNT_USD} and $${MAX_AMOUNT_USD.toLocaleString()}.`);
      return;
    }
    const name = donor.name.trim() || "Anonymous";
    const email = donor.email.trim();
    if (!isValidEmail(email)) {
      fail("That email doesn't look right — Razorpay needs it for your receipt.");
      return;
    }

    // Remember details on this device for next time.
    saveDonorDetails({
      name: donor.name.trim(),
      email,
      address: donor.address.trim(),
      contact: donor.contact.trim(),
    });
    setPhase("creating");

    let order: {
      orderId: string;
      amountSubunits: number;
      currency: ChargeCurrency;
      keyId: string;
    };
    try {
      const res = await fetch("/api/sponsor/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountUSD: amount,
          currency,
          name,
          email,
          address: donor.address.trim(),
          contact: donor.contact.trim(),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.orderId) {
        fail(
          data?.error ??
            "Could not start the payment. Please try again or use the direct link below."
        );
        return;
      }
      order = data;
    } catch {
      fail("Network hiccup — please check your connection and try again.");
      return;
    }

    try {
      await loadCheckoutScript();
    } catch {
      fail("Could not load the Razorpay checkout. Please try again or use the direct link below.");
      return;
    }
    if (!mounted.current || !window.Razorpay) {
      fail("Checkout didn't initialise. Please try again.");
      return;
    }

    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amountSubunits,
      currency: order.currency,
      name: "Morph",
      description: `Sponsor Morph — ${formatUSD(amount)}`,
      order_id: order.orderId,
      prefill: {
        name,
        email,
        contact: donor.contact.trim() || undefined,
      },
      notes: { amountUSD: String(amount) },
      theme: { color: "#6d28d9" },
      modal: {
        ondismiss: () => {
          if (mounted.current) setPhase("form");
        },
      },
      handler: async (response) => {
        if (!mounted.current) return;
        setPhase("verifying");
        try {
          const res = await fetch("/api/sponsor/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const data = await res.json().catch(() => null);
          if (!res.ok || !data?.ok) {
            fail(
              data?.error ??
                "Payment went through but verification failed. If money left your account it will be refunded automatically — please contact us."
            );
            return;
          }
          if (!mounted.current) return;
          setPaidAmount(Number(data.amountUSD) || amount);
          setPhase("success");
          refreshSupporters();
        } catch {
          fail("Could not verify the payment just now. If money left your account it is safe — please contact us with your payment id.");
        }
      },
    });

    checkout.on("payment.failed", (response) => {
      fail(
        response?.error?.description ??
          "The payment didn't go through. No money was taken — please try again."
      );
    });
    checkout.open();
  };

  const busy = phase === "creating" || phase === "verifying";

  if (phase === "success") {
    return (
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-border bg-card p-8 text-center sm:p-12">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
          className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10"
        >
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </motion.div>
        <h3 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Thank you{donor.name.trim() ? `, ${donor.name.trim()}` : ""}!
        </h3>
        <p className="mx-auto mb-8 max-w-md text-muted">
          Your {paidAmount != null ? formatUSD(paidAmount) : "donation"} keeps
          Morph free, fast, and tiny. A receipt is on its way to{" "}
          {donor.email.trim() || "your inbox"}.
        </p>
        <button
          type="button"
          onClick={() => {
            setPhase("form");
            setError(null);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold transition-colors hover:bg-surface-hover"
        >
          <Heart className="h-4 w-4 text-rose-500" />
          Donate again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-border bg-card p-6 text-left sm:p-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            One-time donation
          </p>
          <p className="mt-1 text-4xl font-bold tracking-tight sm:text-5xl">
            {isValidAmountUSD(amount) ? formatUSD(amount) : "$—"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {currency === "INR" && isValidAmountUSD(amount) ? (
              <>
                ≈ {formatINR(usdToInr(amount))} charged in INR — UPI, cards,
                netbanking
              </>
            ) : (
              <>Charged in USD on international cards · settled in INR</>
            )}
          </p>
        </div>
        <div
          className="inline-flex rounded-xl border border-border bg-surface p-1 text-sm font-semibold"
          role="group"
          aria-label="Charge currency"
        >
          {(["USD", "INR"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrency(c)}
              aria-pressed={currency === c}
              className={`rounded-lg px-4 py-2 transition-colors ${
                currency === c
                  ? "bg-accent text-accent-fg"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {c === "USD" ? "$ USD" : "₹ INR"}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {QUICK_AMOUNTS_USD.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => pickAmount(value)}
            aria-pressed={custom === "" && amount === value}
            className={`rounded-xl border px-2 py-3 text-sm font-bold transition-colors ${
              custom === "" && amount === value
                ? "border-accent bg-accent/10 text-foreground"
                : "border-border bg-surface text-muted hover:border-accent/50 hover:text-foreground"
            }`}
          >
            ${value}
          </button>
        ))}
        <div className="relative col-span-3 sm:col-span-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">
            $
          </span>
          <input
            value={custom}
            onChange={(e) => onCustomChange(e.target.value)}
            inputMode="decimal"
            placeholder="Custom"
            aria-label="Custom amount in USD"
            className={`w-full rounded-xl border py-3 pl-7 pr-2 text-sm font-bold outline-none transition-colors focus:border-accent ${
              custom !== ""
                ? "border-accent bg-accent/10 text-foreground"
                : "border-border bg-surface text-muted placeholder:font-medium"
            }`}
          />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          value={donor.name}
          onChange={(e) => setDonor({ ...donor, name: e.target.value })}
          placeholder="Full name"
          autoComplete="name"
          aria-label="Full name"
          className={inputClass}
        />
        <input
          value={donor.email}
          onChange={(e) => setDonor({ ...donor, email: e.target.value })}
          placeholder="Email for receipt"
          type="email"
          autoComplete="email"
          aria-label="Email"
          className={inputClass}
        />
        <input
          value={donor.contact}
          onChange={(e) => setDonor({ ...donor, contact: e.target.value })}
          placeholder="Phone (optional)"
          type="tel"
          autoComplete="tel"
          aria-label="Phone"
          className={inputClass}
        />
        <input
          value={donor.address}
          onChange={(e) => setDonor({ ...donor, address: e.target.value })}
          placeholder="Address (optional)"
          autoComplete="street-address"
          aria-label="Address"
          className={inputClass}
        />
      </div>
      <p className="-mt-3 mb-6 text-xs text-muted">
        Saved on this device only — pre-filled next time you visit.
      </p>

      {phase === "error" && error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="text-foreground">{error}</p>
            <a
              href={FALLBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block font-medium text-accent hover:underline"
            >
              Or donate directly at razorpay.me/@levizr →
            </a>
          </div>
        </div>
      )}

      <motion.button
        type="button"
        onClick={donate}
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-accent-fg shadow-lg shadow-accent/25 disabled:opacity-60"
        whileHover={busy ? undefined : { scale: 1.02 }}
        whileTap={busy ? undefined : { scale: 0.98 }}
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {phase === "verifying" ? "Verifying payment…" : "Starting checkout…"}
          </>
        ) : (
          <>
            <Heart className="h-4 w-4" />
            Donate {isValidAmountUSD(amount) ? formatUSD(amount) : ""}
          </>
        )}
      </motion.button>
      <p className="mt-3 text-center text-xs text-muted">
        Secured by Razorpay · international cards welcome
        {currency === "INR" ? " · UPI supported" : ""}
      </p>

      {totals.total > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-accent" />
            {totals.total} supporter{totals.total === 1 ? "" : "s"} ·{" "}
            {formatUSD(totals.totalUSD)} raised
          </p>
          <div className="flex flex-wrap gap-2">
            {supporters.map((s, i) => (
              <span
                key={`${s.name}-${s.at}-${i}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted"
              >
                <Heart className="h-3 w-3 text-rose-500" />
                <span className="font-medium text-foreground">{s.name}</span>
                {formatUSD(s.amountUSD)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
