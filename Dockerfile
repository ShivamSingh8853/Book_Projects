# Multi-stage build for the server
FROM node:18-alpine AS server-build

# Set working directory for server
WORKDIR /app/server

# Copy server package files
COPY server/package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy server source code
COPY server/ ./

# Build the server
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built server
COPY --from=server-build --chown=nextjs:nodejs /app/server/dist ./server/dist
COPY --from=server-build --chown=nextjs:nodejs /app/server/node_modules ./server/node_modules
COPY --from=server-build --chown=nextjs:nodejs /app/server/package.json ./server/package.json

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set working directory for server
WORKDIR /app/server

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/src/index.js"]
