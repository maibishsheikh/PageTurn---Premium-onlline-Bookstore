import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useAnimations';
import './HeroSection.css';

export default function HeroSection() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section className="hero" ref={ref}>
      <div className="hero-bg">
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
              fontSize: `${0.6 + Math.random() * 0.8}rem`,
              opacity: 0.1 + Math.random() * 0.15
            }}>
              {['📖', '📚', '✨', '📝', '🔖', '📕'][Math.floor(Math.random() * 6)]}
            </span>
          ))}
        </div>
      </div>

      <div className="hero-content container">
        <div className={`hero-text ${isVisible ? 'animate' : ''}`}>
          <span className="hero-label">Welcome to PageTurn</span>
          <h1 className="hero-title">
            Discover Your Next
            <span className="text-gradient"> Favorite Book</span>
          </h1>
          <p className="hero-subtitle">
            Explore thousands of titles across every genre. From timeless classics to
            trending new releases — your next literary adventure starts here.
          </p>
          <div className="hero-actions">
            <Link to="/books" className="btn btn-accent btn-lg">
              Browse Collection
            </Link>
            <Link to="/upcoming" className="btn btn-outline btn-lg">
              Coming Soon
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Books</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Authors</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Genres</span>
            </div>
          </div>
        </div>

        <div className={`hero-visual ${isVisible ? 'animate' : ''}`}>
          <div className="hero-book-stack">
            <div className="hero-book book-1">
              <img src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg" alt="Featured book" />
            </div>
            <div className="hero-book book-2">
              <img src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg" alt="Featured book" />
            </div>
            <div className="hero-book book-3">
              <img src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg" alt="Featured book" />
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <span>Scroll to explore</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  );
}
