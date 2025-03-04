// @ts-nocheck
import { jest } from '@jest/globals';
// Mock environment variables
process.env.MCP_API_KEY = 'mock-mcp-api-key';
process.env.GROQ_API_KEY = 'mock-groq-api-key';
process.env.GOOGLE_CLIENT_ID = 'mock-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'mock-google-client-secret';
process.env.GOOGLE_REDIRECT_URI = 'http://localhost:3000/oauth2callback';
// Set up Jest mocks
jest.mock('../src/calendar-client');
jest.mock('../src/server');
// Suppress console logs during tests
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
};
