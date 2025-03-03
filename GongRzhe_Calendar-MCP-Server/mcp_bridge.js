#!/usr/bin/env node

// This script serves as a bridge between the Python code and the MCP server
// It takes a JSON command as a command-line argument and returns the result

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if a command-line argument was provided
if (process.argv.length < 3) {
  console.error('Usage: node mcp_bridge.js \'{"jsonrpc":"2.0","method":"callTool","params":{"name":"list_events","arguments":{"timeMin":"2025-03-04T00:00:00Z","timeMax":"2025-03-04T23:59:59Z"}}}\'');
  process.exit(1);
}

// Get the JSON command from the command-line argument
const jsonCommand = process.argv[2];

try {
  // Parse the JSON command to validate it
  const command = JSON.parse(jsonCommand);
  
  // Path to the MCP server script
  const mcpServerPath = join(__dirname, 'build', 'index.js');
  
  // Create a temporary file to store the JSON command
  const tempFilePath = join(__dirname, 'temp_command.json');
  writeFileSync(tempFilePath, jsonCommand);
  
  try {
    // Execute the MCP server with the JSON command from the temp file
    const result = execSync(`cat ${tempFilePath} | node ${mcpServerPath}`, {
      env: process.env,
      encoding: 'utf8'
    });
    
    // Output the result
    console.log(result);
  } finally {
    // Clean up the temporary file
    try {
      unlinkSync(tempFilePath);
    } catch (err) {
      // Ignore errors when deleting the temp file
    }
  }
} catch (error) {
  console.error('Error executing MCP server:', error.message);
  process.exit(1);
}
