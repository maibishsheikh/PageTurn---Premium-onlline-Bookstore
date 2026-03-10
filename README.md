# 📚 PageTurn Bookstore

A premium, full-featured Online Bookstore built with the **MERN Stack** (MongoDB, Express.js, React, Node.js).  
Beautiful UI, smooth animations, and complete bookstore functionality.

---

## ✨ Features

### Customer Features
- 🏠 Beautiful landing page with hero section, carousels, and genre browsing
- 📖 Browse books with advanced filtering, sorting, and search
- 📱 Fully responsive — works on all devices
- 🛒 Shopping cart with quantity controls
- 💳 Checkout with shipping address and payment method
- ⭐ Book reviews and ratings
- 📅 Upcoming releases with countdown timers
- 🎭 Literary events listing
- 👤 User dashboard (orders, wishlist, profile)
- 🔐 JWT authentication (login/signup)

### Admin Features
- 📊 Admin dashboard with stats overview
- 📚 Manage books (add, delete)
- 📦 Manage orders (update status)
- 👥 View all users
- ➕ Add new books via form

### Design
- 🎨 Cozy library theme with Deep Brown, Cream, and Gold accents
- ✨ Smooth animations and page transitions (Framer Motion)
- 📖 3D flip book cards with skeleton loading
- 🌊 Wave dividers and glassmorphism effects
- 🎭 Scroll reveal animations

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Framer Motion, Axios |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Styling** | Custom CSS with CSS Variables, animations |
| **Fonts** | Playfair Display, Inter (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ installed
- **MongoDB** running locally (or use MongoDB Atlas)

### 1. Clone & Install

```bash
cd book_store
npm run install:all
```

### 2. Configure Environment

The `.env` file is already set up at `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/pageturn_bookstore
JWT_SECRET=pageturn_super_secret_jwt_key_2024
JWT_EXPIRE=30d
```

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- **Admin user**: admin@pageturn.com / admin123
- **Test user**: john@example.com / password123
- **12 genres**, **20 books** (including 4 upcoming), **6 events**

### 4. Run the App

```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)
- Health Check: [http://localhost:5000/health](http://localhost:5000/health)

---

## 📁 Project Structure

```
book_store/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar/
│   │   │   ├── Footer/
│   │   │   ├── BookCard/
│   │   │   ├── BookCarousel/
│   │   │   ├── HeroSection/
│   │   │   ├── GenreSection/
│   │   │   ├── EventCard/
│   │   │   └── Loading/
│   │   ├── pages/             # Page components
│   │   │   ├── Landing/
│   │   │   ├── Browse/
│   │   │   ├── BookDetails/
│   │   │   ├── Genre/
│   │   │   ├── Upcoming/
│   │   │   ├── Events/
│   │   │   ├── Cart/
│   │   │   ├── Checkout/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   └── Admin/
│   │   ├── context/           # React Context (Auth, Cart)
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom hooks
│   │   └── styles/            # Global CSS
│   └── index.html
├── server/                    # Express Backend
│   ├── config/                # Database config
│   ├── models/                # Mongoose models
│   ├── controllers/           # Route controllers
│   ├── routes/                # API routes
│   ├── middleware/            # Auth & error handling
│   ├── server.js              # Entry point
│   └── seed.js                # Database seeder
└── package.json               # Root scripts
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Books
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/books` | Get all books (with filters) |
| GET | `/api/books/featured` | Featured books |
| GET | `/api/books/trending` | Trending books |
| GET | `/api/books/bestsellers` | Bestselling books |
| GET | `/api/books/new-releases` | New releases |
| GET | `/api/books/upcoming` | Upcoming books |
| GET | `/api/books/:id` | Single book details |
| POST | `/api/books` | Create book (admin) |
| DELETE | `/api/books/:id` | Delete book (admin) |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/mine` | Get my orders |
| GET | `/api/orders` | Get all orders (admin) |
| PUT | `/api/orders/:id/status` | Update order status (admin) |

### Reviews
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reviews/book/:bookId` | Get book reviews |
| POST | `/api/reviews/book/:bookId` | Add review |

### Events
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/events` | Get all events |
| POST | `/api/events` | Create event (admin) |

---

## 📝 License

MIT License - feel free to use this project for learning or as a starting point.

---

Built with ❤️ by PageTurn Team
