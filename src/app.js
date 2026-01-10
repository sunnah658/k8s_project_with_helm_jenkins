import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Basic hardening & logging
app.use(helmet());
app.use(express.json());
app.use(morgan(process.env.LOG_LEVEL || "dev"));

// Config
const PORT = Number(process.env.PORT || 3000);
const APP_NAME = process.env.APP_NAME || "Node Docker Starter";

// Trust proxy if running behind load balancers (uncomment if needed)
// app.set("trust proxy", 1);

// Routes
app.get("/", (_req, res) => {
  res.send(`Project- ${APP_NAME} is running. Try /api/health, /api/info, /api/time`);
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/info", (_req, res) => {
  res.json({
    name: APP_NAME,
    node: process.version,
    env: process.env.NODE_ENV || "development",
  });
});

app.get("/api/time", (_req, res) => {
  res.json({ iso: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", path: req.originalUrl });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`✅ ${APP_NAME} listening on port ${PORT}`);
});
