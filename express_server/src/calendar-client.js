import { MCPClient } from '@modelcontextprotocol/sdk';

export class CalendarClient {
    constructor() {
        this.mcpClient = new MCPClient();
    }

    async connect() {
        if (!this.connected) {
            await this.mcpClient.connect();
            this.connected = true;
        }
    }

    async create_event(params) {
        await this.connect();
        const result = await this.mcpClient.callTool('create_event', params);
        return this.extractContent(result);
    }

    async get_event(params) {
        await this.connect();
        const result = await this.mcpClient.callTool('get_event', params);
        return this.extractContent(result);
    }

    async update_event(params) {
        await this.connect();
        const result = await this.mcpClient.callTool('update_event', params);
        return this.extractContent(result);
    }

    async delete_event(params) {
        await this.connect();
        const result = await this.mcpClient.callTool('delete_event', params);
        return this.extractContent(result);
    }

    async list_events(params) {
        await this.connect();
        const result = await this.mcpClient.callTool('list_events', params);
        return this.extractContent(result);
    }

    extractContent(result) {
        if (result.content && Array.isArray(result.content)) {
            return result.content.map(item => item.text).join('\n');
        }
        return result;
    }
}
