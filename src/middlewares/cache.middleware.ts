import { Request, Response, NextFunction } from 'express';
import { get, set } from '../utils/redis';

interface CacheOptions {
  ttl?: number;
  keyPrefix?: string;
  useUserSpecificCache?: boolean;
}

export const cacheMiddleware = (options: CacheOptions = {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { 
      ttl = 3600, 
      keyPrefix = '',
      useUserSpecificCache = false
    } = options;
    
    // Generate cache key based on URL and query parameters
    const generateCacheKey = (): string => {
      const params = new URLSearchParams(req.query as any).toString();
      
      // Only include userId in the cache key if useUserSpecificCache is true
      const userId = useUserSpecificCache ? (req.user?.id || 'anonymous') : '';
      const userPart = userId ? `${userId}:` : '';
      
      return `${keyPrefix}:${userPart}${req.baseUrl}${req.path}${params ? `?${params}` : ''}`;
    };

    // Store original response.json function
    const originalJson = res.json;
    const cacheKey = generateCacheKey();

    try {
      // Check cache first
      const cachedData = await get(cacheKey);
      if (cachedData) {
        return res.json(cachedData);
      }

      // Override res.json to cache the response before sending
      res.json = function (data: any): Response {
        // Cache the response
        set(cacheKey, data, ttl).catch(console.error);
        
        // Restore original json function and call it
        res.json = originalJson;
        return res.json(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
}; 