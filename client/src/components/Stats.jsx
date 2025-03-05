const Stats = () => {
  return (
    <section className="py-20">
      <div className="grid md:grid-cols-3 gap-8 text-center animate-on-scroll">
        <div className="p-6">
          <div className="text-4xl font-bold text-violet-400 mb-2">500+</div>
          <div className="text-gray-300">Active Users</div>
        </div>
        <div className="p-6">
          <div className="text-4xl font-bold text-violet-400 mb-2">10,000+</div>
          <div className="text-gray-300">Meetings Scheduled</div>
        </div>
        <div className="p-6">
          <div className="text-4xl font-bold text-violet-400 mb-2">98%</div>
          <div className="text-gray-300">User Satisfaction</div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
