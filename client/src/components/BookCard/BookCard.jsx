import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useScrollReveal } from '../../hooks/useAnimations';
import './BookCard.css';

export default function BookCard({ book, index = 0 }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { addToCart } = useCart();
  const [ref, isVisible] = useScrollReveal();

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < full) stars.push(<span key={i} className="star-filled">★</span>);
      else if (i === full && hasHalf) stars.push(<span key={i} className="star-half">★</span>);
      else stars.push(<span key={i} className="star-empty">☆</span>);
    }
    return stars;
  };

  const getBadge = () => {
    if (book.isUpcoming) return <span className="badge badge-upcoming">Coming Soon</span>;
    if (book.isNewRelease) return <span className="badge badge-new">New</span>;
    if (book.isTrending) return <span className="badge badge-trending">Trending</span>;
    if (book.isBestSeller) return <span className="badge badge-bestseller">Bestseller</span>;
    if (book.isFeatured) return <span className="badge badge-featured">Featured</span>;
    return null;
  };

  const discount = book.originalPrice
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : 0;

  return (
    <div
      ref={ref}
      className={`book-card ${isVisible ? 'revealed' : ''} ${isFlipped ? 'flipped' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="book-card-inner">
        {/* Front */}
        <div className="book-card-front">
          <div className="book-cover-wrapper">
            {!imgLoaded && <div className="skeleton skeleton-image" />}
            <img
              src={book.coverImage}
              alt={book.title}
              className={`book-cover ${imgLoaded ? 'loaded' : ''}`}
              onLoad={() => setImgLoaded(true)}
              loading="lazy"
            />
            <div className="book-cover-overlay">
              <Link to={`/books/${book._id}`} className="btn btn-accent btn-sm">View Details</Link>
              <button
                className="flip-btn"
                onClick={(e) => { e.preventDefault(); setIsFlipped(true); }}
                title="Show summary"
              >
                ↻
              </button>
            </div>
            {getBadge() && <div className="book-badge">{getBadge()}</div>}
            {discount > 0 && <div className="discount-tag">-{discount}%</div>}
          </div>

          <div className="book-info">
            <Link to={`/books/${book._id}`} className="book-title-link">
              <h4 className="book-title">{book.title}</h4>
            </Link>
            <p className="book-author">by {book.author}</p>
            <div className="book-meta">
              <div className="book-rating">
                <div className="stars">{renderStars(book.rating)}</div>
                <span className="review-count">({book.reviewCount})</span>
              </div>
              <div className="book-price">
                <span className="current-price">${book.price?.toFixed(2)}</span>
                {book.originalPrice && (
                  <span className="original-price">${book.originalPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
            {!book.isUpcoming ? (
              <button
                className="btn btn-primary btn-sm add-cart-btn"
                onClick={() => addToCart(book)}
                disabled={book.stock === 0}
              >
                {book.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
              </button>
            ) : (
              <button
                className="btn btn-outline btn-sm add-cart-btn"
                onClick={() => addToCart(book)}
              >
                Pre-Order
              </button>
            )}
          </div>
        </div>

        {/* Back */}
        <div className="book-card-back">
          <button
            className="flip-back-btn"
            onClick={() => setIsFlipped(false)}
          >
            ✕
          </button>
          <h4 className="back-title">{book.title}</h4>
          <p className="back-author">by {book.author}</p>
          <p className="back-genre">{book.genre}</p>
          <p className="back-description">
            {book.shortDescription || book.description?.substring(0, 200) + '...'}
          </p>
          {book.pages && <p className="back-pages">📖 {book.pages} pages</p>}
          <Link to={`/books/${book._id}`} className="btn btn-accent btn-sm">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}
