// @ts-nocheck
export const mockGroqResponses = {
    createEvent: {
        choices: [{
                message: {
                    content: JSON.stringify({
                        action: "create",
                        summary: "Team Meeting",
                        start: "2025-03-24T10:00:00Z",
                        end: "2025-03-24T11:00:00Z",
                        response: "Created a team meeting for March 24th"
                    })
                }
            }]
    },
    updateEvent: {
        choices: [{
                message: {
                    content: JSON.stringify({
                        action: "update",
                        eventId: "event123",
                        summary: "Updated Meeting",
                        response: "Updated the meeting title"
                    })
                }
            }]
    },
    deleteEvent: {
        choices: [{
                message: {
                    content: JSON.stringify({
                        action: "delete",
                        eventId: "event123",
                        response: "Deleted the meeting"
                    })
                }
            }]
    },
    noAction: {
        choices: [{
                message: {
                    content: JSON.stringify({
                        action: "none",
                        response: "I couldn't understand your request"
                    })
                }
            }]
    }
};
