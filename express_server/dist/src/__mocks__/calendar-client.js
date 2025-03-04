// @ts-nocheck
// Mock implementation of calendar-client.ts
import { jest } from '@jest/globals';
// Create a mock MCP client
const mockMCPClient = {
    connect: jest.fn().mockResolvedValue(true),
    callTool: jest.fn().mockImplementation(({ name, arguments: args }) => {
        let response;
        switch (name) {
            case 'create_event':
                response = {
                    id: 'newEvent123',
                    summary: args.summary || 'New Event',
                    start: args.start,
                    end: args.end
                };
                break;
            case 'update_event':
                response = {
                    id: args.eventId || 'event123',
                    summary: args.summary || 'Updated Event',
                    start: args.start,
                    end: args.end
                };
                break;
            case 'delete_event':
                response = {
                    status: 'deleted',
                    id: args.eventId || 'event123'
                };
                break;
            case 'list_events':
            default:
                response = [
                    {
                        id: 'event123',
                        summary: 'Team Meeting',
                        start: { dateTime: '2025-03-24T10:00:00Z' },
                        end: { dateTime: '2025-03-24T11:00:00Z' }
                    },
                    {
                        id: 'event456',
                        summary: 'Project Review',
                        start: { dateTime: '2025-03-25T14:00:00Z' },
                        end: { dateTime: '2025-03-25T15:30:00Z' }
                    }
                ];
                break;
        }
        return Promise.resolve({
            content: [{ text: JSON.stringify(response) }]
        });
    })
};
export class CalendarClient {
    constructor(refreshToken) {
        this.refreshToken = refreshToken;
        this.mcpClient = mockMCPClient;
        this.isConnected = false;
    }
    async connect() {
        if (this.refreshToken === 'invalid-token') {
            throw new Error('Connection failed');
        }
        await this.mcpClient.connect();
        this.isConnected = true;
        return this;
    }
    async createEvent(event) {
        if (!this.isConnected) {
            throw new Error('Not connected to MCP server');
        }
        const result = await this.mcpClient.callTool({
            name: 'create_event',
            arguments: event
        });
        return JSON.parse(result.content[0].text);
    }
    async updateEvent(eventId, event) {
        if (!this.isConnected) {
            throw new Error('Not connected to MCP server');
        }
        const result = await this.mcpClient.callTool({
            name: 'update_event',
            arguments: { eventId, ...event }
        });
        return JSON.parse(result.content[0].text);
    }
    async deleteEvent(eventId) {
        if (!this.isConnected) {
            throw new Error('Not connected to MCP server');
        }
        const result = await this.mcpClient.callTool({
            name: 'delete_event',
            arguments: { eventId }
        });
        return JSON.parse(result.content[0].text);
    }
    async listEvents(timeMin, timeMax) {
        if (!this.isConnected) {
            throw new Error('Not connected to MCP server');
        }
        const result = await this.mcpClient.callTool({
            name: 'list_events',
            arguments: { timeMin, timeMax }
        });
        return JSON.parse(result.content[0].text);
    }
}
