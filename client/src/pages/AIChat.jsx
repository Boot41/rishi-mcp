import { useState } from 'react'

export default function AIChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    setMessages(prev => [...prev, { role: 'user', content: input }])
    setInput('')

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      const data = await response.json()
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        functionResults: data.function_results 
      }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: 'Sorry, there was an error processing your request.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

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
                msg.role === 'user' 
                  ? 'bg-violet-600 ml-12' 
                  : msg.role === 'error'
                  ? 'bg-red-600 mr-12'
                  : 'bg-gray-700 mr-12'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              {msg.functionResults && (
                <div className="mt-2 pt-2 border-t border-gray-600">
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(msg.functionResults, null, 2)}
                  </pre>
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
            className="w-full bg-gray-700 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
