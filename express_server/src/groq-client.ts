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
            content: includeTools
              ? `${msg.content}\nThe current year is 2025. You have access to the following functions:

Calendar Functions:
1. create_event: Create a new calendar event
2. get_event: Retrieve details of a specific event using its ID
3. update_event: Update an existing event's details
4. delete_event: Remove an event from the calendar
5. list_events: Get events within a specified time range

Gmail Functions:
1. send_email: Send a new email to one or more recipients
2. read_email: Retrieve the content of a specific email by ID
3. search_emails: Search emails using Gmail's powerful search syntax
4. modify_email: Modify email labels (move to different folders)
5. delete_email: Permanently delete an email

When users want to update or delete calendar events, they can describe them naturally (e.g., "delete my meeting tomorrow", "update the project review next week"). You should:
1. List the matching events, if found, do not ask the user for any confirmation or clarification. Delete or update (depending on the initial choice of the user) the first matched event. It is extremely important that you always assume that the user has confirmed the update or deletion of the event. In case of updation always assume that the other details that the user hasnt provided are the same.
2. If no matching events are found, return a response indicating that no events were found.

For Gmail operations:
1. When searching emails, use Gmail's search syntax (e.g., 'from:example@gmail.com', 'subject:meeting', 'newer_than:2d')
2. Always format email bodies in a clear, readable format
3. When modifying emails, use standard Gmail label IDs (e.g., 'INBOX', 'SPAM', 'TRASH')

Always format dates in ISO 8601 format with timezone offset. For example, 2025-03-04T14:00:00+05:30 represents 2 PM IST on March 4th, 2025.`
              : `${msg.content}\nThe current year is 2025. return the response in human readable format.`,
          };
        }
        return msg;
      });

      const tools = includeTools
        ? [
            // Calendar Tools
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
                description:
                  "Updates an existing event. Can find events by description, date, or ID",
                parameters: {
                  type: "object",
                  properties: {
                    eventId: {
                      type: "string",
                      description: "ID of the event to update (if known)",
                    },
                    query: {
                      type: "string",
                      description:
                        "Natural language description of the event to update (e.g., 'team meeting', 'project review')",
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
                          description:
                            "New start time in ISO 8601 format with timezone",
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
                          description:
                            "New end time in ISO 8601 format with timezone",
                        },
                        timeZone: {
                          type: "string",
                          description: "Time zone for the end time",
                        },
                      },
                    },
                  },
                  anyOf: [
                    {
                      required: ["eventId"],
                    },
                    {
                      required: ["query"],
                    },
                  ],
                },
              },
            },
            {
              type: "function",
              function: {
                name: "delete_event",
                description:
                  "Deletes an event from the calendar. Can find events by description, date, or ID",
                parameters: {
                  type: "object",
                  properties: {
                    eventId: {
                      type: "string",
                      description: "ID of the event to delete (if known)",
                    },
                    query: {
                      type: "string",
                      description:
                        "Natural language description of the event (e.g., 'team meeting tomorrow', 'project review on March 26th')",
                    },
                  },
                  anyOf: [
                    {
                      required: ["eventId"],
                    },
                    {
                      required: ["query"],
                    },
                  ],
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
            // Gmail Tools
            {
              type: "function",
              function: {
                name: "send_email",
                description: "Sends a new email",
                parameters: {
                  type: "object",
                  properties: {
                    to: {
                      type: "array",
                      items: { type: "string" },
                      description: "List of recipient email addresses",
                    },
                    subject: {
                      type: "string",
                      description: "Email subject",
                    },
                    body: {
                      type: "string",
                      description: "Email body content",
                    },
                    cc: {
                      type: "array",
                      items: { type: "string" },
                      description: "List of CC recipients",
                    },
                    bcc: {
                      type: "array",
                      items: { type: "string" },
                      description: "List of BCC recipients",
                    },
                  },
                  required: ["to", "subject", "body"],
                },
              },
            },
            {
              type: "function",
              function: {
                name: "read_email",
                description: "Retrieves the content of a specific email",
                parameters: {
                  type: "object",
                  properties: {
                    messageId: {
                      type: "string",
                      description: "ID of the email message to retrieve",
                    },
                  },
                  required: ["messageId"],
                },
              },
            },
            {
              type: "function",
              function: {
                name: "search_emails",
                description: "Searches for emails using Gmail search syntax",
                parameters: {
                  type: "object",
                  properties: {
                    query: {
                      type: "string",
                      description: "Gmail search query (e.g., 'from:example@gmail.com')",
                    },
                    maxResults: {
                      type: "number",
                      description: "Maximum number of results to return",
                    },
                  },
                  required: ["query"],
                },
              },
            },
            {
              type: "function",
              function: {
                name: "modify_email",
                description: "Modifies email labels (move to different folders)",
                parameters: {
                  type: "object",
                  properties: {
                    messageId: {
                      type: "string",
                      description: "ID of the email message to modify",
                    },
                    labelIds: {
                      type: "array",
                      items: { type: "string" },
                      description: "List of label IDs to apply",
                    },
                  },
                  required: ["messageId", "labelIds"],
                },
              },
            },
            {
              type: "function",
              function: {
                name: "delete_email",
                description: "Permanently deletes an email",
                parameters: {
                  type: "object",
                  properties: {
                    messageId: {
                      type: "string",
                      description: "ID of the email message to delete",
                    },
                  },
                  required: ["messageId"],
                },
              },
            },
          ]
        : undefined;

      const response = await axios.post(
        this.baseURL,
        {
          model: "qwen-2.5-32b",
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
