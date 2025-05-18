# Use the official Playwright image from Microsoft
# This image includes all necessary dependencies for Playwright
FROM mcr.microsoft.com/playwright:v1.40.0-focal

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker's caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the files
COPY . .

# Make sure all browsers and system dependencies are installed
# Redundant with the base image but ensures any specific version requirements are met
RUN npx playwright install --with-deps

# Default command - run all tests
# Using npm script to ensure any hooks or configurations in package.json are honored
CMD ["npm", "test"]