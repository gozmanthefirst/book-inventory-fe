FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat

# Set up the application directory
WORKDIR /app

# Separate dependencies installation to enable caching
FROM base AS deps

# Copy only the files needed for installation
COPY pnpm-lock.yaml package.json ./

# Install dependencies
RUN corepack enable pnpm && \
    pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy only the necessary files
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
RUN corepack enable pnpm && pnpm run build

# Production stage with only essential files
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    HOSTNAME="0.0.0.0" \
    PORT=3003

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Use non-root user
USER nextjs

# Expose the application port
EXPOSE 3003

# Start the application
CMD ["node", "server.js"]