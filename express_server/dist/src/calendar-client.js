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
export class CalendarClient {
    constructor(refreshToken) {
        // Check required environment variables
        const requiredEnvVars = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"];
        for (const envVar of requiredEnvVars) {
            if (!process.env[envVar]) {
                throw new Error(`Missing required environment variable: ${envVar}`);
            }
        }
        this.transport = new StdioClientTransport({
            command: "node",
            args: [
                path.join(__dirname, "../../GongRzhe_Calendar-MCP-Server/build/index.js"),
            ],
            env: {
                GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
                GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
                GOOGLE_REFRESH_TOKEN: refreshToken,
            },
        });
        this.client = new Client({
            name: "calendar-client",
            version: "1.0.0",
        }, {
            capabilities: {
                tools: {},
            },
        });
    }
    async connect() {
        await this.client.connect(this.transport);
    }
    async listTools() {
        return await this.client.listTools();
    }
    async createEvent(args) {
        return (await this.client.callTool({
            name: "create_event",
            arguments: args,
        }));
    }
    async getEvent(eventId) {
        return (await this.client.callTool({
            name: "get_event",
            arguments: { eventId },
        }));
    }
    async updateEvent(args) {
        return (await this.client.callTool({
            name: "update_event",
            arguments: args,
        }));
    }
    async listEvents(args) {
        return (await this.client.callTool({
            name: "list_events",
            arguments: args,
        }));
    }
    async deleteEvent(eventId) {
        return (await this.client.callTool({
            name: "delete_event",
            arguments: { eventId },
        }));
    }
    close() {
        this.transport.close();
    }
}
