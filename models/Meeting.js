const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  host: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  guest: {
    type: mongoose.Types.ObjectId
  },
  time: {
    type: Date,
    required: [true, 'please provide a start time for the meeting.']
  },
  duration: {
    type: Number,
    required: [true, 'please provide a duration for the meeting.']
  },
  agenda: {
    type: String,
    minlength: 3,
    maxlength: 500
  },
  title: {
    type: String,
    required: [true, 'please provide a title for the meeting'],
    minlength: 3,
    maxlength: 30
  },
  isConfimed: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Meeting', MeetingSchema)