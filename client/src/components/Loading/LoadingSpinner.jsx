import './LoadingSpinner.css';

export function PageLoader() {
  return (
    <div className="page-loader">
      <div className="book-animation">
        <div className="book-base" />
        <div className="page-flip" />
      </div>
      <p className="loader-text">Loading...</p>
    </div>
  );
}

export function BookGridSkeleton({ count = 8 }) {
  return (
    <div className="book-grid">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton skeleton-image" />
          <div className="skeleton-info">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" style={{ width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Spinner({ size = 'md' }) {
  return <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`} />;
}
