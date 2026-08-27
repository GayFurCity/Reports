import "dotenv/config";
const env = <R extends boolean = false>(key: string, required?: R): R extends true ? string : string | undefined => {
    const v = process.env[key];
    if (!v && required) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return v as never;
};

// An explicit METRICS_ENABLED (any non-empty value) always wins. Otherwise fall back to whether
// COMPOSE_PROFILES (forwarded through from docker-compose.yml, a comma-separated profile list -
// not a plain boolean) contains "metrics".
const metricsEnabled = (): boolean => {
    const explicit = env("METRICS_ENABLED");
    if (explicit) {
        return /^(true|t|yes|y|on|1)$/i.test(explicit);
    }
    return (env("COMPOSE_PROFILES") ?? "").split(",").includes("metrics");
};

const Config = {
    clickhouseURL:  env("CLICKHOUSE_URL") ?? "http://clickhouse:8123",
    redisURL:       env("REDIS_URL") ?? "redis://redis:6379",
    secretKey:      env("SECRET_KEY", true),
    migrationDir:   env("MIGRATION_DIR") ?? new URL("../migrations", import.meta.url).pathname,
    metricsPort:    Number(env("METRICS_PORT") ?? 9100),
    metricsEnabled: metricsEnabled()
};
export default Config;
