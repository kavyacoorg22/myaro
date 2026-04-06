
export interface ILockSlotService {
  setNX(key: string, value: string, ttlSeconds: number): Promise<boolean>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
  expire(key: string, ttlSeconds: number): Promise<void>;
}