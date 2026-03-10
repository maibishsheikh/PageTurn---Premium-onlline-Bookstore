const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: 200
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  publisher: {
    type: String,
    trim: true,
    default: 'Independent'
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 5000
  },
  shortDescription: {
    type: String,
    maxlength: 300
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/300x450?text=Book+Cover'
  },
  images: [String],
  releaseDate: {
    type: Date,
    default: Date.now
  },
  isbn: {
    type: String,
    trim: true
  },
  pages: {
    type: Number,
    min: 1
  },
  language: {
    type: String,
    default: 'English'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isNewRelease: {
    type: Boolean,
    default: false
  },
  isUpcoming: {
    type: Boolean,
    default: false
  },
  preOrderAvailable: {
    type: Boolean,
    default: false
  },
  soldCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text', genre: 'text', tags: 'text' });
bookSchema.index({ genre: 1 });
bookSchema.index({ isFeatured: 1 });
bookSchema.index({ isBestSeller: 1 });
bookSchema.index({ releaseDate: -1 });

module.exports = mongoose.model('Book', bookSchema);
