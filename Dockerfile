# Multi-stage build for single Docker image deployment
FROM node:18-alpine as frontend-build

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY frontend/ ./

# Build frontend
RUN npm run build

# Backend build stage
FROM node:18-alpine as backend-build

WORKDIR /app/backend

# Install build dependencies for native modules (sqlite3)
RUN apk add --no-cache python3 make g++

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY backend/ ./

# Build backend TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install runtime dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy backend package files
COPY backend/package*.json ./

# Install only production dependencies
RUN npm install --production && npm rebuild

# Copy built backend from build stage
COPY --from=backend-build /app/backend/dist ./dist

# Copy database schema
COPY backend/database/schema.sql ./database/schema.sql

# Copy built frontend from build stage
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Create database directory
RUN mkdir -p database

# Set environment variables
ENV NODE_ENV=production
ENV FRONTEND_BUILD_PATH=/app/frontend/build

# Expose port (Render will set PORT env var dynamically)
EXPOSE 3001

# Start the application
CMD ["npm", "start"]

