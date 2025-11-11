import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import eventsApi from '../api/events.js';
import { useAuth } from '../context/AuthContext.jsx';
import EventCard from '../components/EventCard.jsx';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Campus Events</h1>
            <p className="text-gray-600 mt-1">Stay updated with what's happening around campus</p>
          </div>
          {user && (
            <Link
              to="/events/create"
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
            >
              + Create Event
            </Link>
          )}
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
            <div className="text-6xl mb-3">📅</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
            <p className="text-gray-600 max-w-md mx-auto">Once events are added, they will appear here. Stay tuned!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map(event => (
              <EventCard
                key={event._id}
                event={event}
                onUpdate={(updatedEvent) => {
                  setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e));
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;