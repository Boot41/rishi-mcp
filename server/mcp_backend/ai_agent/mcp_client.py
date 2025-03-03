import subprocess
import json
import os
from dotenv import load_dotenv

load_dotenv()

def call_mcp_function(function_name, arguments):
    """
    Calls an MCP function in the Calendar-MCP-Server using the MCP protocol.
    
    Args:
        function_name (str): The name of the MCP function to call (e.g., "create_event")
        arguments (dict): The arguments to pass to the function
        
    Returns:
        dict: The response from the MCP server
    """
    try:
        # Path to the MCP server directory
        mcp_server_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 
                                     "GongRzhe_Calendar-MCP-Server")
        
        # Create the MCP request
        mcp_request = {
            "jsonrpc": "2.0",
            "method": "callTool",
            "params": {
                "name": function_name,
                "arguments": arguments
            },
            "id": "1"
        }
        
        # Convert the request to JSON
        request_json = json.dumps(mcp_request)
        
        # Call the MCP server using Node.js
        # Use the build/index.js file instead of dist/index.js
        command = ["node", "build/index.js"]
        
        # Run the command in the MCP server directory
        process = subprocess.Popen(
            command,
            cwd=mcp_server_dir,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Send the request to the MCP server
        stdout, stderr = process.communicate(input=request_json)
        
        if stderr:
            print(f"MCP Error: {stderr}")
            return {"error": f"MCP server error: {stderr}"}
        
        # Parse the response
        try:
            response = json.loads(stdout)
            return response
        except json.JSONDecodeError:
            print(f"Invalid JSON response: {stdout}")
            return {"error": "Invalid response from MCP server"}
            
    except Exception as e:
        print(f"Error calling MCP function: {str(e)}")
        return {"error": f"Failed to call MCP function: {str(e)}"}
