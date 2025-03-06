import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:3000";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get the start and end of the current month
  const getMonthRange = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59
    );
    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  };

  // Fetch events for the current month
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    const { start, end } = getMonthRange(selectedDate);
    const token = localStorage.getItem("refreshToken");
    if (!token) {
      console.error("No refresh token found");
      setIsLoading(false);
      setError("No refresh token found");
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/calendar/events?timeMin=${start}&timeMax=${end}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken: token,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load calendar events");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedDate]);

  // Generate calendar grid
  const generateCalendarDays = () => {
    const daysInMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    ).getDate();

    const firstDayOfMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    ).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null); // Empty cells for days before the 1st
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const changeMonth = (increment) => {
    setSelectedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + increment, 1)
    );
  };

  const formatEventTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="slide-in space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-violet-400">Calendar</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            ←
          </button>
          <span className="text-xl font-semibold">
            {selectedDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-600/20 text-red-200 p-4 rounded-lg border border-red-500/20">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-4 border-2 p-4 rounded-2xl border-violet-400">
          {/* Week day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className={`text-center font-semibold p-2 ${
                day === "Sun" || day === "Sat"
                  ? "text-red-400"
                  : "text-violet-400"
              }`}
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {generateCalendarDays().map((day, idx) => (
            <div
              key={idx}
              className={`min-h-[100px] p-2 rounded-lg ${
                day
                  ? "bg-gray-800/50 hover:bg-gray-800 transition-colors"
                  : "bg-transparent"
              }`}
            >
              {day && (
                <>
                  <div className="text-right text-sm text-gray-400 mb-2">
                    {day}
                  </div>
                  <div className="space-y-1">
                    {events
                      .filter((event) => {
                        const eventDate = new Date(event.start.dateTime);
                        return (
                          eventDate.getDate() === day &&
                          eventDate.getMonth() === selectedDate.getMonth() &&
                          eventDate.getFullYear() === selectedDate.getFullYear()
                        );
                      })
                      .map((event, eventIdx) => (
                        <div
                          key={eventIdx}
                          className="bg-violet-600/80 hover:bg-violet-600 text-xs p-1 rounded truncate cursor-pointer transition-colors"
                          title={`${event.summary} (${formatEventTime(
                            event.start.dateTime
                          )} - ${formatEventTime(event.end.dateTime)})`}
                        >
                          {formatEventTime(event.start.dateTime)}{" "}
                          {event.summary}
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
