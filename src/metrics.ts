import { collectDefaultMetrics, Counter, Histogram, Registry } from "prom-client";
import Config from "./config.js";

const register = new Registry();

// Nothing here gets collected at all when metrics are disabled, not just left unexposed -
// collectDefaultMetrics runs its own background sampling interval, so skipping it (rather than
// just not starting the /metrics server) actually avoids that ongoing work.
export const httpRequestDuration = Config.metricsEnabled
    ? new Histogram({
        name:       "http_request_duration_seconds",
        help:       "Duration of HTTP requests in seconds",
        labelNames: ["method", "route", "status_code"],
        buckets:    [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
        registers:  [register]
    })
    : undefined;

export const httpRequestsTotal = Config.metricsEnabled
    ? new Counter({
        name:       "http_requests_total",
        help:       "Total number of HTTP requests",
        labelNames: ["method", "route", "status_code"],
        registers:  [register]
    })
    : undefined;

if (Config.metricsEnabled) {
    collectDefaultMetrics({ register });
}

export default register;
