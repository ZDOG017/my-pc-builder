# Use the official Node.js 20 image as the base image
FROM alpine:latest

# Install Chromium and other dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm \
    yarn

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_CACHE_DIR=/home/web/.cache

# Set the working directory
WORKDIR /usr/src/app

# Copy application code
COPY . .

RUN apt-get install chromium-browser

# Install dependencies
RUN npm install

RUN npx tsc

# Expose the port your app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "dist/server.js"]
