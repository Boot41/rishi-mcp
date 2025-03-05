# Use Node.js LTS version
FROM node:20-slim

# Install lsof
RUN apt-get update && apt-get install -y lsof && rm -rf /var/lib/apt/lists/*

# Create symlink for node in /usr/bin
RUN ln -s /usr/local/bin/node /usr/bin/node

# Create app directory
WORKDIR /usr/src/app

# Copy package files for express server
COPY express_server/package*.json ./

# Install dependencies
RUN npm install

# Copy MCP server code and install its dependencies
COPY GongRzhe_Calendar-MCP-Server /usr/src/GongRzhe_Calendar-MCP-Server
WORKDIR /usr/src/GongRzhe_Calendar-MCP-Server
COPY GongRzhe_Calendar-MCP-Server/package*.json ./
RUN npm install
RUN npm run build

# Copy Gmail MCP Server
COPY Gmail-MCP-Server /usr/src/Gmail-MCP-Server
WORKDIR /usr/src/Gmail-MCP-Server
COPY Gmail-MCP-Server/package*.json ./
RUN npm install
RUN npm run build

# Set up credentials and OAuth files
RUN mkdir -p /gmail-server
COPY credentials.json /gmail-server/credentials.json
COPY gcp-oauth.keys.json /gcp-oauth.keys.json
RUN ls -la /gmail-server/ && ls -la /  # Debug step

# Go back to express server directory
WORKDIR /usr/src/app

# Copy express server source code
COPY express_server .

# Build TypeScript for express server
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server (environment variables set in Compose)
CMD ["npm", "start"]