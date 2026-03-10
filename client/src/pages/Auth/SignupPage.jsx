import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useAnimations';
import './AuthPages.css';

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (form.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      showToast('Account created successfully!', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.error || 'Registration failed', 'error');
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
            <span className="auth-icon">🌟</span>
            <h2>Join PageTurn</h2>
            <p>Create your account and start your reading journey today.</p>
            <div className="auth-features">
              <div className="auth-feature">📚 10,000+ Books</div>
              <div className="auth-feature">✨ Exclusive Deals</div>
              <div className="auth-feature">📅 Pre-order Upcoming</div>
            </div>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
            </div>

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
                  placeholder="Min. 6 characters"
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

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? '⏳ Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
