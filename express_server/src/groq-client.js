import axios from 'axios';

export class GroqClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    }

    async chat(messages, includeTools = true) {
        try {
            // Add system message if not present
            if (!messages.some(msg => msg.role === 'system')) {
                messages.unshift({
                    role: 'system',
                    content: includeTools 
                        ? 'You are a helpful calendar assistant. When the user asks about calendar operations, use the appropriate function. For listing events, use list_events. For creating events, use create_event. For getting event details, use get_event. For updating events, use update_event. For deleting events, use delete_event.'
                        : 'You are a helpful calendar assistant. Please provide a natural, friendly response based on the calendar operations that were just performed. Focus on the key details that would be most relevant to the user.'
                });
            }

            const payload = {
                model: 'llama-3.3-70b-versatile',
                messages,
                temperature: 0.7 // Add some creativity to responses
            };

            // Only include tools in the first call
            if (includeTools) {
                payload.tools = [
                    {
                        type: 'function',
                        function: {
                            name: 'create_event',
                            description: 'Create a new event in the user\'s calendar',
                            parameters: {
                                type: 'object',
                                properties: {
                                    summary: {
                                        type: 'string',
                                        description: 'The title of the event'
                                    },
                                    start: {
                                        type: 'object',
                                        properties: {
                                            dateTime: {
                                                type: 'string',
                                                description: 'The event start time in ISO 8601 format'
                                            },
                                            timeZone: {
                                                type: 'string',
                                                description: 'The time zone (optional)'
                                            }
                                        },
                                        required: ['dateTime']
                                    },
                                    end: {
                                        type: 'object',
                                        properties: {
                                            dateTime: {
                                                type: 'string',
                                                description: 'The event end time in ISO 8601 format'
                                            },
                                            timeZone: {
                                                type: 'string',
                                                description: 'The time zone (optional)'
                                            }
                                        },
                                        required: ['dateTime']
                                    },
                                    description: {
                                        type: 'string',
                                        description: 'Description of the event (optional)'
                                    },
                                    location: {
                                        type: 'string',
                                        description: 'Location of the event (optional)'
                                    }
                                },
                                required: ['summary', 'start', 'end']
                            }
                        }
                    },
                    {
                        type: 'function',
                        function: {
                            name: 'get_event',
                            description: 'Retrieves details of a specific event',
                            parameters: {
                                type: 'object',
                                properties: {
                                    eventId: {
                                        type: 'string',
                                        description: 'ID of the event to retrieve'
                                    }
                                },
                                required: ['eventId']
                            }
                        }
                    },
                    {
                        type: 'function',
                        function: {
                            name: 'update_event',
                            description: 'Updates an existing event',
                            parameters: {
                                type: 'object',
                                properties: {
                                    eventId: {
                                        type: 'string',
                                        description: 'ID of the event to update'
                                    },
                                    summary: {
                                        type: 'string',
                                        description: 'New event title (optional)'
                                    },
                                    start: {
                                        type: 'object',
                                        properties: {
                                            dateTime: {
                                                type: 'string',
                                                description: 'New start time in ISO 8601 format'
                                            },
                                            timeZone: {
                                                type: 'string',
                                                description: 'Time zone (optional)'
                                            }
                                        }
                                    },
                                    end: {
                                        type: 'object',
                                        properties: {
                                            dateTime: {
                                                type: 'string',
                                                description: 'New end time in ISO 8601 format'
                                            },
                                            timeZone: {
                                                type: 'string',
                                                description: 'Time zone (optional)'
                                            }
                                        }
                                    },
                                    description: {
                                        type: 'string',
                                        description: 'New event description (optional)'
                                    },
                                    location: {
                                        type: 'string',
                                        description: 'New event location (optional)'
                                    }
                                },
                                required: ['eventId']
                            }
                        }
                    },
                    {
                        type: 'function',
                        function: {
                            name: 'delete_event',
                            description: 'Deletes an event from the calendar',
                            parameters: {
                                type: 'object',
                                properties: {
                                    eventId: {
                                        type: 'string',
                                        description: 'ID of the event to delete'
                                    }
                                },
                                required: ['eventId']
                            }
                        }
                    },
                    {
                        type: 'function',
                        function: {
                            name: 'list_events',
                            description: 'Lists events within a specified time range',
                            parameters: {
                                type: 'object',
                                properties: {
                                    timeMin: {
                                        type: 'string',
                                        description: 'Start of time range (ISO format)'
                                    },
                                    timeMax: {
                                        type: 'string',
                                        description: 'End of time range (ISO format)'
                                    },
                                    maxResults: {
                                        type: 'integer',
                                        description: 'Maximum number of events to return (optional)'
                                    },
                                    orderBy: {
                                        type: 'string',
                                        description: 'Sort order (startTime or updated, optional)'
                                    }
                                },
                                required: ['timeMin', 'timeMax']
                            }
                        }
                    }
                ];
                payload.tool_choice = 'auto';
            }

            const response = await axios.post(
                this.apiUrl,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error calling Groq API:', error);
            return { error: error.message };
        }
    }
}

export default GroqClient;
