const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Get reviews for a book
// @route   GET /api/reviews/book/:bookId
exports.getBookReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create review
// @route   POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { book, rating, title, comment } = req.body;

    const existingReview = await Review.findOne({ user: req.user._id, book });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You already reviewed this book' });
    }

    const bookExists = await Book.findById(book);
    if (!bookExists) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const review = await Review.create({
      user: req.user._id,
      book,
      rating,
      title,
      comment
    });

    const populated = await Review.findById(review._id).populate('user', 'name avatar');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const bookId = review.book;
    await review.deleteOne();
    await Review.calcAverageRating(bookId);
    res.json({ success: true, message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
