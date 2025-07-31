# Use official Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose backend port (usually 4000 or 3000)
EXPOSE 4000

# Start the backend
CMD ["node", "index.js"]
