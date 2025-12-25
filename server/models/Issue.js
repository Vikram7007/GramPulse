const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  images: [String], // Cloudinary URLs
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['pending', 'in-progress', 'resolved'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Issue', issueSchema);