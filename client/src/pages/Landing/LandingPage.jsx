import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../../components/HeroSection/HeroSection';
import BookCarousel from '../../components/BookCarousel/BookCarousel';
import GenreSection from '../../components/GenreSection/GenreSection';
import EventCard from '../../components/EventCard/EventCard';
import { PageLoader } from '../../components/Loading/LoadingSpinner';
import { bookService, eventService } from '../../services/endpoints';
import './LandingPage.css';

export default function LandingPage() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [feat, trend, best, newR, up, ev] = await Promise.all([
          bookService.getFeatured().catch(() => ({ data: { data: [] } })),
          bookService.getTrending().catch(() => ({ data: { data: [] } })),
          bookService.getBestsellers().catch(() => ({ data: { data: [] } })),
          bookService.getNewReleases().catch(() => ({ data: { data: [] } })),
          bookService.getUpcoming().catch(() => ({ data: { data: [] } })),
          eventService.getAll().catch(() => ({ data: { data: [] } }))
        ]);
        setFeatured(feat.data.data);
        setTrending(trend.data.data);
        setBestsellers(best.data.data);
        setNewReleases(newR.data.data);
        setUpcoming(up.data.data);
        setEvents(ev.data.data?.slice(0, 3) || []);
      } catch (err) {
        console.error('Failed to fetch landing data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="landing-page">
      <HeroSection />

      {featured.length > 0 && (
        <BookCarousel
          title="Editor's Picks"
          subtitle="Hand-curated selections from our literary experts"
          books={featured}
          viewAllLink="/books?featured=true"
        />
      )}

      {trending.length > 0 && (
        <BookCarousel
          title="Trending Now 🔥"
          subtitle="What everyone's reading this week"
          books={trending}
          viewAllLink="/books?sort=trending"
        />
      )}

      <GenreSection />

      {bestsellers.length > 0 && (
        <BookCarousel
          title="Bestsellers"
          subtitle="All-time favorites that topped every chart"
          books={bestsellers}
          viewAllLink="/books?bestseller=true"
        />
      )}

      {newReleases.length > 0 && (
        <BookCarousel
          title="Fresh Off the Press ✨"
          subtitle="Newly released titles you'll love"
          books={newReleases}
          viewAllLink="/books?sort=newest"
        />
      )}

      {upcoming.length > 0 && (
        <section className="section upcoming-section">
          <div className="container">
            <div className="section-header">
              <h2>Coming Soon</h2>
              <p>Pre-order upcoming titles and be the first to read them</p>
            </div>
            <div className="upcoming-grid">
              {upcoming.slice(0, 4).map((book, idx) => (
                <Link to={`/books/${book._id}`} key={book._id} className="upcoming-card reveal" style={{ animationDelay: `${idx * 0.15}s` }}>
                  <div className="upcoming-cover">
                    <img src={book.coverImage} alt={book.title} />
                    <div className="upcoming-overlay">
                      <span className="upcoming-date">
                        📅 {new Date(book.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <h4>{book.title}</h4>
                  <p>{book.author}</p>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
              <Link to="/upcoming" className="btn btn-accent">View All Upcoming</Link>
            </div>
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section className="section events-preview-section">
          <div className="container">
            <div className="section-header">
              <h2>Upcoming Events</h2>
              <p>Join our community at exciting literary gatherings</p>
            </div>
            <div className="events-preview-grid">
              {events.map((event, idx) => (
                <EventCard key={event._id} event={event} index={idx} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
              <Link to="/events" className="btn btn-outline">See All Events</Link>
            </div>
          </div>
        </section>
      )}

      <section className="section newsletter-section">
        <div className="container">
          <div className="newsletter-box">
            <div className="newsletter-content">
              <h2>📬 Stay in the Loop</h2>
              <p>Get weekly book recommendations, exclusive deals, and event invites straight to your inbox.</p>
            </div>
            <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Your email address" className="newsletter-input" />
              <button type="submit" className="btn btn-accent">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
