import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">📚</span>
          <span className="brand-text">
            <span className="brand-page">Page</span>
            <span className="brand-turn">Turn</span>
          </span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search books, authors, genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/books" className="nav-link" onClick={() => setMenuOpen(false)}>Browse</Link>
          <Link to="/genres" className="nav-link" onClick={() => setMenuOpen(false)}>Genres</Link>
          <Link to="/upcoming" className="nav-link" onClick={() => setMenuOpen(false)}>Coming Soon</Link>
          <Link to="/events" className="nav-link" onClick={() => setMenuOpen(false)}>Events</Link>
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="nav-action cart-action" title="Cart">
            <span>🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="user-avatar-btn">
                <span className="avatar-circle">{user.name?.charAt(0).toUpperCase()}</span>
              </button>
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </div>
                <div className="dropdown-divider" />
                <Link to="/dashboard" className="dropdown-item">My Dashboard</Link>
                <Link to="/dashboard?tab=orders" className="dropdown-item">My Orders</Link>
                <Link to="/dashboard?tab=wishlist" className="dropdown-item">Wishlist</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="dropdown-item dropdown-admin">Admin Panel</Link>
                )}
                <div className="dropdown-divider" />
                <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-accent btn-sm nav-login-btn">Sign In</Link>
          )}

          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
              <span /><span /><span />
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
