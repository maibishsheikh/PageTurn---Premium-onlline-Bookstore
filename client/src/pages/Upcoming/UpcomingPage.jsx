import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCountdown } from '../../hooks/useAnimations';
import { PageLoader } from '../../components/Loading/LoadingSpinner';
import { bookService } from '../../services/endpoints';
import './UpcomingPage.css';

function CountdownTimer({ date }) {
  const countdown = useCountdown(date);
  return (
    <div className="upcoming-countdown">
      <div className="cd-item"><span className="cd-val">{countdown.days}</span><span className="cd-lbl">Days</span></div>
      <div className="cd-item"><span className="cd-val">{countdown.hours}</span><span className="cd-lbl">Hours</span></div>
      <div className="cd-item"><span className="cd-val">{countdown.minutes}</span><span className="cd-lbl">Min</span></div>
      <div className="cd-item"><span className="cd-val">{countdown.seconds}</span><span className="cd-lbl">Sec</span></div>
    </div>
  );
}

export default function UpcomingPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookService.getUpcoming()
      .then(res => setBooks(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="upcoming-page">
      <div className="container">
        <div className="upcoming-hero">
          <h1>📅 Coming Soon</h1>
          <p>Be the first to get your hands on the most anticipated releases</p>
        </div>

        {books.length === 0 ? (
          <div className="no-upcoming">
            <span style={{ fontSize: '4rem' }}>📚</span>
            <h3>No upcoming releases right now</h3>
            <p>Check back soon for exciting new titles!</p>
          </div>
        ) : (
          <div className="upcoming-list">
            {books.map((book, idx) => (
              <motion.div
                key={book._id}
                className="upcoming-item"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="upcoming-item-cover">
                  <img src={book.coverImage} alt={book.title} />
                </div>
                <div className="upcoming-item-info">
                  <span className="release-label">
                    Releases {new Date(book.releaseDate).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                  <h2>{book.title}</h2>
                  <p className="upcoming-author">by {book.author}</p>
                  <p className="upcoming-genre">{book.genre}</p>
                  <p className="upcoming-desc">{book.description?.substring(0, 250)}...</p>
                  <CountdownTimer date={book.releaseDate} />
                  <div className="upcoming-actions">
                    <span className="upcoming-price">${book.price?.toFixed(2)}</span>
                    {book.preOrderAvailable && (
                      <Link to={`/books/${book._id}`} className="btn btn-accent">
                        Pre-Order Now
                      </Link>
                    )}
                    <Link to={`/books/${book._id}`} className="btn btn-outline">
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
