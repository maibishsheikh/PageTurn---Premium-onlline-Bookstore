import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import LandingPage from './pages/Landing/LandingPage';
import BrowsePage from './pages/Browse/BrowsePage';
import BookDetails from './pages/BookDetails/BookDetails';
import GenrePage from './pages/Genre/GenrePage';
import UpcomingPage from './pages/Upcoming/UpcomingPage';
import EventsPage from './pages/Events/EventsPage';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AdminPage from './pages/Admin/AdminPage';

import './styles/global.css';
import './styles/animations.css';

function AppContent() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/books" element={<BrowsePage />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/genres" element={<GenrePage />} />
          <Route path="/upcoming" element={<UpcomingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
