import register from "./metrics.js";
import Config from "./config.js";
import { createServer } from "node:http";

export function startMetricsServer(): void {
    const server = createServer((req, res) => {
        if (req.method !== "GET" || req.url !== "/metrics") {
            res.writeHead(404).end();
            return;
        }
        register.metrics()
            .then(metrics => {
                res.writeHead(200, { "Content-Type": register.contentType });
                res.end(metrics);
            })
            .catch((err: Error) => {
                res.writeHead(500).end(err.message);
            });
    });

    server.listen(Config.metricsPort, "0.0.0.0");
}
