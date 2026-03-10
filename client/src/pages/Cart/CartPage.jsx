import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const shipping = cartTotal > 35 ? 0 : 4.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <span className="empty-icon">🛒</span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any books yet.</p>
            <Link to="/books" className="btn btn-primary">Browse Books</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>
        <div className="cart-layout">
          <div className="cart-items">
            <div className="cart-header-row">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </div>
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item._id}
                  className="cart-item"
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                >
                  <div className="cart-product">
                    <img src={item.coverImage} alt={item.title} />
                    <div>
                      <Link to={`/books/${item._id}`} className="cart-title">{item.title}</Link>
                      <p className="cart-author">{item.author}</p>
                    </div>
                  </div>
                  <span className="cart-price">${item.price?.toFixed(2)}</span>
                  <div className="cart-qty">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <span className="cart-subtotal">${(item.price * item.quantity).toFixed(2)}</span>
                  <button className="remove-btn" onClick={() => removeFromCart(item._id)}>✕</button>
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="cart-actions">
              <Link to="/books" className="btn btn-outline btn-sm">← Continue Shopping</Link>
              <button className="btn btn-outline btn-sm" onClick={clearCart}>Clear Cart</button>
            </div>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="free-shipping">FREE</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            {shipping > 0 && (
              <p className="free-shipping-note">
                Add ${(35 - cartTotal).toFixed(2)} more for free shipping!
              </p>
            )}
            <div className="summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              className="btn btn-primary btn-lg checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
