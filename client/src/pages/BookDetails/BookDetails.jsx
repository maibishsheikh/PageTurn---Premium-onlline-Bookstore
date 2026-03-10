import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/Loading/LoadingSpinner';
import BookCarousel from '../../components/BookCarousel/BookCarousel';
import { bookService, reviewService } from '../../services/endpoints';
import { useToast } from '../../hooks/useAnimations';
import './BookDetails.css';

export default function BookDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const showToast = useToast();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setActiveTab('description');
    setSelectedImage(0);
    setQuantity(1);

    Promise.all([
      bookService.getById(id),
      reviewService.getBookReviews(id)
    ]).then(([bookRes, reviewRes]) => {
      const b = bookRes.data.data;
      setBook(b);
      setReviews(reviewRes.data.reviews || reviewRes.data.data || []);

      if (b.genre) {
        bookService.getAll({ genre: b.genre, limit: 6 })
          .then(r => setRelatedBooks((r.data.data || []).filter(x => x._id !== id)))
          .catch(() => {});
      }
    }).catch(err => {
      console.error(err);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!book) return;
    for (let i = 0; i < quantity; i++) addToCart(book);
    showToast(`Added ${quantity}x "${book.title}" to cart!`, 'success');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { showToast('Please login to leave a review', 'error'); return; }
    setSubmitting(true);
    try {
      const res = await reviewService.create(id, reviewForm);
      setReviews(prev => [res.data.review || res.data.data, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      showToast('Review submitted!', 'success');
      const bookRes = await bookService.getById(id);
      setBook(bookRes.data.data);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!book) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}><h2>Book not found</h2><Link to="/books" className="btn btn-primary">Browse Books</Link></div>;

  const images = [book.coverImage, ...(book.images || [])].filter(Boolean);
  const isUpcoming = book.isUpcoming || new Date(book.releaseDate) > new Date();
  const discount = book.originalPrice > book.price
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : 0;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`star ${i < Math.round(rating) ? 'filled' : ''}`}>★</span>
    ));
  };

  return (
    <div className="book-details-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/books">Books</Link>
          <span>/</span>
          <span>{book.title}</span>
        </nav>

        <motion.div
          className="book-details-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Image Gallery */}
          <div className="book-gallery">
            <div className="main-image-wrapper">
              <img src={images[selectedImage]} alt={book.title} className="main-image" />
              {discount > 0 && <div className="discount-badge">-{discount}%</div>}
              {book.isBestSeller && <div className="bestseller-tag">Bestseller</div>}
            </div>
            {images.length > 1 && (
              <div className="thumbnail-row">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumbnail ${selectedImage === i ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="book-info">
            <div className="book-badges">
              {book.isTrending && <span className="badge badge-trending">🔥 Trending</span>}
              {book.isNewRelease && <span className="badge badge-new">✨ New Release</span>}
              {isUpcoming && <span className="badge badge-upcoming">📅 Coming Soon</span>}
            </div>

            <h1 className="book-title">{book.title}</h1>
            <p className="book-author">by <strong>{book.author}</strong></p>

            <div className="book-rating">
              <div className="stars">{renderStars(book.rating)}</div>
              <span className="rating-number">{book.rating?.toFixed(1)}</span>
              <span className="review-count">({book.reviewCount} reviews)</span>
            </div>

            <div className="book-price-section">
              <span className="current-price">${book.price?.toFixed(2)}</span>
              {book.originalPrice > book.price && (
                <span className="original-price">${book.originalPrice?.toFixed(2)}</span>
              )}
              {discount > 0 && <span className="save-badge">Save {discount}%</span>}
            </div>

            <p className="book-short-desc">{book.shortDescription || book.description?.substring(0, 200)}</p>

            <div className="book-meta-grid">
              <div className="meta-item"><span className="meta-label">Genre</span><span className="meta-value">{book.genre}</span></div>
              <div className="meta-item"><span className="meta-label">Pages</span><span className="meta-value">{book.pages}</span></div>
              <div className="meta-item"><span className="meta-label">Language</span><span className="meta-value">{book.language}</span></div>
              <div className="meta-item"><span className="meta-label">Publisher</span><span className="meta-value">{book.publisher}</span></div>
              {book.isbn && <div className="meta-item"><span className="meta-label">ISBN</span><span className="meta-value">{book.isbn}</span></div>}
            </div>

            {!isUpcoming && book.stock > 0 && (
              <div className="add-to-cart-section">
                <div className="quantity-control">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(book.stock, q + 1))}>+</button>
                </div>
                <button className="btn btn-primary btn-lg add-cart-btn" onClick={handleAddToCart}>
                  🛒 Add to Cart
                </button>
              </div>
            )}
            {isUpcoming && book.preOrderAvailable && (
              <button className="btn btn-accent btn-lg" onClick={handleAddToCart}>
                📅 Pre-Order Now
              </button>
            )}
            {!isUpcoming && book.stock === 0 && (
              <p className="out-of-stock">Currently out of stock</p>
            )}
            <p className="stock-info">
              {book.stock > 0 ? `✓ ${book.stock} in stock` : ''}
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="details-tabs">
          <div className="tab-nav">
            {['description', 'reviews'].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'description' ? 'Description' : `Reviews (${reviews.length})`}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="description-tab">
                <p>{book.description}</p>
                {book.tags?.length > 0 && (
                  <div className="book-tags">
                    {book.tags.map(tag => (
                      <Link to={`/books?search=${tag}`} key={tag} className="tag">#{tag}</Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="reviews-tab">
                {user && (
                  <form className="review-form" onSubmit={handleReviewSubmit}>
                    <h4>Write a Review</h4>
                    <div className="rating-input">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          className={`star-btn ${reviewForm.rating >= n ? 'active' : ''}`}
                          onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                        >★</button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Review title"
                      value={reviewForm.title}
                      onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                      required
                    />
                    <textarea
                      placeholder="Your thoughts on this book..."
                      rows={4}
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                      required
                    />
                    <button type="submit" disabled={submitting} className="btn btn-primary">
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}

                <div className="reviews-list">
                  {reviews.length === 0 ? (
                    <p className="no-reviews">No reviews yet. Be the first to review this book!</p>
                  ) : (
                    reviews.map(rev => (
                      <div key={rev._id} className="review-card">
                        <div className="review-header">
                          <div className="review-user">
                            <div className="user-avatar">{rev.user?.name?.charAt(0) || '?'}</div>
                            <div>
                              <strong>{rev.user?.name || 'Anonymous'}</strong>
                              <span className="review-date">
                                {new Date(rev.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="review-stars">{renderStars(rev.rating)}</div>
                        </div>
                        {rev.title && <h5 className="review-title">{rev.title}</h5>}
                        <p className="review-comment">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {relatedBooks.length > 0 && (
          <BookCarousel
            title="You May Also Like"
            subtitle="Similar books in this genre"
            books={relatedBooks}
            viewAllLink={`/books?genre=${book.genre}`}
          />
        )}
      </div>
    </div>
  );
}
