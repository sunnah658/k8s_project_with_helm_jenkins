

### Structure
```sh
devops-project/
├── src/
│   └── app.js
├── package.json
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
├── .eslintrc.json
├── .env.example
├── .README.md
```
## How to run (quick)

### Local (no Docker)
```sh
unzip node-docker-starter.zip
cd node-docker-starter
npm install
cp .env.example .env
npm run dev
# open http://localhost:3000
```

### Build & run with Docker
```sh
cd node-docker-starter
docker build -t node-docker-starter:1.0 .
docker run -p 3000:3000 --env-file .env node-docker-starter:1.0
# open http://localhost:3000
```

### With docker-compose
```sh
docker compose up --build
# open http://localhost:3000
```

## Endpoints
 - GET / → Welcome message
 - GET /api/health → { "status": "ok" }
 - GET /api/info → App metadata
 - GET /api/time → Current server time

## All file
```src/app.sj```
```sh
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
  res.send(`🚀 ${APP_NAME} is running. Try /api/health, /api/info, /api/time`);
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
```

```Dockerfile```
```sh
# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

ENV NODE_ENV=production     APP_NAME="Node Docker Starter"

WORKDIR /usr/src/app

# Install dependencies first for better caching
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm     npm ci --only=production &&     npm cache clean --force

# Copy source
COPY src ./src

# Use non-root user for security
USER node

EXPOSE 3000
CMD ["node", "src/app.js"]
```

```package.json```
```sh
{
  "name": "node-docker-starter",
  "version": "1.0.0",
  "description": "Minimal Express.js app, container-ready with Dockerfile and docker-compose.",
  "main": "src/app.js",
  "type": "module",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon --watch src src/app.js",
    "lint": "eslint ."
  },
  "keywords": ["node", "express", "docker", "devops", "container"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "eslint": "^9.9.0",
    "nodemon": "^3.1.4"
  }
}
```
```docker-compose.yaml```
```sh
services:
  web:
    build: .
    image: node-docker-starter:1.0
    ports:
      - "3000:3000"
    env_file: .env
    restart: unless-stopped
```
```.env.example```
```sh
# Copy this to .env and adjust as needed
PORT=3000
APP_NAME="Node Docker Starter"
LOG_LEVEL=dev
```
```.eslintrc.json```
```sh
{
  "env": {
    "es2022": true,
    "node": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "no-console": "off",
    "quotes": ["error", "double"],
    "semi": ["error", "always"]
  },
  "ignorePatterns": ["node_modules/", "dist/"]
}
```
```.dockerignore```
```sh
node_modules
npm-debug.log
Dockerfile*
docker-compose.yml
.git
.gitignore
*.md
.env
```
