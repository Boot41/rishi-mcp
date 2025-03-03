import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import AIChat from "./pages/AIChat";
import Calendar from "./pages/Calendar";

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="relative w-8 h-8">
      <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-violet-500 rounded-lg transform rotate-45"></div>
      <div className="absolute inset-1 bg-gray-900 rounded-md transform rotate-45"></div>
      <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
        T
      </div>
    </div>
    <span className="text-2xl font-bold bg-gradient-to-r from-rose-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
      TimePilot
    </span>
  </div>
);

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname === "/" ? "home" : location.pathname.slice(1);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled
            ? "bg-gray-900/70 backdrop-blur-xl shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate("/")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPath === "home" ? "bg-violet-600" : "hover:bg-gray-800"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate("/calendar")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPath === "calendar"
                    ? "bg-violet-600"
                    : "hover:bg-gray-800"
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => navigate("/chat")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPath === "chat" ? "bg-violet-600" : "hover:bg-gray-800"
                }`}
              >
                AI Chat
              </button>
            </div>
            <button
              onClick={() => navigate("/chat")}
              className="md:hidden px-4 py-2 bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
            >
              Try Now
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-40">
        <div className="flex justify-around p-4">
          <button
            onClick={() => navigate("/")}
            className={`p-2 rounded-lg transition-colors ${
              currentPath === "home" ? "text-violet-400" : "text-gray-400"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </button>
          <button
            onClick={() => navigate("/calendar")}
            className={`p-2 rounded-lg transition-colors ${
              currentPath === "calendar" ? "text-violet-400" : "text-gray-400"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          </button>
          <button
            onClick={() => navigate("/chat")}
            className={`p-2 rounded-lg transition-colors ${
              currentPath === "chat" ? "text-violet-400" : "text-gray-400"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-['Inter']">
        <Navigation />
        
        {/* Main Content */}
        <main className="min-h-screen pt-20">
          <div className="max-w-7xl mx-auto p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/chat" element={<AIChat />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
