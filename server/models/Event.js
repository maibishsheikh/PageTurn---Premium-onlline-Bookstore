const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: 200
  },
  type: {
    type: String,
    enum: ['book_launch', 'author_meetup', 'book_signing', 'reading_session', 'literary_festival', 'workshop'],
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 3000
  },
  author: {
    type: String,
    trim: true
  },
  featuredBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  endDate: Date,
  location: {
    venue: String,
    city: String,
    country: String,
    isOnline: { type: Boolean, default: false },
    link: String
  },
  image: {
    type: String,
    default: ''
  },
  attendees: {
    type: Number,
    default: 0
  },
  maxAttendees: Number,
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
