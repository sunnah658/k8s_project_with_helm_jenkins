# Node + Docker Starter

A minimal, production-ready Express app packaged for Docker.

## Features
- Express server with health & info endpoints
- Environment variables via `.env`
- Secure headers (helmet) & request logging (morgan)
- Dockerfile (non-root user) + docker-compose
- Ready for CI/CD

## Endpoints
- `GET /` → welcome message
- `GET /api/health` → `{ status: "ok" }`
- `GET /api/info` → app metadata
- `GET /api/time` → server time

## Quick Start (Local)
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Docker
Build:
```bash
docker build -t node-docker-starter:1.0 .
```

Run:
```bash
# Ensure you have an .env file (see .env.example)
docker run -p 3000:3000 --env-file .env node-docker-starter:1.0
```

## Docker Compose
```bash
docker compose up --build
```

## Environment Variables
Create `.env` based on `.env.example`:

```env
PORT=3000
APP_NAME="Node Docker Starter"
LOG_LEVEL=dev
```

## Production Notes
- Use `NODE_ENV=production` in your runtime.
- Behind a reverse proxy, set `app.set('trust proxy', 1)` as needed.
- Add proper logging & metrics for real deployments.
