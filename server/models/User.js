const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  village: { type: String, required: true },
  role: { type: String, enum: ['villager', 'gramsevak', 'admin'], default: 'villager' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);