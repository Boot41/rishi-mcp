# MCP Calendar and Gmail Integration Project

## Description

The MCP Calendar and Gmail Integration project is designed to provide seamless integration with the MCP server for calendar management and email operations, allowing users to manage their calendar events and send emails efficiently through a natural language interface. The project follows a multi-layered architecture with MCP server as the primary method for calendar operations, with mock implementations available as a fallback for testing and development.

## Features

- Natural language processing for calendar management
- Create, read, update, and delete calendar events through MCP
- List events within a specified time range
- Automatic update confirmation for event modifications
- Email integration through Gmail MCP
- Send emails with natural language commands
- Support for multiple recipients, CC, and BCC
- Chat-based interface with AI-powered responses
- Modern, responsive UI with animations
- Environment variable configuration for secure API access
- Seamless MCP server integration
- Intelligent conflict resolution
- Real-time event updates

## Technical Stack

### Frontend

- React with Vite
- Tailwind CSS for styling
- Modern component architecture
- Responsive design with animations

### Backend

- Express.js server
- TypeScript for type safety
- Gmail MCP integration for email operations
- Groq API integration for natural language processing
- MCP server integration for calendar operations
- Environment-based configuration

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/mcp-calendar-integration.git
   cd mcp-calendar-integration
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   # Install backend dependencies
   cd express_server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables in `.env` files:

   Backend (.env):

   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GROQ_API_KEY=your_groq_api_key
   ```

## Usage

1. Start the backend Express server:

   ```bash
   cd express_server
   npm run build && npm run start
   ```

2. Start the frontend development server:

   ```bash
   cd client
   npm run dev
   ```

3. Navigate to `http://localhost:5173` in your browser

4. Login using your google account

## Application Flow

1. **User Input**: Users can interact with the calendar and email using natural language commands:

   - Create events: "Schedule a meeting with John tomorrow at 2 PM"
   - Update events: "Change my meeting with John to 3 PM"
   - Delete events: "Cancel my meeting with John tomorrow"
   - List events: "Show me my meetings for next week"
   - Send emails: "Send an email to john@example.com about the meeting tomorrow"
   - Complex email commands: "Email John and Sarah, CC the team about project updates"

2. **Natural Language Processing**:

   - The application uses Groq API to understand user intent
   - Automatically adds confirmation for update requests
   - Converts natural language to structured calendar and email operations

3. **Calendar and Email Operations**:

   - Integration with MCP server for all calendar operations
   - Gmail API integration for email functionality
   - Automatic conflict detection through MCP
   - Real-time updates and synchronization
   - Support for rich email features (CC, BCC, multiple recipients)

4. **Response Handling**:
   - AI-generated human-friendly responses
   - Clear feedback on operation success/failure
   - Contextual suggestions and confirmations

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
