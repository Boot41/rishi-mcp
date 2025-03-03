import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"  # Corrected endpoint

def call_groq_llm(messages):
    """
    Sends a request to Groq API and returns response in correct format.
    """
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "llama-3.3-70b-versatile",  # Ensure model is supported
        "messages": messages,
        "tools": [
            {
                "type": "function",
                "function": {
                    "name": "create_event",
                    "description": "Create a new event in the user's calendar",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "summary": {
                                "type": "string",
                                "description": "The title of the event"
                            },
                            "start": {
                                "type": "object",
                                "properties": {
                                    "dateTime": {
                                        "type": "string",
                                        "description": "The event start time in ISO 8601 format (e.g., 2025-03-02T10:00:00)"
                                    },
                                    "timeZone": {
                                        "type": "string",
                                        "description": "The time zone (optional)"
                                    }
                                },
                                "required": ["dateTime"]
                            },
                            "end": {
                                "type": "object",
                                "properties": {
                                    "dateTime": {
                                        "type": "string",
                                        "description": "The event end time in ISO 8601 format"
                                    },
                                    "timeZone": {
                                        "type": "string",
                                        "description": "The time zone (optional)"
                                    }
                                },
                                "required": ["dateTime"]
                            },
                            "description": {
                                "type": "string",
                                "description": "Description of the event (optional)"
                            },
                            "location": {
                                "type": "string",
                                "description": "Location of the event (optional)"
                            }
                        },
                        "required": ["summary", "start", "end"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_event",
                    "description": "Retrieves details of a specific event",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "eventId": {
                                "type": "string",
                                "description": "ID of the event to retrieve"
                            }
                        },
                        "required": ["eventId"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "update_event",
                    "description": "Updates an existing event",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "eventId": {
                                "type": "string",
                                "description": "ID of the event to update"
                            },
                            "summary": {
                                "type": "string",
                                "description": "New event title (optional)"
                            },
                            "start": {
                                "type": "object",
                                "properties": {
                                    "dateTime": {
                                        "type": "string",
                                        "description": "New start time in ISO 8601 format"
                                    },
                                    "timeZone": {
                                        "type": "string",
                                        "description": "Time zone (optional)"
                                    }
                                }
                            },
                            "end": {
                                "type": "object",
                                "properties": {
                                    "dateTime": {
                                        "type": "string",
                                        "description": "New end time in ISO 8601 format"
                                    },
                                    "timeZone": {
                                        "type": "string",
                                        "description": "Time zone (optional)"
                                    }
                                }
                            },
                            "description": {
                                "type": "string",
                                "description": "New event description (optional)"
                            },
                            "location": {
                                "type": "string",
                                "description": "New event location (optional)"
                            }
                        },
                        "required": ["eventId"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_event",
                    "description": "Deletes an event from the calendar",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "eventId": {
                                "type": "string",
                                "description": "ID of the event to delete"
                            }
                        },
                        "required": ["eventId"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_events",
                    "description": "Lists events within a specified time range",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "timeMin": {
                                "type": "string",
                                "description": "Start of time range (ISO format)"
                            },
                            "timeMax": {
                                "type": "string",
                                "description": "End of time range (ISO format)"
                            },
                            "maxResults": {
                                "type": "integer",
                                "description": "Maximum number of events to return (optional)"
                            },
                            "orderBy": {
                                "type": "string",
                                "description": "Sort order (startTime or updated, optional)"
                            }
                        },
                        "required": ["timeMin", "timeMax"]
                    }
                }
            }
        ],
        "tool_choice": "auto",
    }

    response = requests.post(GROQ_API_URL, json=payload, headers=headers)
    
    try:
        response_json = response.json()
        print(f"LLM Response: {json.dumps(response_json, indent=2)}")  # Pretty-print response for debugging
        return response_json
    except Exception as e:
        print(f"Error parsing response: {e}")
        return {"error": "Invalid response from LLM"}
