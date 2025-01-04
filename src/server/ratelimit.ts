import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const unauthenticatedRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "21600 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export const authenticatedRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "21600 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});
