import { useRef } from 'react';
import BookCard from '../BookCard/BookCard';
import './BookCarousel.css';

export default function BookCarousel({ title, subtitle, books = [], viewAllLink }) {
  const trackRef = useRef(null);

  const scroll = (direction) => {
    if (trackRef.current) {
      const scrollAmount = 280;
      trackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!books.length) return null;

  return (
    <section className="book-carousel section">
      <div className="container">
        <div className="carousel-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p className="carousel-subtitle">{subtitle}</p>}
          </div>
          <div className="carousel-controls">
            <button className="carousel-btn" onClick={() => scroll('left')} aria-label="Scroll left">
              ‹
            </button>
            <button className="carousel-btn" onClick={() => scroll('right')} aria-label="Scroll right">
              ›
            </button>
            {viewAllLink && (
              <a href={viewAllLink} className="btn btn-outline btn-sm view-all-link">
                View All →
              </a>
            )}
          </div>
        </div>

        <div className="carousel-track" ref={trackRef}>
          {books.map((book, i) => (
            <div key={book._id} className="carousel-item">
              <BookCard book={book} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
