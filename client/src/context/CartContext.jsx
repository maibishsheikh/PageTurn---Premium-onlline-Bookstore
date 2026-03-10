import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('pageturn_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('pageturn_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (book, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === book._id);
      if (existing) {
        return prev.map(i =>
          i._id === book._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, {
        _id: book._id,
        title: book.title,
        author: book.author,
        price: book.price,
        coverImage: book.coverImage,
        stock: book.stock,
        quantity
      }];
    });
  };

  const removeFromCart = (bookId) => {
    setItems(prev => prev.filter(i => i._id !== bookId));
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setItems(prev => prev.map(i =>
      i._id === bookId ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity,
      clearCart, cartCount, cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
