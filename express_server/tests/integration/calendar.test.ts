// @ts-nocheck
import { jest } from '@jest/globals';
import request from 'supertest';

// Tell Jest to use the mock implementation
jest.mock('../../src/server');

// Import the mocked app and mockMCPClient
import { app, mockMCPClient } from '../../src/server';

describe('Calendar Operations', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Chat Endpoint', () => {
    test('should create a new event via natural language', async () => {
      const response = await request(app)
        .post('/chat')
        .send({
          message: "create a team meeting tomorrow at 10am"
        });

      expect(response.status).toBe(200);
      expect(mockMCPClient.callTool).toHaveBeenCalledWith({
        name: "create_event",
        arguments: expect.any(Object)
      });
    });

    test('should update an existing event', async () => {
      const response = await request(app)
        .post('/chat')
        .send({
          message: "update the team meeting title to planning session"
        });

      expect(response.status).toBe(200);
      expect(mockMCPClient.callTool).toHaveBeenCalledWith({
        name: "update_event",
        arguments: expect.any(Object)
      });
    });

    test('should handle MCP server errors gracefully', async () => {
      const response = await request(app)
        .post('/chat')
        .send({
          message: "error creating a meeting"
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Calendar Events', () => {
    test('should list calendar events', async () => {
      const response = await request(app)
        .get('/calendar/events')
        .query({
          timeMin: '2025-03-01T00:00:00Z',
          timeMax: '2025-03-31T23:59:59Z'
        });

      expect(response.status).toBe(200);
      expect(mockMCPClient.callTool).toHaveBeenCalledWith({
        name: "list_events",
        arguments: expect.any(Object)
      });
    });
  });
});
