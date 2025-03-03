import axios from "axios";

interface Message {
  role: string;
  content: string;
  tool_calls?: any[];
  name?: string;
}

interface ChatResponse {
  choices: {
    message: Message;
    index: number;
    finish_reason: string;
  }[];
  error?: string;
}

export class GroqClient {
  private apiKey: string;
  private baseURL = "https://api.groq.com/openai/v1/chat/completions";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(
    messages: Message[],
    includeTools: boolean = true
  ): Promise<ChatResponse> {
    try {
      // Enhance the system message
      const enhancedMessages = messages.map((msg) => {
        if (msg.role === "system") {
          return {
            ...msg,
            content: `${msg.content}\nYou have access to the following calendar functions:
1. create_event: Create a new calendar event
2. get_event: Retrieve details of a specific event using its ID
3. update_event: Update an existing event's details
4. delete_event: Remove an event from the calendar
5. list_events: Get events within a specified time range

Always format dates in ISO 8601 format with timezone offset. For example, 2025-03-04T14:00:00+05:30 represents 2 PM IST on March 4th, 2025.`,
          };
        }
        return msg;
      });

      const tools = includeTools
        ? [
            {
              type: "function",
              function: {
                name: "create_event",
                description: "Creates a new event in Google Calendar",
                parameters: {
                  type: "object",
                  properties: {
                    summary: {
                      type: "string",
                      description: "Title of the event",
                    },
                    description: {
                      type: "string",
                      description: "Description of the event",
                    },
                    location: {
                      type: "string",
                      description: "Location of the event",
                    },
                    start: {
                      type: "object",
                      properties: {
                        dateTime: {
                          type: "string",
                          description:
                            "Start time in ISO 8601 format with timezone (e.g., 2025-03-04T14:00:00+05:30)",
                        },
                        timeZone: {
                          type: "string",
                          description: "Time zone for the start time",
                        },
                      },
                      required: ["dateTime"],
                    },
                    end: {
                      type: "object",
                      properties: {
                        dateTime: {
                          type: "string",
                          description:
                            "End time in ISO 8601 format with timezone (e.g., 2025-03-04T15:00:00+05:30)",
                        },
                        timeZone: {
                          type: "string",
                          description: "Time zone for the end time",
                        },
                      },
                      required: ["dateTime"],
                    },
                  },
                  required: ["summary", "start", "end"],
                },
              },
            },
            {
              type: "function",
              function: {
                name: "get_event",
                description: "Retrieves details of a specific event",
                parameters: {
                  type: "object",
                  properties: {
                    eventId: {
                      type: "string",
                      description: "ID of the event to retrieve",
                    },
                  },
                  required: ["eventId"],
                },
              },
            },
            {
              type: "function",
              function: {
                name: "update_event",
                description: "Updates an existing event",
                parameters: {
                  type: "object",
                  properties: {
                    eventId: {
                      type: "string",
                      description: "ID of the event to update",
                    },
                    summary: {
                      type: "string",
                      description: "New event title",
                    },
                    description: {
                      type: "string",
                      description: "New event description",
                    },
                    location: {
                      type: "string",
                      description: "New event location",
                    },
                    start: {
                      type: "object",
                      properties: {
                        dateTime: {
                          type: "string",
                          description: "New start time in ISO 8601 format with timezone",
                        },
                        timeZone: {
                          type: "string",
                          description: "Time zone for the start time",
                        },
                      },
                    },
                    end: {
                      type: "object",
                      properties: {
                        dateTime: {
                          type: "string",
                          description: "New end time in ISO 8601 format with timezone",
                        },
                        timeZone: {
                          type: "string",
                          description: "Time zone for the end time",
                        },
                      },
                    },
                  },
                  required: ["eventId"],
                },
              },
            },
            {
              type: "function",
              function: {
                name: "delete_event",
                description: "Deletes an event from the calendar",
                parameters: {
                  type: "object",
                  properties: {
                    eventId: {
                      type: "string",
                      description: "ID of the event to delete",
                    },
                  },
                  required: ["eventId"],
                },
              },
            },
            {
              type: "function",
              function: {
                name: "list_events",
                description: "Lists events within a specified time range",
                parameters: {
                  type: "object",
                  properties: {
                    timeMin: {
                      type: "string",
                      description: "Start of time range in ISO 8601 format",
                    },
                    timeMax: {
                      type: "string",
                      description: "End of time range in ISO 8601 format",
                    },
                    maxResults: {
                      type: "number",
                      description: "Maximum number of events to return",
                    },
                    orderBy: {
                      type: "string",
                      enum: ["startTime", "updated"],
                      description: "Sort order for events",
                    },
                  },
                  required: ["timeMin", "timeMax"],
                },
              },
            },
          ]
        : undefined;

      const response = await axios.post(
        this.baseURL,
        {
          model: "llama-3.3-70b-versatile",
          messages: enhancedMessages,
          tools,
          tool_choice: "auto",
          temperature: 0.1,
          max_tokens: 4096,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Groq API Error:", error.response?.data || error.message);
      if (error.response?.data) {
        return {
          choices: [],
          error: error.response.data.error.message,
        };
      }
      return {
        choices: [],
        error: error.message,
      };
    }
  }
}
