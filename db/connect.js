const mongoose = require('mongoose');

const connectDB = (url) => {
  return new mongoose.connect(url);
}

module.exports = connectDB;