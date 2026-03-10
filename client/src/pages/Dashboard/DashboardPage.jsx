import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { orderService, authService } from '../../services/endpoints';
import { useToast } from '../../hooks/useAnimations';
import { PageLoader } from '../../components/Loading/LoadingSpinner';
import './DashboardPage.css';

const tabs = [
  { id: 'orders', label: '📦 Orders', icon: '📦' },
  { id: 'wishlist', label: '❤️ Wishlist', icon: '❤️' },
  { id: 'profile', label: '👤 Profile', icon: '👤' }
];

const statusColors = {
  pending: '#ff9800',
  processing: '#2196f3',
  shipped: '#9c27b0',
  delivered: '#4caf50',
  cancelled: '#f44336'
};

export default function DashboardPage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setProfileForm({ name: user.name, email: user.email });
    orderService.getMyOrders()
      .then(res => setOrders(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.updateProfile(profileForm);
      updateUser(res.data.data);
      showToast('Profile updated!', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Update failed', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;
  if (loading) return <PageLoader />;

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <div className="user-card">
              <div className="user-avatar-lg">{user.name?.charAt(0)}</div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              {user.role === 'admin' && <span className="admin-badge">Admin</span>}
            </div>
            <nav className="dashboard-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-item">🔧 Admin Panel</Link>
              )}
              <button className="nav-item logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </nav>
          </aside>

          <main className="dashboard-content">
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2>My Orders</h2>
                {orders.length === 0 ? (
                  <div className="empty-state">
                    <span>📦</span>
                    <h3>No orders yet</h3>
                    <p>Start shopping to see your orders here.</p>
                    <Link to="/books" className="btn btn-primary">Browse Books</Link>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order._id} className="order-card">
                        <div className="order-header">
                          <div>
                            <span className="order-id">Order #{order._id.slice(-8)}</span>
                            <span className="order-date">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span
                            className="order-status"
                            style={{ background: statusColors[order.status] || '#999' }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="order-items">
                          {order.items?.map((item, i) => (
                            <div key={i} className="order-item">
                              <img src={item.coverImage} alt={item.title} />
                              <div>
                                <p className="oi-title">{item.title}</p>
                                <p className="oi-qty">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="order-footer">
                          <span className="order-total">Total: ${order.totalAmount?.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2>My Wishlist</h2>
                {(!user.wishlist || user.wishlist.length === 0) ? (
                  <div className="empty-state">
                    <span>❤️</span>
                    <h3>Wishlist is empty</h3>
                    <p>Save books you'd love to read later.</p>
                    <Link to="/books" className="btn btn-primary">Discover Books</Link>
                  </div>
                ) : (
                  <div className="wishlist-grid">
                    {user.wishlist.map(bookId => (
                      <Link to={`/books/${bookId}`} key={bookId} className="wishlist-item">
                        <span>📖</span>
                        <p>View Book</p>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2>Edit Profile</h2>
                <form className="profile-form" onSubmit={handleProfileUpdate}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
