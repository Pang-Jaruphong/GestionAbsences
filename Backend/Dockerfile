# --- Stage 1: Testing & Linting ---
FROM node:20-alpine AS tester
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run lint --if-present
RUN npm test

# --- Stage 2: Production ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
# Only install production dependencies
RUN npm ci --only=production
COPY . .
EXPOSE 400
CMD ["node", "index.js"]