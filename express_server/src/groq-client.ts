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
            content: `${msg.content}\nYou MUST use the create_event function to create calendar events. Always format dates in ISO 8601 format with timezone offset. For example, 2025-03-04T14:00:00+05:30 represents 2 PM IST on March 4th, 2025.`,
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
                description: "Create a new calendar event",
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
                    start: {
                      type: "object",
                      properties: {
                        dateTime: {
                          type: "string",
                          description:
                            "Start time in ISO 8601 format with timezone (e.g., 2025-03-04T14:00:00+05:30)",
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
                      },
                      required: ["dateTime"],
                    },
                  },
                  required: ["summary", "start", "end"],
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
          tool_choice: {
            type: "function",
            function: { name: "create_event" },
          },
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
