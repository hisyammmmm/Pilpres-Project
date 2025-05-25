# FROM node:20-alpine
# WORKDIR /app
# COPY . .
# RUN npm install
# EXPOSE 5000
# CMD ["node", "index.js"]

# Use Node.js 18 LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Create uploads directory for file storage
RUN mkdir -p uploads

# Expose port 5000
EXPOSE 5000

# Set environment variable for production
ENV 5000

# Start the application
CMD ["node", "index.js"]