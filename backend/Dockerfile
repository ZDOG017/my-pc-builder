# Use the official Node.js 20 image as the base image
FROM node:20.14.0

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Install necessary dependencies for Chromium
# RUN apt-get update && apt-get install -y \
#     wget \
#     gnupg \
#     ca-certificates \
#     libnss3 \
#     libxss1 \
#     libasound2 \
#     libatk-bridge2.0-0 \
#     libatk1.0-0 \
#     libcups2 \
#     libx11-xcb1 \
#     libxcomposite1 \
#     libxdamage1 \
#     libxrandr2 \
#     libgbm1 \
#     libpango1.0-0 \
#     libxcursor1 \
#     libxinerama1 \
#     libgl1-mesa-glx \
#     libdbus-glib-1-2 \
#     chromium \
#     --no-install-recommends && \
#     rm -rf /var/lib/apt/lists/*

# Set the appropriate environment variable for Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy the rest of the application code to the working directory
COPY . .

# Compile TypeScript files (if you have a build script in your package.json)
RUN npx tsc

# Expose the port your app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "dist/server.js"]
