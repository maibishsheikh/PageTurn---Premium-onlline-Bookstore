import { useState, useEffect } from 'react';
import EventCard from '../../components/EventCard/EventCard';
import { PageLoader } from '../../components/Loading/LoadingSpinner';
import { eventService } from '../../services/endpoints';
import './EventsPage.css';

const eventTypes = [
  { value: '', label: 'All Events', icon: '📅' },
  { value: 'book_launch', label: 'Book Launches', icon: '🚀' },
  { value: 'author_meetup', label: 'Author Meetups', icon: '☕' },
  { value: 'book_signing', label: 'Book Signings', icon: '✍️' },
  { value: 'reading_session', label: 'Reading Sessions', icon: '📖' },
  { value: 'literary_festival', label: 'Festivals', icon: '🎪' },
  { value: 'workshop', label: 'Workshops', icon: '🎓' }
];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    eventService.getAll()
      .then(res => setEvents(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? events.filter(e => e.type === filter)
    : events;

  const upcoming = filtered.filter(e => new Date(e.date) > new Date());
  const past = filtered.filter(e => new Date(e.date) <= new Date());

  if (loading) return <PageLoader />;

  return (
    <div className="events-page">
      <div className="container">
        <div className="events-hero">
          <h1>📅 Literary Events</h1>
          <p>Join our community at book launches, signings, and more</p>
        </div>

        <div className="event-type-filter">
          {eventTypes.map(t => (
            <button
              key={t.value}
              className={`type-btn ${filter === t.value ? 'active' : ''}`}
              onClick={() => setFilter(t.value)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {upcoming.length > 0 && (
          <section className="events-section">
            <h2>Upcoming Events</h2>
            <div className="events-grid">
              {upcoming.map((event, i) => (
                <EventCard key={event._id} event={event} index={i} />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="events-section">
            <h2>Past Events</h2>
            <div className="events-grid past">
              {past.map((event, i) => (
                <EventCard key={event._id} event={event} index={i} />
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="no-events">
            <span style={{ fontSize: '4rem' }}>🎭</span>
            <h3>No events found</h3>
            <p>Check back soon for upcoming literary events!</p>
          </div>
        )}
      </div>
    </div>
  );
}
