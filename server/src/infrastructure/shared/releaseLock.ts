import redisClient from "../redis/redisClient";

export const releaseLock = async (lockKey: string, lockValue: string) => {
  const luaScript = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
  await redisClient.eval(luaScript, {
    keys:      [lockKey],
    arguments: [lockValue],
  });
};