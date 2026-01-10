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
