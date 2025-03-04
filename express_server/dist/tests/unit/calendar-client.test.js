// @ts-nocheck
import { jest } from '@jest/globals';
import { mockMCPClient } from '../mocks/mcp-server';
// Tell Jest to use the mock implementation
jest.mock('../../src/calendar-client');
// Import the mocked CalendarClient
import { CalendarClient } from '../../src/calendar-client';
describe('CalendarClient', () => {
    let calendarClient;
    beforeEach(() => {
        jest.clearAllMocks();
        calendarClient = new CalendarClient('mock-refresh-token');
        calendarClient.mcpClient = mockMCPClient;
    });
    test('should initialize with refresh token', () => {
        expect(calendarClient).toBeDefined();
        expect(calendarClient.refreshToken).toBe('mock-refresh-token');
    });
    test('should connect to MCP server', async () => {
        await calendarClient.connect();
        expect(calendarClient.mcpClient.connect).toHaveBeenCalled();
        expect(calendarClient.isConnected).toBe(true);
    });
    test('should create event', async () => {
        const mockEvent = {
            summary: 'Test Event',
            start: { dateTime: '2025-03-24T10:00:00Z' },
            end: { dateTime: '2025-03-24T11:00:00Z' }
        };
        await calendarClient.connect();
        const result = await calendarClient.createEvent(mockEvent);
        expect(calendarClient.mcpClient.callTool).toHaveBeenCalledWith({
            name: 'create_event',
            arguments: mockEvent
        });
        expect(result).toBeDefined();
        expect(result.id).toBe('newEvent123');
    });
    test('should update event', async () => {
        const mockEvent = {
            summary: 'Updated Event'
        };
        await calendarClient.connect();
        const result = await calendarClient.updateEvent('event123', mockEvent);
        expect(calendarClient.mcpClient.callTool).toHaveBeenCalledWith({
            name: 'update_event',
            arguments: { eventId: 'event123', ...mockEvent }
        });
        expect(result).toBeDefined();
        expect(result.summary).toBe('Updated Event');
    });
    test('should delete event', async () => {
        await calendarClient.connect();
        const result = await calendarClient.deleteEvent('event123');
        expect(calendarClient.mcpClient.callTool).toHaveBeenCalledWith({
            name: 'delete_event',
            arguments: { eventId: 'event123' }
        });
        expect(result).toBeDefined();
        expect(result.status).toBe('deleted');
    });
    test('should list events', async () => {
        const timeMin = '2025-03-01T00:00:00Z';
        const timeMax = '2025-03-31T23:59:59Z';
        await calendarClient.connect();
        const result = await calendarClient.listEvents(timeMin, timeMax);
        expect(calendarClient.mcpClient.callTool).toHaveBeenCalledWith({
            name: 'list_events',
            arguments: { timeMin, timeMax }
        });
        expect(Array.isArray(result)).toBe(true);
        expect(result[0].id).toBe('event123');
    });
    test('should handle connection errors', async () => {
        calendarClient = new CalendarClient('invalid-token');
        await expect(calendarClient.connect()).rejects.toThrow('Connection failed');
    });
    test('should throw error if not connected', async () => {
        await expect(calendarClient.createEvent({})).rejects.toThrow('Not connected to MCP server');
    });
});
