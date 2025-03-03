from django.http import JsonResponse
from rest_framework.decorators import api_view
from .groq_client import call_groq_llm
from .mcp_client import call_mcp_function
import json

@api_view(['POST'])
def chat_with_llm(request):
    """
    Processes user queries, checks for tool calls, and either responds with text or calls MCP.
    """
    try:
        user_message = request.data.get("message")
        if not user_message:
            print("Error: Message is missing in the request.")
            return JsonResponse({"error": "Message is required"}, status=400)

        messages = [{"role": "user", "content": user_message}]
        llm_response = call_groq_llm(messages)

        choices = llm_response.get("choices", [])
        if choices:
            message_content = choices[0].get("message", {})

            if "tool_calls" in message_content:
                tool_calls = message_content["tool_calls"]
                print("Tool Calls:", tool_calls)

                # Process all tool calls
                mcp_responses = []
                
                for tool in tool_calls:
                    if tool["type"] == "function":
                        function_name = tool["function"]["name"]
                        arguments = json.loads(tool["function"]["arguments"])  # Convert string JSON to dict

                        print(f"Function Called: {function_name}, Arguments: {arguments}")

                        # List of supported MCP functions
                        mcp_functions = ["create_event", "get_event", "update_event", "delete_event", "list_events"]
                        
                        # Call the MCP function if it's supported
                        if function_name in mcp_functions:
                            # Call the MCP function
                            mcp_response = call_mcp_function(function_name, arguments)
                            
                            # Add to the list of responses
                            mcp_responses.append({
                                "function": function_name,
                                "arguments": arguments,
                                "response": mcp_response
                            })
                
                # If we have MCP responses, return them
                if mcp_responses:
                    return JsonResponse({
                        "llm_response": message_content.get("content", ""),
                        "mcp_responses": mcp_responses
                    })
                
                # If no MCP functions were called, return the tool calls
                return JsonResponse({"tool_calls": tool_calls})

            # If no tool calls, return the LLM response content
            return JsonResponse({"response": message_content.get("content", "No response")})

        print("Error: LLM did not return a valid response.")
        return JsonResponse({"error": "LLM did not return a valid response"}, status=500)

    except Exception as e:
        print("Unexpected error in chat_with_llm:", str(e))
        return JsonResponse({"error": "Internal server error"}, status=500)
