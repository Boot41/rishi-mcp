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
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        // Get response from Groq
        const llmResponse = await groqClient.chat(messages);
        // Check if there's an error
        if (llmResponse.error) {
            return res.status(500).json(llmResponse);
        }
        // Get the message from the choices
        const message = llmResponse.choices[0].message;
        // If there are tool calls, execute them
        if (message.tool_calls) {
            const functionResults = [];
            // Execute all tool calls and collect results
            for (const toolCall of message.tool_calls) {
                if (toolCall.type === 'function') {
                    const { name, arguments: args } = toolCall.function;
                    const parsedArgs = JSON.parse(args);
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
                        case 'list_events':
                            result = await calendarClient.listEvents(parsedArgs);
                            break;
                        case 'delete_event':
                            result = await calendarClient.deleteEvent(parsedArgs.eventId);
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
            }
            // Create a new message array for the second LLM call
            const secondCallMessages = [
                ...messages,
                {
                    role: "assistant",
                    content: message.content || "I'll help you with that calendar operation."
                },
                {
                    role: "function",
                    content: JSON.stringify(functionResults, null, 2),
                    name: "calendar_operation_results"
                }
            ];
            // Get a human-friendly response from the LLM about the function results
            const finalResponse = await groqClient.chat(secondCallMessages, false); // false means don't include tool definitions
            // Return both the function results and the human-friendly response
            return res.json({
                function_results: functionResults,
                response: finalResponse.choices[0].message.content
            });
        }
        return res.json({ response: message.content });
    }
    catch (error) {
        console.error('Error in chat endpoint:', error);
        return res.status(500).json({ error: error.message });
    }
});
// Start the server
startServer().catch(console.error);
