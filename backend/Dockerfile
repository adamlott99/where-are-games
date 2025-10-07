FROM node:18-alpine

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove devDependencies and rebuild native modules for correct architecture
RUN npm prune --production && npm rebuild

# Create database directory
RUN mkdir -p database

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
