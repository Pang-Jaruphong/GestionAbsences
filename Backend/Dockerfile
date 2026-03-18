# Step 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Step 2: Production stage
FROM node:20-alpine
WORKDIR /app
# Only copy the necessary files from builder
COPY --from=builder /app ./
EXPOSE 400
CMD ["node", "index.js"]