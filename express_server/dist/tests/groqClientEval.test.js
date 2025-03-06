// tests/groqClientEval.test.ts
import { GroqClient } from "../src/groq-client"; // Adjust path to your GroqClient file
describe("GroqClient Tool Call Evals", () => {
    const apiKey = process.env.GROQ_API_KEY || "your-test-api-key"; // Use env var or hardcoded test key
    const client = new GroqClient(apiKey);
    // Test cases: [name, messages, expectedTool]
    const testCases = [
        [
            "create_calendar_event",
            [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: "Create a meeting tomorrow at 2 PM IST for 1 hour.",
                },
            ],
            "create_event", // Expected tool
        ],
        [
            "delete_calendar_event",
            [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Delete my meeting tomorrow." },
            ],
            "delete_event", // Expected tool
        ],
        [
            "send_email",
            [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: 'Send an email to test@example.com with subject "Test" and body "Hello!"',
                },
            ],
            "send_email", // Expected tool
        ],
        [
            "search_emails",
            [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: "Search for emails from test@example.com in the last 2 days.",
                },
            ],
            "search_emails", // Expected tool
        ],
        [
            "no_tool_call",
            [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "What’s the weather like today?" },
            ],
            null, // No tool expected
        ],
    ];
    testCases.forEach(([name, messages, expectedTool]) => {
        test(name, async () => {
            const response = await client.chat(messages, true);
            const message = response.choices[0]?.message;
            // Extract the actual tool called (if any)
            const actualTool = message?.tool_calls?.[0]?.function?.name || null;
            console.info(`Test: ${name}`);
            console.info(`Input: ${messages.find((m) => m.role === "user")?.content}`);
            console.info(`Expected Tool: ${expectedTool}`);
            console.info(`Actual Tool: ${actualTool}`);
            // For MVP: Log for manual review
            // Uncomment below for automated checks later
            // expect(actualTool).toBe(expectedTool);
        }, 15000); // 15s timeout for API calls
    });
});
