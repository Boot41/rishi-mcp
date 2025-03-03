import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GroqClient } from './groq-client.js';
import { CalendarClient } from './calendar-client.js';
// Initialize environment variables
dotenv.config();
// Create Express app
const app = express();
app.use(cors());
app.use(express.json());
// Initialize clients
const groqClient = new GroqClient(process.env.GROQ_API_KEY || '');
const calendarClient = new CalendarClient();
// Connect to MCP server when server starts
const startServer = async () => {
    try {
        await calendarClient.connect();
        console.log('Connected to MCP server');
        // Start server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to connect to MCP server:', error);
        process.exit(1);
    }
};
// Chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        // Create messages array with system message
        const messages = [
            {
                role: 'system',
                content: 'You are a helpful calendar assistant that can manage calendar events. You can create, read, update, and delete events, as well as list events within a time range. You should also be able to answer general questions about calendar management without using any tools.'
            },
            {
                role: 'user',
                content: message
            }
        ];
        // Get response from Groq
        const llmResponse = await groqClient.chat(messages);
        // Check if there's an error
        if (llmResponse.error) {
            return res.status(500).json({ error: llmResponse.error });
        }
        // Get the message from the choices
        const assistantMessage = llmResponse.choices[0].message;
        // If there are tool calls, execute them
        if (assistantMessage.tool_calls) {
            const functionResults = [];
            // Execute all tool calls and collect results
            for (const toolCall of assistantMessage.tool_calls) {
                if (toolCall.type === 'function') {
                    const { name, arguments: args } = toolCall.function;
                    const parsedArgs = JSON.parse(args);
                    try {
                        // Execute the calendar function with proper type checking
                        let result;
                        switch (name) {
                            case 'create_event':
                                result = await calendarClient.createEvent(parsedArgs);
                                break;
                            case 'get_event':
                                result = await calendarClient.getEvent(parsedArgs.eventId);
                                break;
                            case 'update_event':
                                result = await calendarClient.updateEvent(parsedArgs);
                                break;
                            case 'delete_event':
                                result = await calendarClient.deleteEvent(parsedArgs.eventId);
                                break;
                            case 'list_events':
                                result = await calendarClient.listEvents(parsedArgs);
                                break;
                            default:
                                throw new Error(`Unknown function: ${name}`);
                        }
                        functionResults.push({
                            name,
                            result,
                            args: parsedArgs
                        });
                    }
                    catch (error) {
                        functionResults.push({
                            name,
                            result: { error: error.message },
                            args: parsedArgs
                        });
                    }
                }
            }
            // Create a new message array for the second LLM call
            const secondCallMessages = [
                ...messages,
                {
                    role: "assistant",
                    content: assistantMessage.content || "I'll help you with that calendar operation."
                },
                {
                    role: "function",
                    content: JSON.stringify(functionResults, null, 2),
                    name: "calendar_operation_results"
                }
            ];
            // Get a human-friendly response from the LLM about the function results
            const finalResponse = await groqClient.chat(secondCallMessages, false);
            if (finalResponse.error) {
                return res.status(500).json({ error: finalResponse.error });
            }
            // Return both the function results and the human-friendly response
            return res.json({
                function_results: functionResults,
                response: finalResponse.choices[0].message.content
            });
        }
        return res.json({ response: assistantMessage.content });
    }
    catch (error) {
        console.error('Error in chat endpoint:', error);
        return res.status(500).json({ error: error.message });
    }
});
// Start the server
startServer().catch(console.error);
