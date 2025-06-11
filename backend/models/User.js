// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'intern' },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', UserSchema);
