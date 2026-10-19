import { defineConfig, loadEnv } from "vite";
import { resolve } from "node:path";
import contactHandler from "./api/contact.js";
import visitingCardHandler from "./api/visiting-card.js";
import adminLoginHandler from "./api/admin/login.js";
import adminSessionHandler from "./api/admin/session.js";
import adminLogoutHandler from "./api/admin/logout.js";
import adminContentHandler from "./api/admin/content.js";
import adminSkillsHandler from "./api/admin/skills.js";
import adminProjectsHandler from "./api/admin/projects.js";
import publicProfileHandler from "./api/public/profile.js";
import publicSkillsHandler from "./api/public/skills.js";
import publicProjectsHandler from "./api/public/projects.js";
import publicFaqsHandler from "./api/public/faqs.js";

const apiRoutes = {
  "/api/contact": contactHandler,
  "/api/visiting-card": visitingCardHandler,
  "/api/admin/login": adminLoginHandler,
  "/api/admin/session": adminSessionHandler,
  "/api/admin/logout": adminLogoutHandler,
  "/api/admin/content": adminContentHandler,
  "/api/admin/skills": adminSkillsHandler,
  "/api/admin/projects": adminProjectsHandler,
  "/api/public/profile": publicProfileHandler,
  "/api/public/skills": publicSkillsHandler,
  "/api/public/projects": publicProjectsHandler,
  "/api/public/faqs": publicFaqsHandler
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    server: {
      port: 5173,
      host: true
    },
    build: {
      outDir: "dist",
      rollupOptions: {
        input: {
          main: resolve(process.cwd(), "index.html"),
          admin: resolve(process.cwd(), "admin.html"),
          standalone: resolve(process.cwd(), "standalone.html"),
          visitingCard: resolve(process.cwd(), "visiting-card.html")
        }
      }
    },
    plugins: [
      {
        name: "api-dev-middleware",
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const urlPath = req.url ? req.url.split("?")[0] : "";
            const handler = apiRoutes[urlPath];

            if (handler) {
              // Add helper methods if not present
              if (!res.status) {
                res.status = function (code) {
                  this.statusCode = code;
                  return this;
                };
              }
              if (!res.json) {
                res.json = function (data) {
                  this.setHeader("Content-Type", "application/json");
                  this.end(JSON.stringify(data));
                  return this;
                };
              }

              // Parse query
              const queryString = req.url && req.url.includes("?") ? req.url.split("?")[1] : "";
              const searchParams = new URLSearchParams(queryString);
              req.query = Object.fromEntries(searchParams.entries());

              // Handle OPTIONS
              if (req.method === "OPTIONS") {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Idempotency-Key");
                res.statusCode = 200;
                res.end();
                return;
              }

              // Handle POST/PUT/DELETE bodies
              if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
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
                  try {
                    await handler(req, res);
                  } catch (err) {
                    console.error(`[API Handler Error] ${urlPath}`, err);
                    res.status(500).json({ error: err.message });
                  }
                });
                return;
              }

              // Handle GET
              try {
                await handler(req, res);
              } catch (err) {
                console.error(`[API Handler Error] ${urlPath}`, err);
                res.status(500).json({ error: err.message });
              }
              return;
            }

            next();
          });
        }
      }
    ]
  };
});
