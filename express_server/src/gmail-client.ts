import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from root .env
dotenv.config({ path: path.join(__dirname, "../../.env") });

interface EmailArgs {
  [key: string]: unknown;
  to?: string[];
  subject?: string;
  body?: string;
  cc?: string[];
  bcc?: string[];
  messageId?: string;
  query?: string;
  maxResults?: number;
  labelIds?: string[];
}

interface MCPResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

export class GmailClient {
  private client: Client;
  private transport: StdioClientTransport;

  constructor() {
    // Check if OAuth keys file exists
    const oauthPath = path.join(process.cwd(), "gcp-oauth.keys.json");
    if (!process.env.GMAIL_OAUTH_PATH && !process.env.GMAIL_CREDENTIALS_PATH) {
      console.log(
        "No OAuth configuration found in environment. Using local gcp-oauth.keys.json"
      );
    }

    this.transport = new StdioClientTransport({
      command: "node",
      args: [
        process.env.DOCKER === "true"
          ? "/usr/src/Gmail-MCP-Server/dist/index.js"
          : path.join(__dirname, "../../../Gmail-MCP-Server/dist/index.js"),
      ],
      env: {
        ...(process.env.GMAIL_OAUTH_PATH && {
          GMAIL_OAUTH_PATH: process.env.GMAIL_OAUTH_PATH,
        }),
        ...(process.env.GMAIL_CREDENTIALS_PATH && {
          GMAIL_CREDENTIALS_PATH: process.env.GMAIL_CREDENTIALS_PATH,
        }),
      },
    });

    this.client = new Client(
      {
        name: "gmail-client",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {
            send_email: {
              description: "Send a new email",
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
            read_email: {
              description: "Retrieve the content of a specific email",
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
            search_emails: {
              description: "Search emails using Gmail search syntax",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "Gmail search query",
                  },
                  maxResults: {
                    type: "number",
                    description: "Maximum number of results to return",
                  },
                },
                required: ["query"],
              },
            },
            modify_email: {
              description: "Modify email labels",
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
            delete_email: {
              description: "Delete an email",
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
        },
      }
    );
  }

  async connect(): Promise<void> {
    await this.client.connect(this.transport);
  }

  async listTools() {
    return await this.client.listTools();
  }

  async sendEmail(args: EmailArgs): Promise<MCPResponse> {
    return (await this.client.callTool({
      name: "send_email",
      arguments: args,
    })) as MCPResponse;
  }

  async readEmail(messageId: string): Promise<MCPResponse> {
    return (await this.client.callTool({
      name: "read_email",
      arguments: { messageId },
    })) as MCPResponse;
  }

  async searchEmails(args: EmailArgs): Promise<MCPResponse> {
    return (await this.client.callTool({
      name: "search_emails",
      arguments: args,
    })) as MCPResponse;
  }

  async modifyEmail(args: EmailArgs): Promise<MCPResponse> {
    return (await this.client.callTool({
      name: "modify_email",
      arguments: args,
    })) as MCPResponse;
  }

  async deleteEmail(messageId: string): Promise<MCPResponse> {
    return (await this.client.callTool({
      name: "delete_email",
      arguments: { messageId },
    })) as MCPResponse;
  }

  close() {
    this.transport.close();
  }
}
