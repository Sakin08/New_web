import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import eventsApi from '../api/events.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import EventCard from '../components/EventCard.jsx';
import SearchFilter from '../components/SearchFilter.jsx';
import TrendingSection from '../components/TrendingSection.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import EventMap from '../components/EventMap.jsx';
import CalendarPopup from '../components/CalendarPopup.jsx';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [filterOptions, setFilterOptions] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState(null);
  const { user } = useAuth();
  const { socket, eventUpdates } = useSocket();

  useEffect(() => {
    loadEvents();
  }, []);

  // Join events room for real-time updates
  useEffect(() => {
    if (socket) {
      socket.emit('joinEvents');
      return () => socket.emit('leaveEvents');
    }
  }, [socket]);

  // Handle real-time event updates
  useEffect(() => {
    if (eventUpdates) {
      const { type, data } = eventUpdates;

      if (type === 'created') {
        // Add new event to the list
        setEvents(prev => [data, ...prev]);
        showNotification(`New event: ${data.title}`, 'success');
      } else if (type === 'interestUpdated') {
        // Update interest count for specific event
        setEvents(prev => prev.map(e =>
          e._id === data.eventId ? data.event : e
        ));
      }
    }
  }, [eventUpdates]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadEvents = async () => {
    try {
      const res = await eventsApi.getAll();
      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load events:', err);
      setLoading(false);
    }
  };

  const handleDateSelect = (dateEvents) => {
    setSelectedDateEvents(dateEvents);
    setShowCalendar(false);
    // Optionally scroll to events
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // If specific date is selected, show only those events
    if (selectedDateEvents) {
      filtered = selectedDateEvents;
    }

    // Search filter
    if (filterOptions.searchTerm) {
      const term = filterOptions.searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
      );
    }

    // Location filter
    if (filterOptions.location) {
      const loc = filterOptions.location.toLowerCase();
      filtered = filtered.filter(event =>
        event.location.toLowerCase().includes(loc)
      );
    }

    // Date range filter
    if (filterOptions.dateFrom) {
      const fromDate = new Date(filterOptions.dateFrom);
      filtered = filtered.filter(event => new Date(event.date) >= fromDate);
    }
    if (filterOptions.dateTo) {
      const toDate = new Date(filterOptions.dateTo);
      toDate.setHours(23, 59, 59);
      filtered = filtered.filter(event => new Date(event.date) <= toDate);
    }

    // Sort
    switch (filterOptions.sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.interested?.length || 0) - (a.interested?.length || 0));
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'date':
      default:
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return filtered;
  }, [events, filterOptions, selectedDateEvents]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Campus Events</h1>
              <p className="text-gray-600 mt-1">Stay updated with what's happening around campus</p>
            </div>
          </div>
          <SkeletonLoader count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Real-time Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-6 z-50 px-6 py-4 rounded-lg shadow-lg animate-slide-in-right ${notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
          } text-white font-medium flex items-center gap-3`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {notification.message}
        </div>
      )}

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Campus Events</h1>
            <p className="text-gray-600 mt-1">Stay updated with what's happening around campus</p>
            {selectedDateEvents && (
              <button
                onClick={() => setSelectedDateEvents(null)}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear date filter
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCalendar(true)}
              className="bg-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition shadow-md flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </button>
            {user && (
              <Link
                to="/events/create"
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
              >
                + Create Event
              </Link>
            )}
          </div>
        </div>

        <TrendingSection />

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <SearchFilter onFilterChange={setFilterOptions} type="events" />
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg font-medium transition ${viewMode === 'grid'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Grid
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg font-medium transition ${viewMode === 'map'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Map
            </button>
          </div>
        </div>

        {viewMode === 'map' ? (
          <EventMap
            events={filteredEvents}
            onEventClick={setSelectedEvent}
            selectedEvent={selectedEvent}
          />
        ) : filteredEvents.length === 0 && events.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
            <div className="text-6xl mb-3">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">Try adjusting your filters or search terms</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
            <div className="text-6xl mb-3">📅</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
            <p className="text-gray-600 max-w-md mx-auto">Once events are added, they will appear here. Stay tuned!</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredEvents.length} of {events.length} events
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map(event => (
                <EventCard
                  key={event._id}
                  event={event}
                  onUpdate={(updatedEvent) => {
                    if (updatedEvent) {
                      // Update existing event
                      setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e));
                    } else {
                      // Reload all events (for delete)
                      loadEvents();
                    }
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Calendar Popup */}
      <CalendarPopup
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        events={events}
        onDateSelect={handleDateSelect}
      />
    </div>
  );
};

export default Events;