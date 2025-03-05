import { useRef, useState } from "react";

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // helper function to format dates
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  // Initialize speech recognition
  const initSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported");
      return false;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsRecording(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    return true;
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    if (!recognitionRef.current && !initSpeechRecognition()) {
      return;
    }

    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          functionResults: data.function_results,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto slide-in">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-6">Chat with CalendarAI</h2>

        {/* Chat Messages */}
        <div className="chat-container space-y-4 mb-6 max-h-[60vh] overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg ${
                msg.role === "user"
                  ? "bg-violet-600 ml-12"
                  : msg.role === "error"
                  ? "bg-red-600 mr-12"
                  : "bg-gray-700 mr-12"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              {msg.functionResults && msg.role === "assistant" && (
                <div className="mt-2 pt-2 border-t border-gray-600">
                  {msg.functionResults.map((result, i) => {
                    if (result.name === "list_events") {
                      const events = JSON.parse(
                        result.result.substring(
                          result.result.indexOf("[")
                        )
                      );
                      return (
                        <div key={i} className="text-sm">
                          <p className="font-semibold mb-2">
                            Found {events.length} events:
                          </p>
                          {events.map((event) => (
                            <div
                              key={event.id}
                              className="mb-2 pl-2 border-l-2 border-violet-500"
                            >
                              <p className="font-medium">{event.summary}</p>
                              <p className="text-gray-400">
                                {formatDate(event.start.dateTime)} -{" "}
                                {formatDate(event.end.dateTime)}
                              </p>
                              {event.description && (
                                <p className="text-gray-400">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    } else if (result.name === "search_emails" || result.name === "read_email") {
                      // Extract email information using regex
                      const emailPattern = /ID:\s+[^\n]+\nSubject:\s+(.*?)\nFrom:\s+(.*?)\nDate:\s+(.*?)(?=\n\n|$)/gs;
                      const emails = [];
                      let match;
                      let content = result.result;
                      
                      console.log("Content to parse:", content); // Debug log
                      
                      while ((match = emailPattern.exec(content)) !== null) {
                        console.log("Found match:", match); // Debug log
                        try {
                          const date = new Date(match[3].trim());
                          emails.push({
                            subject: match[1].trim(),
                            from: match[2].trim(),
                            date: date.toLocaleString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                              timeZoneName: 'short'
                            })
                          });
                        } catch (error) {
                          console.error("Error parsing email:", error);
                        }
                      }

                      console.log("Parsed emails:", emails); // Debug log

                      if (emails.length === 0) {
                        return (
                          <div key={i} className="text-sm text-red-400">
                            No emails could be parsed. Please check the format.
                          </div>
                        );
                      }

                      return (
                        <div key={i} className="text-sm space-y-2">
                          <p className="font-semibold mb-2">
                            Found {emails.length} emails:
                          </p>
                          <div className="grid gap-2">
                            {emails.map((email, index) => (
                              <div
                                key={index}
                                className="p-3 rounded-lg bg-gray-800/50 border-l-4 border-blue-500"
                              >
                                <p className="font-medium text-blue-300 mb-1">{email.subject}</p>
                                <div className="flex flex-col space-y-1">
                                  <p className="text-gray-300 text-sm">
                                    <span className="text-gray-500">From:</span> {email.from}
                                  </p>
                                  <p className="text-gray-400 text-sm">
                                    <span className="text-gray-500">Date:</span> {email.date}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    // Don't show raw results for other function calls
                    return null;
                  })}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500"></div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-gray-700 text-white rounded-lg pl-4 pr-24 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2 rounded-lg ${
                isRecording
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-600 hover:bg-gray-700"
              } transition-colors`}
              disabled={isLoading}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
