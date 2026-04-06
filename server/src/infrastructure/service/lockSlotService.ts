import { ILockSlotService } from "../../application/serviceInterface/ILockSlotService";
import redisClient from "../redis/redisClient";

export class LockSlotService implements ILockSlotService {
  async setNX(key: string, value: string, ttlSeconds: number): Promise<boolean> {
    const result = await redisClient.set(key, value, { NX: true, EX: ttlSeconds });
    return result === "OK";
  }

  async get(key: string): Promise<string | null> {
    return redisClient.get(key);
  }

  async del(key: string): Promise<void> {
    await redisClient.del(key);
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await redisClient.expire(key, ttlSeconds);
  }
}