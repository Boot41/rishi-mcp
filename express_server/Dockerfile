# Use Node.js LTS version
FROM node:20-slim

# Install lsof
RUN apt-get update && apt-get install -y lsof && rm -rf /var/lib/apt/lists/*

# Create symlink for node in /usr/bin
RUN ln -s /usr/local/bin/node /usr/bin/node

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY express_server/package*.json ./

# Install dependencies
RUN npm install

# Copy MCP server code and install its dependencies
COPY GongRzhe_Calendar-MCP-Server /usr/src/GongRzhe_Calendar-MCP-Server
WORKDIR /usr/src/GongRzhe_Calendar-MCP-Server
COPY GongRzhe_Calendar-MCP-Server/package*.json ./
RUN npm install
RUN npm run build

# Go back to express server directory
WORKDIR /usr/src/app

# Copy express server source code
COPY express_server .

# Build TypeScript for express server
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
