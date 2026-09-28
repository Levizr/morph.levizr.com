// Live USD→INR rate with a hardcoded fallback. Server-side only —
// the browser never decides what anyone is charged.

import { USD_TO_INR_RATE } from "@/lib/sponsor";

const RATE_URL = "https://open.er-api.com/v6/latest/USD";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12h — donations are low-volume
const FETCH_TIMEOUT_MS = 6000;
const MIN_SANE_RATE = 50;
const MAX_SANE_RATE = 150;

interface FxCache {
  rate: number;
  live: boolean;
  fetchedAt: number;
  fetchPromise: Promise<FxCache> | null;
}

const cache: FxCache = {
  rate: USD_TO_INR_RATE,
  live: false,
  fetchedAt: 0,
  fetchPromise: null,
};

async function fetchLiveRate(): Promise<number> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(RATE_URL, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`fx http ${res.status}`);
    const data = (await res.json()) as {
      result?: string;
      rates?: Record<string, number>;
    };
    const rate = data?.rates?.INR;
    if (
      data?.result !== "success" ||
      typeof rate !== "number" ||
      !Number.isFinite(rate) ||
      rate < MIN_SANE_RATE ||
      rate > MAX_SANE_RATE
    ) {
      throw new Error("fx sanity check failed");
    }
    return rate;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Current USD→INR rate. Hits the network at most once per 12h (single
 * in-flight request shared by concurrent callers); falls back to the
 * hardcoded USD_TO_INR_RATE on any failure. Never throws.
 */
export async function getUsdToInrRate(): Promise<{
  rate: number;
  live: boolean;
}> {
  if (Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return { rate: cache.rate, live: cache.live };
  }
  if (!cache.fetchPromise) {
    cache.fetchPromise = fetchLiveRate()
      .then((rate) => {
        cache.rate = rate;
        cache.live = true;
        cache.fetchedAt = Date.now();
        cache.fetchPromise = null;
        return { ...cache };
      })
      .catch(() => {
        cache.rate = USD_TO_INR_RATE;
        cache.live = false;
        cache.fetchedAt = Date.now();
        cache.fetchPromise = null;
        return { ...cache };
      });
  }
  const snapshot = await cache.fetchPromise;
  return { rate: snapshot.rate, live: snapshot.live };
}
