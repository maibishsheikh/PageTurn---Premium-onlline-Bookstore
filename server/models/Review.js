const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    maxlength: 2000
  },
  helpful: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

reviewSchema.index({ book: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAverageRating = async function(bookId) {
  const stats = await this.aggregate([
    { $match: { book: bookId } },
    {
      $group: {
        _id: '$book',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);
  if (stats.length > 0) {
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count
    });
  } else {
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      rating: 0,
      reviewCount: 0
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.book);
});

module.exports = mongoose.model('Review', reviewSchema);
