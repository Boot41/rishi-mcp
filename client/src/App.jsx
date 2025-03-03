import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import AIChat from './pages/AIChat'
import Calendar from './pages/Calendar'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState('home')

  return (
    <div className="min-h-screen bg-gray-900 text-white font-['Poppins']">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-800 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-violet-400">TimePilot</h1>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-150 ease-in-out bg-gray-800 w-64 z-40 pt-20`}>
        <div className="p-6 space-y-4">
          <button 
            onClick={() => setActivePage('home')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activePage === 'home' ? 'bg-violet-600' : 'hover:bg-gray-700'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setActivePage('calendar')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activePage === 'calendar' ? 'bg-violet-600' : 'hover:bg-gray-700'}`}
          >
            Calendar
          </button>
          <button 
            onClick={() => setActivePage('chat')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activePage === 'chat' ? 'bg-violet-600' : 'hover:bg-gray-700'}`}
          >
            AI Chat
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:ml-64 pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          {activePage === 'home' && <Home />}
          {activePage === 'calendar' && <Calendar />}
          {activePage === 'chat' && <AIChat />}
        </div>
      </main>
    </div>
  )
}

export default App
