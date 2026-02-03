FROM oven/bun:1-alpine

# BusyBox crond is already included in Alpine, no need to install

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --production

# Copy source code
COPY . .

# TypeScript files will be run directly by bun, no build needed

# Copy cron configuration
COPY crontab /etc/crontabs/root

# Create logs directory with proper permissions
RUN mkdir -p /app/logs && chmod 777 /app/logs

# Set environment
ENV NODE_ENV=production

# Start cron in foreground with logging
CMD ["crond", "-f", "-d", "8"]
