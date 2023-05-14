import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor() {}

  config(): Redis {
    return new Redis({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      enableAutoPipelining: true,
      enableOfflineQueue: true,
      connectTimeout: 15000,
      maxRetriesPerRequest: 40,
    });
  }

  async ttlCacheData(key: string): Promise<number> {
    const res: number = await this.config().ttl(key);
    return res;
  }

  async countCacheData(key: string, field: string): Promise<any> {
    const res: string | null = await this.config().hget(key, field);
    return Number.isNaN(JSON.parse(res!).length) ? 0 : JSON.parse(res!).length;
  }

  async keyCacheDataExist(key: string): Promise<number> {
    const res: number = await this.config().exists(key);
    return res;
  }

  async delCacheData(key: string): Promise<number> {
    const res: number = await this.config().del(key);
    return res;
  }

  async setExCacheData(key: string, expired: number, data: string | number): Promise<string> {
    const res: string = await this.config().setex(key, expired, data);
    return res;
  }

  async setCacheData(key: string, data: string | number): Promise<string> {
    const res: string = await this.config().set(key, data);
    return res;
  }

  async getCacheData(key: string): Promise<string | null> {
    const res: string | null = await this.config().get(key);
    return res;
  }

  async hkeyCacheDataExist(key: string, field: string): Promise<number> {
    const res: number = await this.config().hexists(key, field);
    return res;
  }

  async hdelCacheData(key: string, field: string): Promise<number> {
    const res: number = await this.config().hdel(key, field);
    return res;
  }

  async hsetCacheData(key: string, field: string, expired: number, data: Record<string, any> | Record<string, any>[]): Promise<number> {
    await this.config().expire(key, expired);
    const res: number = await this.config().hset(key, field, JSON.stringify(data));
    return res;
  }

  async hgetCacheData(key: string, field: string): Promise<any> {
    const res: string | null = await this.config().hget(key, field);
    return JSON.parse(res!);
  }
}
