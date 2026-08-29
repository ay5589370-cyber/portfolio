/**
 * Lightweight, Vercel-compatible in-memory rate limiter
 */
const requestLog = new Map();

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 15; // 15 requests per minute limit
const MIN_INTERVAL_MS = 800; // Minimum 800ms between requests from same client

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of requestLog.entries()) {
    if (now - record.lastReset > WINDOW_MS * 2) {
      requestLog.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(clientIp) {
  const ip = clientIp || 'unknown-client';
  const now = Date.now();

  let record = requestLog.get(ip);
  if (!record) {
    record = {
      count: 0,
      lastReset: now,
      lastRequestTime: 0
    };
    requestLog.set(ip, record);
  }

  // Check burst interval (rapid fire requests)
  if (now - record.lastRequestTime < MIN_INTERVAL_MS) {
    return {
      allowed: false,
      reason: 'Too many rapid requests. Please wait a moment before sending another message.'
    };
  }

  // Reset counter if window expired
  if (now - record.lastReset > WINDOW_MS) {
    record.count = 0;
    record.lastReset = now;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      reason: 'Rate limit exceeded. Please wait a minute before trying again.'
    };
  }

  // Record allowed request
  record.count += 1;
  record.lastRequestTime = now;
  return { allowed: true };
}
