const express = require('express');
const router = express.Router();
const {
  getBooks, getBook, createBook, updateBook, deleteBook,
  getFeatured, getTrending, getBestsellers, getNewReleases,
  getUpcoming, getGenres, getAuthors
} = require('../controllers/bookController');
const { protect, admin } = require('../middleware/auth');

// Collection routes (must be before /:id)
router.get('/collection/featured', getFeatured);
router.get('/collection/trending', getTrending);
router.get('/collection/bestsellers', getBestsellers);
router.get('/collection/new-releases', getNewReleases);
router.get('/collection/upcoming', getUpcoming);
router.get('/info/genres', getGenres);
router.get('/info/authors', getAuthors);

router.route('/')
  .get(getBooks)
  .post(protect, admin, createBook);

router.route('/:id')
  .get(getBook)
  .put(protect, admin, updateBook)
  .delete(protect, admin, deleteBook);

module.exports = router;
