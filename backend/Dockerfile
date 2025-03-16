# Use Node.js LTS version
FROM node:18-alpine

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install -g typescript
RUN npm install

# Copy the rest of the application
COPY . .

# Create dist directory
RUN mkdir -p dist

# Build TypeScript
RUN npx tsc

# Expose port
EXPOSE 5001

# Start the application
CMD ["npm", "start"] 