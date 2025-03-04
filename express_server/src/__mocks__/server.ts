// @ts-nocheck
// Mock implementation of server.ts
import express from 'express';
import cors from 'cors';
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

const app = express();
app.use(cors());
app.use(express.json());

// Mock chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    if (message.includes('error')) {
      throw new Error('MCP Server Error');
    }
    
    let toolName = 'list_events';
    if (message.includes('create')) {
      toolName = 'create_event';
    } else if (message.includes('update')) {
      toolName = 'update_event';
    } else if (message.includes('delete')) {
      toolName = 'delete_event';
    }
    
    const result = await mockMCPClient.callTool({
      name: toolName,
      arguments: { message }
    });
    
    return res.json({ 
      response: `Successfully processed: ${message}`,
      data: JSON.parse(result.content[0].text)
    });
  } catch (error: any) {
    console.error('Error in chat endpoint:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Mock calendar events endpoint
app.get('/calendar/events', async (req, res) => {
  try {
    const { timeMin, timeMax } = req.query;
    
    const result = await mockMCPClient.callTool({
      name: 'list_events',
      arguments: { timeMin, timeMax }
    });
    
    return res.json({ 
      events: JSON.parse(result.content[0].text)
    });
  } catch (error: any) {
    console.error('Error in calendar events endpoint:', error);
    return res.status(500).json({ error: error.message });
  }
});

export { app, mockMCPClient };
