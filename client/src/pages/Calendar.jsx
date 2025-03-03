import { useState, useEffect } from 'react'

export default function Calendar() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Get the start and end of the current month
  const getMonthRange = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1)
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    return {
      start: start.toISOString(),
      end: end.toISOString()
    }
  }

  // Fetch events for the current month
  const fetchEvents = async () => {
    setIsLoading(true)
    setError(null)
    const { start, end } = getMonthRange(selectedDate)

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `List all events between ${start} and ${end}` 
        })
      })
      const data = await response.json()
      
      if (data.function_results?.[0]?.result?.content?.[0]?.text) {
        const eventsData = JSON.parse(data.function_results[0].result.content[0].text)
        setEvents(eventsData)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setError('Failed to load calendar events')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [selectedDate])

  // Generate calendar grid
  const generateCalendarDays = () => {
    const daysInMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    ).getDate()
    
    const firstDayOfMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    ).getDay()

    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null) // Empty cells for days before the 1st
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const changeMonth = (increment) => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + increment, 1))
  }

  const formatEventTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
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
        <div className="bg-red-600 text-white p-4 rounded-lg">{error}</div>
      ) : (
        <div className="grid grid-cols-7 gap-4">
          {/* Week day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-violet-400 p-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {generateCalendarDays().map((day, idx) => (
            <div
              key={idx}
              className={`min-h-[100px] p-2 rounded-lg ${
                day ? 'bg-gray-800' : 'bg-transparent'
              }`}
            >
              {day && (
                <>
                  <div className="text-right text-sm text-gray-400 mb-2">{day}</div>
                  <div className="space-y-1">
                    {events
                      .filter(event => {
                        const eventDate = new Date(event.start.dateTime)
                        return (
                          eventDate.getDate() === day &&
                          eventDate.getMonth() === selectedDate.getMonth() &&
                          eventDate.getFullYear() === selectedDate.getFullYear()
                        )
                      })
                      .map((event, eventIdx) => (
                        <div
                          key={eventIdx}
                          className="bg-violet-600 text-xs p-1 rounded truncate"
                          title={`${event.summary} (${formatEventTime(event.start.dateTime)} - ${formatEventTime(event.end.dateTime)})`}
                        >
                          {formatEventTime(event.start.dateTime)} {event.summary}
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
  )
}
