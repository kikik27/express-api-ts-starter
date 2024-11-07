import Redis from 'ioredis';

const redis = new Redis({ 
  port: Number(process.env.REDIS_PORT) || 6379,
  host: process.env.REDIS_HOST,
});

const getKey = (key: string): string => {
  const prefix = process.env.REDIS_PREFIX || 'kikik27';
  return `${prefix}:${key}`;
};

export const get = async <T>(key: string): Promise<T | null> => {
  const value = await redis.get(getKey(key));
  if (!value) return null;
  return JSON.parse(value) as T;
};

export const set = async <T>(
  key: string, 
  value: T, 
  ttl?: number
): Promise<void> => {
  const serializedValue = JSON.stringify(value);
  if (ttl) {
    await redis.setex(getKey(key), ttl, serializedValue);
  } else {
    await redis.set(getKey(key), serializedValue);
  }
};

export const invalidateCache = async (pattern: string): Promise<void> => {
  const keys = await redis.keys(getKey(pattern));
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

export const invalidateCachePrefix = async (prefix: string): Promise<void> => {
  await invalidateCache(`${prefix}:*`);
};

export default redis;