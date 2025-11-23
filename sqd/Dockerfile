FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY schema.graphql ./

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production

# Copy built files from builder
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/schema.graphql ./

# Expose GraphQL port
EXPOSE 4350

# Default command (can be overridden in docker-compose)
CMD ["npm", "run", "process"]
