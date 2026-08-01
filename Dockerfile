# ==========================================
# Multi-Stage Dockerfile for PasteBin Platform
# ==========================================

# Stage 1: Build Frontend React Client
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build Backend Server
FROM node:20-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm run build

# Stage 3: Production Runtime Stage
FROM node:20-alpine AS runner
WORKDIR /app

# Set node environment
ENV NODE_ENV=production
ENV PORT=4000
ENV DATA_DIR=/app/data

# Copy built server & client assets
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/node_modules ./server/node_modules
COPY --from=server-builder /app/server/package.json ./server/package.json
COPY --from=client-builder /app/client/dist ./client/dist

# Expose server port
EXPOSE 4000

# Create volume mount directory for SQLite persistence
#VOLUME [ "/app/data" ]

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:4000/api/health || exit 1

# Start Server
CMD ["node", "server/dist/index.js"]
