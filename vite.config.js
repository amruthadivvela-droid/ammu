import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import contactHandler from "./api/contact.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    server: {
      port: 5173,
      host: true
    },
    plugins: [
      react(),
      {
        name: "api-contact-middleware",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith("/api/contact")) {
            // Buffer POST body
            if (req.method === "POST") {
              let bodyStr = "";
              req.on("data", chunk => {
                bodyStr += chunk;
              });
              req.on("end", async () => {
                try {
                  req.body = bodyStr ? JSON.parse(bodyStr) : {};
                } catch {
                  req.body = bodyStr;
                }

                // Add standard Express-like helpers if needed
                res.status = function (code) {
                  this.statusCode = code;
                  return this;
                };
                res.json = function (data) {
                  this.setHeader("Content-Type", "application/json");
                  this.end(JSON.stringify(data));
                  return this;
                };

                await contactHandler(req, res);
              });
              return;
            } else if (req.method === "OPTIONS") {
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
              res.setHeader("Access-Control-Allow-Headers", "Content-Type, Idempotency-Key");
              res.statusCode = 200;
              res.end();
              return;
            }
          }
          next();
        });
      }
    }
  ]
};
});
