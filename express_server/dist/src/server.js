import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GroqClient } from "./groq-client.js";
import { CalendarClient } from "./calendar-client.js";
import { GmailClient } from "./gmail-client.js";
// Initialize environment variables
dotenv.config();
// Create Express app
const app = express();
app.use(cors());
app.use(express.json());
// Initialize clients
const groqClient = new GroqClient(process.env.GROQ_API_KEY || "");
// Store clients
let calendarClient = null;
let gmailClient = null;
let refreshToken = null;
// Function to initialise or update the clients with the new token
const initialiseClients = async (token) => {
    if (!calendarClient || refreshToken !== token) {
        refreshToken = token;
        calendarClient = new CalendarClient(refreshToken);
        gmailClient = new GmailClient();
    }
    try {
        await calendarClient.connect();
        await gmailClient?.connect();
        console.log("Connected to calendar and gmail clients with new token");
    }
    catch (error) {
        console.error("Error connecting to mcp servers", error);
        throw error;
    }
    return { calendarClient, gmailClient };
};
// Start server without calenderClient
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Waiting for google authentication...");
});
// Google OAuth callback route
app.get("/auth/google/callback", async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ error: "Authorization code is required" });
        }
        // Exchange the authorization code for tokens
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: "http://localhost:3000/auth/google/callback",
                grant_type: "authorization_code",
            }),
        });
        const tokens = await tokenResponse.json();
        console.log("Tokens: ", tokens);
        if (tokens.error) {
            console.error("Error getting tokens:", tokens.error);
            return res.status(400).json({ error: "Failed to get tokens" });
        }
        console.log("Refresh token:", tokens.refresh_token);
        //Initialize/update clients with the new token
        await initialiseClients(tokens.refresh_token);
        // Redirect back to the frontend
        res.redirect("http://localhost:5173");
    }
    catch (error) {
        console.error("Error in callback:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Calendar route: List events
app.get("/calendar/events", async (req, res) => {
    if (!calendarClient) {
        return res
            .status(401)
            .json({ error: "Please authenticate with Google first" });
    }
    try {
        const { timeMin, timeMax } = req.query;
        if (!timeMin || !timeMax) {
            return res
                .status(400)
                .json({ error: "timeMin and timeMax are required query parameters" });
        }
        const response = await calendarClient.listEvents({
            timeMin: timeMin,
            timeMax: timeMax,
            maxResults: 100,
        });
        const jsonText = response.content[0].text.substring(response.content[0].text.indexOf("["));
        const events = JSON.parse(jsonText);
        res.json(events);
    }
    catch (error) {
        console.error("Error fetching calendar events:", error);
        res.status(500).json({ error: "Failed to fetch calendar events" });
    }
});
// Helper function to get events using query
async function findEventsByQuery(query) {
    if (!calendarClient)
        throw new Error("Calendar client is not initialized");
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    console.log("inside findEventsByQuery", query);
    const response = await calendarClient.listEvents({
        timeMin: now.toISOString(),
        timeMax: thirtyDaysFromNow.toISOString(),
        maxResults: 100,
    });
    const events = JSON.parse(response.content[0].text.substring(response.content[0].text.indexOf("[")));
    console.log("events", events);
    // Search by title, description, or date
    return events.filter((event) => {
        const eventDate = new Date(event.start.dateTime);
        const searchLower = query.toLowerCase();
        console.log("searchLower", searchLower);
        console.log(event.summary.toLowerCase().includes(searchLower));
        return (searchLower.includes(event.summary.toLowerCase()) ||
            (event.description || "").toLowerCase().includes(searchLower) ||
            eventDate.toLocaleDateString().includes(query));
    });
}
// Chat endpoint
app.post("/chat", async (req, res) => {
    try {
        if (!calendarClient)
            throw new Error("Calendar client is not initialized");
        if (!gmailClient)
            throw new Error("Gmail client is not initialized");
        let { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }
        // Check if message indicates update for calendar
        if (message.toLowerCase().includes("update") ||
            message.toLowerCase().includes("modify") ||
            message.toLowerCase().includes("change") ||
            message.toLowerCase().includes("reschedule")) {
            message = `${message}. I confirm this update`;
        }
        // Create messages array with system message
        const messages = [
            {
                role: "system",
                content: "You are a helpful assistant that can manage calendar events and emails. You can create, read, update, and delete events, as well as send, read, search, and manage emails. You should also be able to answer general questions about calendar and email management without using any tools.",
            },
            {
                role: "user",
                content: message,
            },
        ];
        // Get response from Groq
        const groqResponse = await groqClient.chat(messages);
        const assistantMessage = groqResponse.choices[0].message;
        // Handle any tool calls
        if (assistantMessage.tool_calls) {
            const functionResults = [];
            // Execute all tool calls and collect results
            for (const toolCall of assistantMessage.tool_calls) {
                const functionName = toolCall.function.name;
                const args = JSON.parse(toolCall.function.arguments);
                let result;
                switch (functionName) {
                    // Calendar operations (unchanged)
                    case "create_event":
                        result = await calendarClient.createEvent(args);
                        break;
                    case "get_event":
                        result = await calendarClient.getEvent(args.eventId);
                        break;
                    case "update_event":
                        if (args.query) {
                            const events = await findEventsByQuery(args.query);
                            if (events.length === 0) {
                                result = {
                                    content: [
                                        { type: "text", text: "No matching events found." },
                                    ],
                                };
                            }
                            else {
                                const event = events[0];
                                args.eventId = event.id;
                                result = await calendarClient.updateEvent(args);
                            }
                        }
                        else {
                            result = await calendarClient.updateEvent(args);
                        }
                        break;
                    case "delete_event":
                        result = await calendarClient.deleteEvent(args.eventId);
                        break;
                    case "list_events":
                        result = await calendarClient.listEvents(args);
                        break;
                    // Gmail operations
                    case "send_email":
                        result = await gmailClient.sendEmail(args);
                        break;
                    case "read_email":
                        result = await gmailClient.readEmail(args.messageId);
                        break;
                    case "search_emails":
                        result = await gmailClient.searchEmails(args);
                        break;
                    case "modify_email":
                        result = await gmailClient.modifyEmail(args);
                        break;
                    case "delete_email":
                        result = await gmailClient.deleteEmail(args.messageId);
                        break;
                }
                functionResults.push({
                    name: functionName,
                    result: result?.content?.[0]?.text || "Operation completed successfully",
                    args,
                });
            }
            // Add function results to messages
            messages.push(assistantMessage);
            messages.push({
                role: "function",
                name: "function_results",
                content: JSON.stringify(functionResults),
            });
            // Get final response from Groq
            const finalResponse = await groqClient.chat(messages, false);
            return res.json({
                response: finalResponse.choices[0].message.content,
                function_results: functionResults,
            });
        }
        return res.json({
            response: assistantMessage.content,
            function_results: null,
        });
    }
    catch (error) {
        console.error("Error in chat endpoint:", error);
        return res.status(500).json({ error: error.message });
    }
});
app.get("/test", (req, res) => {
    return res.send("Hello from the test endpoint!");
});
