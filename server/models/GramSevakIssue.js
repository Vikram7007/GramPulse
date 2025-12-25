// models/GramSevakIssue.js (नवीन model create कर – Issue schema प्रमाणेच)
const mongoose = require('mongoose');

const gramsevekIssueSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  images: [String], // Cloudinary URLs
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['pending', 'in-progress', 'resolved'], default: 'in-progress' },
  priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
  assignedTo: { type: String, required: true }, // Gram Sevak चे नाव
  originalIssueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }, // original Issue चा reference (optional)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GramSevakIssue', gramsevekIssueSchema);