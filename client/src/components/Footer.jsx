const Footer = () => {
  return (
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
  );
};

export default Footer;
