import { useEffect, useState } from 'react';
import eventsApi from '../api/events.js';
import { useAuth } from '../context/AuthContext.jsx';
import CreateEventModal from '../components/CreateEventModal.jsx';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadEvents();
  }, []);

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

  const handleCreateEvent = async (eventData) => {
    try {
      const res = await eventsApi.create(eventData);
      setEvents([res.data, ...events]);
    } catch (err) {
      throw err;
    }
  };

  const getEventStatus = (eventDate) => {
    const now = new Date();
    const date = new Date(eventDate);
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Past Event', color: 'bg-gray-100 text-gray-600' };
    if (diffDays === 0) return { text: 'Today!', color: 'bg-green-100 text-green-700' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'bg-blue-100 text-blue-700' };
    if (diffDays <= 7) return { text: `In ${diffDays} days`, color: 'bg-yellow-100 text-yellow-700' };
    return { text: `In ${diffDays} days`, color: 'bg-purple-100 text-purple-700' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Campus Events</h1>
            <p className="text-gray-600 mt-2">Stay updated with what's happening at SUST</p>
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg"
            >
              + Create Event
            </button>
          )}
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">📅</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Yet</h3>
            <p className="text-gray-600">Check back later for upcoming campus events</p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map(event => {
              const status = getEventStatus(event.date);
              return (
                <div key={event._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="md:flex">
                    <div className="md:w-48 bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex flex-col items-center justify-center text-white">
                      <div className="text-5xl font-bold">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xl font-semibold mt-2">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-sm opacity-90">
                        {new Date(event.date).getFullYear()}
                      </div>
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                          {status.text}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-3">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{event.description}</p>
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(event.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showCreateModal && (
          <CreateEventModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateEvent}
          />
        )}
      </div>
    </div>
  );
};

export default Events;