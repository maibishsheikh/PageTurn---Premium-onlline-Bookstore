const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  image: {
    type: String,
    default: ''
  },
  bookCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

genreSchema.pre('save', function(next) {
  this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  next();
});

module.exports = mongoose.model('Genre', genreSchema);
