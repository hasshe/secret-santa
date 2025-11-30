# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source
COPY . .

# Build TypeScript to JS (assumes a build script exists)
RUN npm run build

# Stage 2: runtime
FROM node:20-alpine
WORKDIR /app

# Copy only the production files
COPY package.json package-lock.json ./
RUN npm ci --only=production --silent

# Copy built output from builder
COPY --from=builder /app/dist ./dist

# Copy necessary runtime files (if any)
ENV NODE_ENV=production

EXPOSE 3000

# Use a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Default command: run the compiled server
CMD ["node", "dist/main.js"]
