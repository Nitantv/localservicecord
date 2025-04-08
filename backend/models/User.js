const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  address: { type: String, required: true },
  address2: { type: String, required: false },
  address3: { type: String, required: false }
});

// Debug queries
userSchema.pre('save', function (next) {
  console.log("📌 Saving user:", this);
  next();
});

module.exports = mongoose.model('User', userSchema);
