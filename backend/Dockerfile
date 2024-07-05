# Use the official Node.js 20 image as the base image
FROM node:20.14.0

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Chromium for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set the PUPPETEER_SKIP_CHROMIUM_DOWNLOAD environment variable to true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Set the appropriate environment variable for Puppeteer
ENV CHROMIUM_PATH=/usr/bin/chromium

# Copy the rest of the application code to the working directory
COPY . .

# Compile TypeScript files (if you have a build script in your package.json)
RUN npx tsc

# Expose the port your app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "dist/server.js"]
