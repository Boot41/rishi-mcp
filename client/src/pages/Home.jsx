import { useEffect, useRef } from "react";

const FeatureIcon = ({ icon }) => (
  <div className="w-12 h-12 flex items-center justify-center text-violet-400 mb-4">
    {icon}
  </div>
);

const LoginButton = () => {
  console.log("LoginButton rendered"); // Debug render

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent any default behavior
    console.log("Button clicked");

    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      console.log("Client ID:", clientId); // Debug client ID

      const redirectUri = "http://localhost:3000/auth/google/callback"; // Updated to Express server port
      const scope = "https://www.googleapis.com/auth/calendar";
      const responseType = "code";
      const accessType = "offline"; // Request offline access

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=${accessType}`;
      console.log("Auth URL:", authUrl);

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error in handleLogin:", error);
    }
  };

  // Move the button outside of any other container that might affect it
  return (
    <div className="relative z-50">
      <button
        onClick={handleLogin}
        type="button"
        className="bg-white hover:bg-gray-100 text-black font-medium py-2 px-4 rounded border border-gray-300 shadow-sm transition-colors duration-200 flex items-center gap-2"
        aria-label="Sign in with Google"
      >
        {/* Inline Google SVG - using the same colorful logo */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.85 15.71 17.66V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
            fill="#4285F4"
          />
          <path
            d="M12 23C15.45 23 18.34 21.76 19.28 20.34L15.71 17.66C14.77 18.34 13.58 18.74 12 18.74C8.66 18.74 5.9 16.58 4.85 13.58H1.18V16.33C2.11 18.61 4.05 20.52 6.45 21.73C8.85 22.94 10.38 23 12 23Z"
            fill="#34A853"
          />
          <path
            d="M4.85 13.58C4.63 12.91 4.5 12.2 4.5 11.47C4.5 10.74 4.63 10.03 4.85 9.36V6.61H1.18C0.43 8.03 0 9.68 0 11.47C0 13.26 0.43 14.91 1.18 16.33L4.85 13.58Z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.26C13.71 5.26 15.27 5.87 16.47 7L19.64 3.83C18.34 2.49 15.45 1 12 1C8.85 1 6.45 2.06 4.05 3.27L7.72 6.02C8.9 4.94 10.38 5.26 12 5.26Z"
            fill="#EA4335"
          />
        </svg>
        <span>Sign in with Google</span>
      </button>
    </div>
  );
};

export default function Home() {
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="slide-in">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center text-center mb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-rose-500/20 via-violet-500/20 to-cyan-500/20 rounded-3xl animate-gradient"></div>
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-title">
          TimePilot
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-4 animate-fade-in">
          Your intelligent calendar assistant that understands natural language
        </p>
        <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto mb-8 animate-fade-in mt-8">
          Just chat with TimePilot like you would with a human assistant - it
          handles scheduling, conflicts, and calendar management automatically
        </p>
        <div className="flex gap-4 animate-fade-in-up">
          <button className="px-8 py-3 bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
            Explore Features
          </button>
          <LoginButton />
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gray-800">
              <div className="text-4xl font-bold text-violet-400 mb-2">
                100K+
              </div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-800">
              <div className="text-4xl font-bold text-violet-400 mb-2">1M+</div>
              <div className="text-gray-300">Events Managed</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-800">
              <div className="text-4xl font-bold text-violet-400 mb-2">
                99.9%
              </div>
              <div className="text-gray-300">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <h2 className="text-4xl font-bold text-center mb-16 animate-on-scroll">
          Powerful Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Natural Language Input",
              description:
                "Schedule meetings as easily as chatting with a friend. Just describe what you want in plain English.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  />
                </svg>
              ),
            },
            {
              title: "Smart Scheduling",
              description:
                "AI automatically finds the best time slots based on your availability and preferences.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008H16.5V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H18.75v-.008zm0 2.25h.008v.008H18.75V15zm0 2.25h.008v.008h-.008v-.008z"
                  />
                </svg>
              ),
            },
            {
              title: "Calendar Integration",
              description:
                "Seamlessly works with your existing Google Calendar setup.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                  />
                </svg>
              ),
            },
            {
              title: "Conflict Resolution",
              description:
                "Automatically detects and helps resolve scheduling conflicts.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              ),
            },
            {
              title: "Meeting Analytics",
              description:
                "Get insights about your meeting patterns and time management.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                  />
                </svg>
              ),
            },
            {
              title: "Voice Commands",
              description:
                "Hands-free calendar management with voice recognition (coming soon).",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
              ),
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-gray-800 animate-on-scroll"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <FeatureIcon icon={feature.icon} />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <h2 className="text-4xl font-bold text-center mb-16 animate-on-scroll">
          See It In Action
        </h2>
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl overflow-hidden shadow-2xl animate-on-scroll">
          <div className="p-6 space-y-4">
            <div className="flex gap-4 items-center text-gray-400 border-b border-gray-700 pb-4">
              <span className="text-violet-400">→</span>
              "Schedule a meeting with John tomorrow at 2 PM for 1 hour"
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-violet-400">🤖</span>
              <div className="space-y-2">
                <p>I'll help you schedule that meeting.</p>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="font-semibold">New Meeting</p>
                  <p>With: John</p>
                  <p>Date: Tomorrow, 2:00 PM - 3:00 PM</p>
                  <button className="mt-2 px-4 py-1 bg-violet-600 rounded hover:bg-violet-700 transition-colors">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="grid md:grid-cols-3 gap-8 text-center animate-on-scroll">
          <div className="p-6">
            <div className="text-4xl font-bold text-violet-400 mb-2">500+</div>
            <div className="text-gray-300">Active Users</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-violet-400 mb-2">
              10,000+
            </div>
            <div className="text-gray-300">Meetings Scheduled</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-violet-400 mb-2">98%</div>
            <div className="text-gray-300">User Satisfaction</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">TimePilot</h3>
              <p className="text-gray-400">
                Making calendar management smarter and more efficient.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Natural Language</li>
                <li>Smart Scheduling</li>
                <li>Calendar Integration</li>
                <li>Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Support</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>GitHub</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p> {new Date().getFullYear()} TimePilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
