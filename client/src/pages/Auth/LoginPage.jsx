import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useAnimations';
import './AuthPages.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      showToast('Welcome back!', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.error || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-visual">
          <div className="auth-visual-content">
            <span className="auth-icon">📚</span>
            <h2>Welcome Back!</h2>
            <p>Sign in to access your library, wishlists, and order history.</p>
            <div className="auth-features">
              <div className="auth-feature">📖 Track your reading</div>
              <div className="auth-feature">🛒 Faster checkout</div>
              <div className="auth-feature">❤️ Save wishlists</div>
            </div>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="auth-header">
            <h1>Sign In</h1>
            <p>Don't have an account? <Link to="/signup">Create one</Link></p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? '⏳ Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider">
            <span>or sign in with</span>
          </div>

          <div className="social-buttons">
            <button className="social-btn google">🔵 Google</button>
            <button className="social-btn github">⚫ GitHub</button>
          </div>

          <p className="demo-creds">
            Demo: <code>admin@pageturn.com</code> / <code>admin123</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
