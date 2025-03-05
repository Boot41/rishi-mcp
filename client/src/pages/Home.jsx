import { useEffect, useRef } from "react";
import Demo from "../components/Demo";
import Stats from "../components/Stats";
import Footer from "../components/Footer";
import Features from "../components/Features";

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
        className="bg-white hover:bg-gray-100 text-black font-medium py-2 px-4 rounded-xl border border-gray-300 shadow-sm transition-colors duration-200 flex items-center gap-2"
        aria-label="Sign in with Google"
      >
        {/* Inline Google SVG - using the same colorful logo */}
        <svg
          width="18"
          height="29"
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
      <Features />

      {/* Demo Section */}
      <Demo />

      {/* Stats Section */}
      <Stats />

      {/* Footer */}
      <Footer />
    </div>
  );
}
