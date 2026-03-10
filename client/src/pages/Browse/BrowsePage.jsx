import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../../components/BookCard/BookCard';
import { BookGridSkeleton } from '../../components/Loading/LoadingSpinner';
import { bookService } from '../../services/endpoints';
import { useDebounce } from '../../hooks/useAnimations';
import './BrowsePage.css';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'title_az', label: 'Title: A-Z' },
  { value: 'title_za', label: 'Title: Z-A' }
];

const priceRanges = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under $10', min: '0', max: '10' },
  { label: '$10 - $20', min: '10', max: '20' },
  { label: '$20 - $30', min: '20', max: '30' },
  { label: 'Over $30', min: '30', max: '' }
];

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [mobileFilters, setMobileFilters] = useState(false);

  const page = parseInt(searchParams.get('page') || '1');
  const genre = searchParams.get('genre') || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debouncedSearch !== search) {
      updateParam('search', debouncedSearch);
      updateParam('page', '1');
    }
  }, [debouncedSearch]);

  useEffect(() => {
    bookService.getGenres()
      .then(res => setGenres(res.data.data || []))
      .catch(() => setGenres([]));
  }, []);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (genre) params.genre = genre;
      if (sort) params.sort = sort;
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (rating) params.rating = rating;
      if (searchParams.get('featured')) params.featured = true;
      if (searchParams.get('bestseller')) params.bestseller = true;
      const res = await bookService.getAll(params);
      setBooks(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalBooks(res.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setLoading(false);
    }
  }, [page, genre, sort, search, minPrice, maxPrice, rating, searchParams]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const updateParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val);
    else p.delete(key);
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams({});

  const activeFilterCount = [genre, minPrice || maxPrice, rating, search]
    .filter(Boolean).length;

  return (
    <div className="browse-page">
      <div className="container">
        <div className="browse-header">
          <div>
            <h1>Browse Books</h1>
            <p>{totalBooks} books found</p>
          </div>
          <div className="browse-controls">
            <button
              className="btn btn-outline btn-sm filter-toggle"
              onClick={() => setMobileFilters(!mobileFilters)}
            >
              ☰ Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
            <select
              className="sort-select"
              value={sort}
              onChange={e => { updateParam('sort', e.target.value); updateParam('page', '1'); }}
            >
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="browse-layout">
          <aside className={`browse-sidebar ${mobileFilters ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
              {activeFilterCount > 0 && (
                <button className="clear-filters" onClick={clearFilters}>Clear All</button>
              )}
            </div>

            <div className="filter-section">
              <h4>Search</h4>
              <input
                type="text"
                placeholder="Title, author, keyword..."
                className="filter-search"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
            </div>

            <div className="filter-section">
              <h4>Genre</h4>
              <div className="filter-list">
                <button
                  className={`filter-chip ${!genre ? 'active' : ''}`}
                  onClick={() => { updateParam('genre', ''); updateParam('page', '1'); }}
                >All Genres</button>
                {genres.map(g => (
                  <button
                    key={g}
                    className={`filter-chip ${genre === g ? 'active' : ''}`}
                    onClick={() => { updateParam('genre', g); updateParam('page', '1'); }}
                  >{g}</button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Price</h4>
              <div className="filter-list">
                {priceRanges.map((r, i) => (
                  <button
                    key={i}
                    className={`filter-chip ${minPrice === r.min && maxPrice === r.max ? 'active' : ''}`}
                    onClick={() => {
                      updateParam('minPrice', r.min);
                      updateParam('maxPrice', r.max);
                      updateParam('page', '1');
                    }}
                  >{r.label}</button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Minimum Rating</h4>
              <div className="filter-list">
                {[0, 3, 3.5, 4, 4.5].map(r => (
                  <button
                    key={r}
                    className={`filter-chip ${rating === String(r) || (!rating && r === 0) ? 'active' : ''}`}
                    onClick={() => { updateParam('rating', r === 0 ? '' : String(r)); updateParam('page', '1'); }}
                  >
                    {r === 0 ? 'Any' : `${r}+ ★`}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="browse-main">
            {loading ? (
              <BookGridSkeleton count={12} />
            ) : books.length === 0 ? (
              <div className="no-results">
                <span className="no-results-icon">📚</span>
                <h3>No books found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
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
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let p;
                      if (totalPages <= 7) p = i + 1;
                      else if (page <= 4) p = i + 1;
                      else if (page >= totalPages - 3) p = totalPages - 6 + i;
                      else p = page - 3 + i;
                      return (
                        <button
                          key={p}
                          className={`page-btn ${page === p ? 'active' : ''}`}
                          onClick={() => updateParam('page', String(p))}
                        >{p}</button>
                      );
                    })}
                    <button
                      className="page-btn"
                      disabled={page >= totalPages}
                      onClick={() => updateParam('page', String(page + 1))}
                    >Next →</button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
