type Bucket = {
  count: number;
  expiresAt: number;
};

const windowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 5;

const memoryStore = new Map<string, Bucket>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const existing = memoryStore.get(key);

  if (!existing || existing.expiresAt < now) {
    memoryStore.set(key, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= maxRequestsPerWindow) {
    return { allowed: false, retryAfter: Math.ceil((existing.expiresAt - now) / 1000) };
  }

  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}
