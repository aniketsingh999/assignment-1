const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: [true, 'Please provide name'],
  },
  email: {
    type: String,
    required: true,
    validate: validator.default.isEmail,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
  },
  phoneNumber: {
    type: String,
    validate: validator.default.isMobilePhone,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  offHoursStart: {
    type: Date,
    validate: validator.default.isDate
  },
  offHoursDuration: {
    type: Number
  }
});

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);