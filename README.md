# MCP Calendar Integration Project

## Description

The MCP Calendar Integration project is designed to provide seamless integration with the MCP server for calendar management, allowing users to manage their calendar events efficiently through a natural language interface. The project follows a multi-layered architecture with MCP server as the primary method for calendar operations, with mock implementations available as a fallback for testing and development.

## Features

- Natural language processing for calendar management
- Create, read, update, and delete calendar events through MCP
- List events within a specified time range
- Automatic update confirmation for event modifications
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

1. **User Input**: Users can interact with the calendar using natural language commands:

   - Create events: "Schedule a meeting with John tomorrow at 2 PM"
   - Update events: "Change my meeting with John to 3 PM"
   - Delete events: "Cancel my meeting with John tomorrow"
   - List events: "Show me my meetings for next week"

2. **Natural Language Processing**:

   - The application uses Groq API to understand user intent
   - Automatically adds confirmation for update requests
   - Converts natural language to structured calendar operations

3. **Calendar Operations**:

   - Integration with MCP server for all calendar operations
   - Automatic conflict detection through MCP
   - Real-time updates and synchronization

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
