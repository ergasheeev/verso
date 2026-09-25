/**
 * A minimal in-process global rate limiter: fixed-window counters for a
 * per-minute and a per-day cap.
 *
 * Built for the Gemini free tier specifically — that quota is metered per
 * PROJECT, not per caller, so every visitor to this app draws from the same
 * pool. This is the local circuit breaker that keeps one busy minute from
 * spending the whole day's budget and getting every subsequent reader a 429.
 *
 * In-process only: correct for a single backend instance, which is this
 * app's deployment. A second instance would double the effective ceiling —
 * move the counters to Redis (INCR + EXPIRE) if the backend is ever scaled
 * horizontally.
 */
export interface RateLimiter {
  /** True and consumes one unit if under both caps; false and consumes
   *  nothing otherwise — the caller falls back to something else on false. */
  tryAcquire(): boolean;
}

export function createRateLimiter({
  perMinute, perDay,
}: { perMinute: number; perDay: number }): RateLimiter {
  let minuteWindow = Math.floor(Date.now() / 60_000);
  let minuteCount = 0;
  // Day window keyed by UTC calendar date. Google resets its own quota at
  // midnight Pacific, not UTC, so this drifts up to 8 hours from Google's
  // actual reset — acceptable for a safety margin, not exact.
  let dayWindow = new Date().toISOString().slice(0, 10);
  let dayCount = 0;

  return {
    tryAcquire() {
      const nowMinute = Math.floor(Date.now() / 60_000);
      if (nowMinute !== minuteWindow) { minuteWindow = nowMinute; minuteCount = 0; }
      const nowDay = new Date().toISOString().slice(0, 10);
      if (nowDay !== dayWindow) { dayWindow = nowDay; dayCount = 0; }

      if (minuteCount >= perMinute || dayCount >= perDay) return false;
      minuteCount++;
      dayCount++;
      return true;
    },
  };
}
