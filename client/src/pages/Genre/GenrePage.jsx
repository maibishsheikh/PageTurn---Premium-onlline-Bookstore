import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../../components/BookCard/BookCard';
import { BookGridSkeleton } from '../../components/Loading/LoadingSpinner';
import { bookService } from '../../services/endpoints';
import './GenrePage.css';

const genreIcons = {
  'Fiction': '📖', 'Science Fiction': '🚀', 'Fantasy': '🐉', 'Mystery': '🔍',
  'Romance': '💕', 'Thriller': '😱', 'Non-Fiction': '📰', 'Biography': '👤',
  'Self-Help': '🌱', 'History': '🏛️', 'Poetry': '🎭', 'Horror': '👻'
};

export default function GenrePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [genres, setGenres] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const activeGenre = searchParams.get('genre') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    bookService.getGenres()
      .then(res => setGenres(res.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (activeGenre) params.genre = activeGenre;
    bookService.getAll(params)
      .then(res => {
        setBooks(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeGenre, page]);

  const updateParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    if (key !== 'page') p.set('page', '1');
    setSearchParams(p);
  };

  return (
    <div className="genre-page">
      <div className="container">
        <div className="genre-header">
          <h1>{activeGenre || 'All Genres'}</h1>
          <p>Discover your next favorite read by genre</p>
        </div>

        <div className="genre-tabs">
          <button
            className={`genre-tab ${!activeGenre ? 'active' : ''}`}
            onClick={() => updateParam('genre', '')}
          >📚 All</button>
          {genres.map(g => (
            <button
              key={g}
              className={`genre-tab ${activeGenre === g ? 'active' : ''}`}
              onClick={() => updateParam('genre', g)}
            >
              {genreIcons[g] || '📖'} {g}
            </button>
          ))}
        </div>

        {loading ? (
          <BookGridSkeleton count={12} />
        ) : books.length === 0 ? (
          <div className="no-results">
            <span style={{ fontSize: '4rem' }}>📚</span>
            <h3>No books in this genre yet</h3>
          </div>
        ) : (
          <>
            <div className="book-grid">
              {books.map((book, i) => (
                <BookCard key={book._id} book={book} index={i} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={page <= 1}
                  onClick={() => updateParam('page', String(page - 1))}
                >← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                    onClick={() => updateParam('page', String(i + 1))}
                  >{i + 1}</button>
                ))}
                <button
                  className="page-btn"
                  disabled={page >= totalPages}
                  onClick={() => updateParam('page', String(page + 1))}
                >Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
