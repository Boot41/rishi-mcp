// @ts-nocheck
import { jest } from '@jest/globals';
export const mockMCPResponse = {
    listEvents: {
        content: [{
                type: "text",
                text: JSON.stringify([
                    {
                        id: "event123",
                        summary: "Test Meeting",
                        start: { dateTime: "2025-03-24T10:00:00Z" },
                        end: { dateTime: "2025-03-24T11:00:00Z" }
                    }
                ])
            }]
    },
    createEvent: {
        content: [{
                type: "text",
                text: JSON.stringify({
                    id: "newEvent123",
                    summary: "New Test Event",
                    status: "confirmed"
                })
            }]
    },
    updateEvent: {
        content: [{
                type: "text",
                text: JSON.stringify({
                    id: "event123",
                    summary: "Updated Event",
                    status: "confirmed"
                })
            }]
    },
    deleteEvent: {
        content: [{
                type: "text",
                text: JSON.stringify({ status: "deleted" })
            }]
    }
};
export const mockMCPClient = {
    connect: jest.fn().mockResolvedValue(undefined),
    listTools: jest.fn().mockResolvedValue([
        "create_event",
        "update_event",
        "delete_event",
        "list_events"
    ]),
    callTool: jest.fn().mockImplementation((params) => {
        switch (params.name) {
            case "list_events":
                return Promise.resolve(mockMCPResponse.listEvents);
            case "create_event":
                return Promise.resolve(mockMCPResponse.createEvent);
            case "update_event":
                return Promise.resolve(mockMCPResponse.updateEvent);
            case "delete_event":
                return Promise.resolve(mockMCPResponse.deleteEvent);
            default:
                return Promise.reject(new Error("Unknown tool"));
        }
    })
};
