# Stage 1: Build step
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production runtime runner
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

# Copy static assets and compiled server bundle from builder stage
COPY --from=builder /app/dist ./dist

# Expose Port 3000 as mandated by container specifications
EXPOSE 3000

CMD ["node", "dist/server.cjs"]
