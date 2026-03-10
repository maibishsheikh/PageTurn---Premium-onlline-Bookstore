import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/endpoints';
import { useToast } from '../../hooks/useAnimations';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();

  const [form, setForm] = useState({
    street: '', city: '', state: '', zipCode: '', country: 'US',
    paymentMethod: 'credit_card'
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shipping = cartTotal > 35 ? 0 : 4.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to place an order', 'error');
      navigate('/login');
      return;
    }
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      await orderService.create({
        items: items.map(i => ({
          book: i._id,
          title: i.title,
          coverImage: i.coverImage,
          price: i.price,
          quantity: i.quantity
        })),
        shippingAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country
        },
        paymentMethod: form.paymentMethod
      });
      clearCart();
      setOrderPlaced(true);
      showToast('Order placed successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to place order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <span className="success-icon">🎉</span>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase. You'll receive a confirmation email shortly.</p>
            <div className="success-actions">
              <Link to="/dashboard" className="btn btn-primary">View My Orders</Link>
              <Link to="/books" className="btn btn-outline">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>📦 Shipping Address</h3>
              <div className="form-group">
                <label>Street Address</label>
                <input name="street" value={form.street} onChange={handleChange} required placeholder="123 Main St" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} required placeholder="New York" />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" value={form.state} onChange={handleChange} required placeholder="NY" />
                </div>
                <div className="form-group">
                  <label>Zip Code</label>
                  <input name="zipCode" value={form.zipCode} onChange={handleChange} required placeholder="10001" />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>💳 Payment Method</h3>
              <div className="payment-options">
                {[
                  { value: 'credit_card', label: '💳 Credit Card', desc: 'Visa, Mastercard, Amex' },
                  { value: 'debit_card', label: '🏦 Debit Card', desc: 'All major banks' },
                  { value: 'paypal', label: '🅿️ PayPal', desc: 'Pay with PayPal' },
                  { value: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when delivered' }
                ].map(pm => (
                  <label key={pm.value} className={`payment-option ${form.paymentMethod === pm.value ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.value}
                      checked={form.paymentMethod === pm.value}
                      onChange={handleChange}
                    />
                    <div>
                      <strong>{pm.label}</strong>
                      <span>{pm.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg place-order-btn" disabled={submitting}>
              {submitting ? '⏳ Placing Order...' : `🛍️ Place Order - $${total.toFixed(2)}`}
            </button>
          </form>

          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="checkout-items">
              {items.map(item => (
                <div key={item._id} className="checkout-item">
                  <img src={item.coverImage} alt={item.title} />
                  <div>
                    <p className="ci-title">{item.title}</p>
                    <p className="ci-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="ci-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="checkout-totals">
              <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
