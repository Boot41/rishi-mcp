# MCP Calendar Integration Project

## Description

The MCP Calendar Integration project is designed to provide seamless integration with Google Calendar, allowing users to manage their calendar events efficiently. This project employs a multi-layered architecture with direct Google Calendar API integration as the primary method, while also providing a fallback to the MCP server and mock implementations as a last resort.

## Features

- User authentication via Google Sign-In
- Create, read, update, and delete calendar events
- List events within a specified time range
- Chat-based interface for user interaction
- Environment variable configuration for secure API access

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mcp-calendar-integration.git
   cd mcp-calendar-integration
   ```
2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables in a `.env` file:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REFRESH_TOKEN=your_refresh_token
   ```

## Usage

1. Make sure the tokens are set up in the env file.

2. Start the backend Express server:
   ```bash
   npm run backend
   ```
3. Start the frontend server:
   ```bash
   npm run frontend
   ```
4. Navigate to `http://localhost:5173` in your browser.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
