const Demo = () => {
  return (
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
  );
};

export default Demo;
