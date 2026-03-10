import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { bookService, orderService, eventService, authService } from '../../services/endpoints';
import { useToast } from '../../hooks/useAnimations';
import { PageLoader } from '../../components/Loading/LoadingSpinner';
import './AdminPage.css';

const adminTabs = [
  { id: 'overview', label: '📊 Overview' },
  { id: 'books', label: '📚 Books' },
  { id: 'orders', label: '📦 Orders' },
  { id: 'users', label: '👥 Users' },
  { id: 'addbook', label: '➕ Add Book' }
];

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ books: 0, orders: 0, users: 0, revenue: 0 });

  const [bookForm, setBookForm] = useState({
    title: '', author: '', genre: '', price: '', originalPrice: '',
    description: '', shortDescription: '', pages: '', isbn: '',
    publisher: '', language: 'English', stock: '', coverImage: '',
    isFeatured: false, isBestSeller: false
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, ordersRes, usersRes] = await Promise.all([
        bookService.getAll({ limit: 100 }),
        orderService.getAll().catch(() => ({ data: { data: [] } })),
        authService.getAllUsers().catch(() => ({ data: { data: [] } }))
      ]);
      const bk = booksRes.data.data || [];
      const od = ordersRes.data.data || [];
      const us = usersRes.data.data || [];
      setBooks(bk);
      setOrders(od);
      setUsers(us);
      setStats({
        books: bk.length,
        orders: od.length,
        users: us.length,
        revenue: od.reduce((s, o) => s + (o.totalAmount || 0), 0)
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      showToast('Order status updated', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to update order', 'error');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await bookService.delete(bookId);
      showToast('Book deleted', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to delete book', 'error');
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await bookService.create({
        ...bookForm,
        price: parseFloat(bookForm.price),
        originalPrice: parseFloat(bookForm.originalPrice) || parseFloat(bookForm.price),
        pages: parseInt(bookForm.pages),
        stock: parseInt(bookForm.stock)
      });
      showToast('Book added successfully!', 'success');
      setBookForm({
        title: '', author: '', genre: '', price: '', originalPrice: '',
        description: '', shortDescription: '', pages: '', isbn: '',
        publisher: '', language: 'English', stock: '', coverImage: '',
        isFeatured: false, isBestSeller: false
      });
      fetchData();
      setActiveTab('books');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to add book', 'error');
    }
  };

  if (!user || user.role !== 'admin') return null;
  if (loading) return <PageLoader />;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>🔧 Admin Dashboard</h1>
          <p>Manage your bookstore</p>
        </div>

        <div className="admin-tabs">
          {adminTabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >{tab.label}</button>
          ))}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {activeTab === 'overview' && (
            <div className="admin-overview">
              <div className="stat-cards">
                <div className="stat-card">
                  <span className="stat-icon">📚</span>
                  <div className="stat-info">
                    <span className="stat-value">{stats.books}</span>
                    <span className="stat-label">Total Books</span>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">📦</span>
                  <div className="stat-info">
                    <span className="stat-value">{stats.orders}</span>
                    <span className="stat-label">Total Orders</span>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">👥</span>
                  <div className="stat-info">
                    <span className="stat-value">{stats.users}</span>
                    <span className="stat-label">Users</span>
                  </div>
                </div>
                <div className="stat-card accent">
                  <span className="stat-icon">💰</span>
                  <div className="stat-info">
                    <span className="stat-value">${stats.revenue.toFixed(2)}</span>
                    <span className="stat-label">Revenue</span>
                  </div>
                </div>
              </div>

              <div className="recent-section">
                <h3>Recent Orders</h3>
                <div className="admin-table">
                  <table>
                    <thead>
                      <tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(o => (
                        <tr key={o._id}>
                          <td>#{o._id.slice(-6)}</td>
                          <td>{o.user?.name || 'N/A'}</td>
                          <td>${o.totalAmount?.toFixed(2)}</td>
                          <td><span className="status-badge" style={{ background: o.status === 'delivered' ? '#4caf50' : '#ff9800' }}>{o.status}</span></td>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'books' && (
            <div className="admin-section">
              <div className="section-head">
                <h3>All Books ({books.length})</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('addbook')}>+ Add Book</button>
              </div>
              <div className="admin-table">
                <table>
                  <thead>
                    <tr><th>Cover</th><th>Title</th><th>Author</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {books.map(b => (
                      <tr key={b._id}>
                        <td><img src={b.coverImage} alt="" className="table-cover" /></td>
                        <td>{b.title}</td>
                        <td>{b.author}</td>
                        <td>${b.price?.toFixed(2)}</td>
                        <td>{b.stock}</td>
                        <td>⭐ {b.rating?.toFixed(1)}</td>
                        <td>
                          <button className="action-btn delete" onClick={() => handleDeleteBook(b._id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="admin-section">
              <h3>All Orders ({orders.length})</h3>
              <div className="admin-table">
                <table>
                  <thead>
                    <tr><th>ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td>#{o._id.slice(-6)}</td>
                        <td>{o.user?.name || 'N/A'}</td>
                        <td>{o.items?.length} items</td>
                        <td>${o.totalAmount?.toFixed(2)}</td>
                        <td><span className="status-badge" style={{ background: o.status === 'delivered' ? '#4caf50' : o.status === 'cancelled' ? '#f44336' : '#ff9800' }}>{o.status}</span></td>
                        <td>
                          <select
                            value={o.status}
                            onChange={e => handleOrderStatus(o._id, e.target.value)}
                            className="status-select"
                          >
                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-section">
              <h3>All Users ({users.length})</h3>
              <div className="admin-table">
                <table>
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'addbook' && (
            <div className="admin-section">
              <h3>Add New Book</h3>
              <form className="add-book-form" onSubmit={handleAddBook}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Title *</label>
                    <input value={bookForm.title} onChange={e => setBookForm(f => ({ ...f, title: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Author *</label>
                    <input value={bookForm.author} onChange={e => setBookForm(f => ({ ...f, author: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Genre *</label>
                    <input value={bookForm.genre} onChange={e => setBookForm(f => ({ ...f, genre: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Price *</label>
                    <input type="number" step="0.01" value={bookForm.price} onChange={e => setBookForm(f => ({ ...f, price: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Original Price</label>
                    <input type="number" step="0.01" value={bookForm.originalPrice} onChange={e => setBookForm(f => ({ ...f, originalPrice: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Pages</label>
                    <input type="number" value={bookForm.pages} onChange={e => setBookForm(f => ({ ...f, pages: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Stock *</label>
                    <input type="number" value={bookForm.stock} onChange={e => setBookForm(f => ({ ...f, stock: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>ISBN</label>
                    <input value={bookForm.isbn} onChange={e => setBookForm(f => ({ ...f, isbn: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Publisher</label>
                    <input value={bookForm.publisher} onChange={e => setBookForm(f => ({ ...f, publisher: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Cover Image URL *</label>
                    <input value={bookForm.coverImage} onChange={e => setBookForm(f => ({ ...f, coverImage: e.target.value }))} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Short Description</label>
                  <input value={bookForm.shortDescription} onChange={e => setBookForm(f => ({ ...f, shortDescription: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Full Description *</label>
                  <textarea rows={4} value={bookForm.description} onChange={e => setBookForm(f => ({ ...f, description: e.target.value }))} required />
                </div>
                <div className="form-checkboxes">
                  <label><input type="checkbox" checked={bookForm.isFeatured} onChange={e => setBookForm(f => ({ ...f, isFeatured: e.target.checked }))} /> Featured</label>
                  <label><input type="checkbox" checked={bookForm.isBestSeller} onChange={e => setBookForm(f => ({ ...f, isBestSeller: e.target.checked }))} /> Bestseller</label>
                </div>
                <button type="submit" className="btn btn-primary btn-lg">Add Book</button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
