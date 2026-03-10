const express = require('express');
const router = express.Router();
const {
  register, login, getMe, updateProfile,
  toggleWishlist, toggleFollowAuthor, getAllUsers
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/wishlist/:bookId', protect, toggleWishlist);
router.put('/follow-author', protect, toggleFollowAuthor);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
