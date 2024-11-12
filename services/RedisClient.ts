import config from "@/types/Config";
import Redis, { RedisOptions } from "ioredis";

function createRedisInstance() {
	const options: RedisOptions = {
		...config.redis,
		...{
			lazyConnect: true,
			showFriendlyErrorStack: true,
			enableAutoPipelining: true,
			maxRetriesPerRequest: 0,
			retryStrategy: (times: number) => {
				if (times > 3) {
					throw new Error(`[Redis] Could not connect after ${times} attempts`);
				}

				return Math.min(times * 200, 1000);
			},
		},
	};
	const redis = new Redis(options);

	redis.on("error", (error: unknown) => {
		console.warn("[Redis] Error connecting", error);
	});

	return redis;
}

async function execute<R>(fn: (redis: Redis) => Promise<R>): Promise<R> {
	const redis = createRedisInstance();
	const data = await fn(redis);
	redis.quit();
	return data;
}

const redis = {
	createRedisInstance,
	execute,
};

export default redis;
