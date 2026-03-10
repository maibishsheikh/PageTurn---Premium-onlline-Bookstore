const Book = require('../models/Book');

// @desc    Get all books with filtering, sorting, pagination
// @route   GET /api/books
exports.getBooks = async (req, res) => {
  try {
    const {
      search, genre, author, minPrice, maxPrice,
      sort, page = 1, limit = 12,
      featured, bestseller, trending, newRelease, upcoming
    } = req.query;

    let query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (genre) query.genre = { $regex: genre, $options: 'i' };
    if (author) query.author = { $regex: author, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (featured === 'true') query.isFeatured = true;
    if (bestseller === 'true') query.isBestSeller = true;
    if (trending === 'true') query.isTrending = true;
    if (newRelease === 'true') query.isNewRelease = true;
    if (upcoming === 'true') query.isUpcoming = true;

    let sortOptions = {};
    switch (sort) {
      case 'price_asc': sortOptions = { price: 1 }; break;
      case 'price_desc': sortOptions = { price: -1 }; break;
      case 'rating': sortOptions = { rating: -1 }; break;
      case 'newest': sortOptions = { releaseDate: -1 }; break;
      case 'popular': sortOptions = { soldCount: -1 }; break;
      default: sortOptions = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: books.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: books
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create book (admin)
// @route   POST /api/books
exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update book (admin)
// @route   PUT /api/books/:id
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete book (admin)
// @route   DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured books
// @route   GET /api/books/collection/featured
exports.getFeatured = async (req, res) => {
  try {
    const books = await Book.find({ isFeatured: true }).limit(8);
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trending books
// @route   GET /api/books/collection/trending
exports.getTrending = async (req, res) => {
  try {
    const books = await Book.find({ isTrending: true }).limit(8);
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bestsellers
// @route   GET /api/books/collection/bestsellers
exports.getBestsellers = async (req, res) => {
  try {
    const books = await Book.find({ isBestSeller: true }).sort({ soldCount: -1 }).limit(8);
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get new releases
// @route   GET /api/books/collection/new-releases
exports.getNewReleases = async (req, res) => {
  try {
    const books = await Book.find({ isNewRelease: true }).sort({ releaseDate: -1 }).limit(8);
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get upcoming releases
// @route   GET /api/books/collection/upcoming
exports.getUpcoming = async (req, res) => {
  try {
    const books = await Book.find({ isUpcoming: true }).sort({ releaseDate: 1 }).limit(8);
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get distinct genres
// @route   GET /api/books/info/genres
exports.getGenres = async (req, res) => {
  try {
    const genres = await Book.distinct('genre');
    res.json({ success: true, data: genres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get distinct authors
// @route   GET /api/books/info/authors
exports.getAuthors = async (req, res) => {
  try {
    const authors = await Book.distinct('author');
    res.json({ success: true, data: authors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
