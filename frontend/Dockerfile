# Use official Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Install `serve` to serve the build folder
RUN npm install -g serve

# Expose the new port
EXPOSE 4001

# Start the app using serve on port 3001
CMD ["serve", "-s", "build", "-l", "4001"]
