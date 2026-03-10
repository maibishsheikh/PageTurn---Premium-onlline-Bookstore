import { Link } from 'react-router-dom';
import { useCountdown, useScrollReveal } from '../../hooks/useAnimations';
import './EventCard.css';

const typeIcons = {
  book_launch: '🚀',
  author_meetup: '☕',
  book_signing: '✍️',
  reading_session: '📖',
  literary_festival: '🎪',
  workshop: '🎓'
};

const typeLabels = {
  book_launch: 'Book Launch',
  author_meetup: 'Author Meetup',
  book_signing: 'Book Signing',
  reading_session: 'Reading Session',
  literary_festival: 'Literary Festival',
  workshop: 'Workshop'
};

export default function EventCard({ event, index = 0 }) {
  const [ref, isVisible] = useScrollReveal();
  const countdown = useCountdown(event.date);
  const isUpcoming = new Date(event.date) > new Date();

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      ref={ref}
      className={`event-card ${isVisible ? 'revealed' : ''} ${event.isFeatured ? 'featured' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="event-card-image">
        {event.image && <img src={event.image} alt={event.title} loading="lazy" />}
        <div className="event-type-badge">
          <span>{typeIcons[event.type] || '📅'}</span>
          <span>{typeLabels[event.type] || event.type}</span>
        </div>
        {event.location?.isOnline && (
          <div className="online-badge">🌐 Online</div>
        )}
      </div>

      <div className="event-card-body">
        <h3 className="event-title">{event.title}</h3>
        {event.author && (
          <p className="event-author">Featuring: <strong>{event.author}</strong></p>
        )}
        <p className="event-description">
          {event.description?.substring(0, 120)}...
        </p>

        <div className="event-details">
          <div className="event-detail">
            <span className="detail-icon">📅</span>
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="event-detail">
            <span className="detail-icon">🕐</span>
            <span>{formatTime(event.date)}</span>
          </div>
          <div className="event-detail">
            <span className="detail-icon">📍</span>
            <span>
              {event.location?.isOnline
                ? 'Virtual Event'
                : `${event.location?.venue}, ${event.location?.city}`}
            </span>
          </div>
        </div>

        {isUpcoming && (
          <div className="event-countdown">
            <div className="countdown-item">
              <span className="countdown-value">{countdown.days}</span>
              <span className="countdown-label">Days</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-value">{countdown.hours}</span>
              <span className="countdown-label">Hrs</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-value">{countdown.minutes}</span>
              <span className="countdown-label">Min</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-value">{countdown.seconds}</span>
              <span className="countdown-label">Sec</span>
            </div>
          </div>
        )}

        <div className="event-footer">
          {event.maxAttendees && (
            <span className="attendees-info">
              👥 {event.attendees || 0}/{event.maxAttendees} spots
            </span>
          )}
          <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
