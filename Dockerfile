# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --production

# Copy all necessary configuration and test files
COPY config.yaml ./
COPY playwright.config.ts ./
COPY tests ./tests

# Install Playwright with all required dependencies
RUN npx playwright install --with-deps

# Define the command to run tests
CMD ["npx", "playwright", "test"]
