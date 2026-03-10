import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,40 C360,100 720,0 1080,60 C1260,80 1380,20 1440,40 L1440,100 L0,100 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <div className="footer-brand">
                <span className="brand-icon">📚</span>
                <span className="brand-text">
                  <span className="brand-page">Page</span>
                  <span className="brand-turn">Turn</span>
                </span>
              </div>
              <p>Your premium destination for literary exploration. Discover stories that transform, educate, and inspire.</p>
              <div className="footer-socials">
                <a href="#" className="social-link" aria-label="Twitter">𝕏</a>
                <a href="#" className="social-link" aria-label="Instagram">📷</a>
                <a href="#" className="social-link" aria-label="Facebook">f</a>
                <a href="#" className="social-link" aria-label="YouTube">▶</a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Explore</h4>
              <ul>
                <li><Link to="/books">Browse Books</Link></li>
                <li><Link to="/genres">Genres</Link></li>
                <li><Link to="/books?bestseller=true">Bestsellers</Link></li>
                <li><Link to="/upcoming">Coming Soon</Link></li>
                <li><Link to="/events">Events</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Account</h4>
              <ul>
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/register">Create Account</Link></li>
                <li><Link to="/dashboard">My Dashboard</Link></li>
                <li><Link to="/cart">Shopping Cart</Link></li>
                <li><Link to="/dashboard?tab=wishlist">Wishlist</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Returns Policy</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} PageTurn Bookstore. All rights reserved.</p>
            <p className="footer-tagline">Made with ❤️ for book lovers everywhere</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
