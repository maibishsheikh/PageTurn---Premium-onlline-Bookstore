import API from './api';

export const bookService = {
  getAll: (params) => API.get('/books', { params }),
  getById: (id) => API.get(`/books/${id}`),
  getFeatured: () => API.get('/books/collection/featured'),
  getTrending: () => API.get('/books/collection/trending'),
  getBestsellers: () => API.get('/books/collection/bestsellers'),
  getNewReleases: () => API.get('/books/collection/new-releases'),
  getUpcoming: () => API.get('/books/collection/upcoming'),
  getGenres: () => API.get('/books/info/genres'),
  getAuthors: () => API.get('/books/info/authors'),
  create: (data) => API.post('/books', data),
  update: (id, data) => API.put(`/books/${id}`, data),
  delete: (id) => API.delete(`/books/${id}`)
};

export const authService = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  toggleWishlist: (bookId) => API.put(`/auth/wishlist/${bookId}`),
  toggleFollowAuthor: (author) => API.put('/auth/follow-author', { author }),
  getAllUsers: () => API.get('/auth/users')
};

export const orderService = {
  create: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/my'),
  getMy: () => API.get('/orders/my'),
  getById: (id) => API.get(`/orders/${id}`),
  getAll: () => API.get('/orders'),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status })
};

export const reviewService = {
  getBookReviews: (bookId) => API.get(`/reviews/book/${bookId}`),
  getByBook: (bookId) => API.get(`/reviews/book/${bookId}`),
  create: (bookId, data) => API.post('/reviews', { ...data, book: bookId }),
  delete: (id) => API.delete(`/reviews/${id}`)
};

export const eventService = {
  getAll: (params) => API.get('/events', { params }),
  getById: (id) => API.get(`/events/${id}`),
  create: (data) => API.post('/events', data),
  update: (id, data) => API.put(`/events/${id}`, data),
  delete: (id) => API.delete(`/events/${id}`)
};
