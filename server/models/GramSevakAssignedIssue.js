const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  date: {
    type: String
  },
  time: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const gramSevakAssignedIssueSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number] // [longitude, latitude]
    }
  },
  images: [{
    type: String
  }],
  votes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  priority: {
    type: String,
    enum: ['high', 'medium', 'low', null],
    default: null
  },
  assignedTo: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'Completed', 'Issue'],
    default: 'in-progress'
  },
  comments: [commentSchema],
  proofPhotos: [{
    type: String
  }],
  originalIssueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: true
  }
}, {
  timestamps: true // 👈 createdAt & updatedAt automatic
});

// 🌍 Geo index
gramSevakAssignedIssueSchema.index({ location: '2dsphere' });

// ✅ FIXED pre-save middleware (NO next)
gramSevakAssignedIssueSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

// ✅ Safe export with fixed model
module.exports =
  mongoose.models.GramSevakAssignedIssue ||
  mongoose.model(
    'GramSevakAssignedIssue',
    gramSevakAssignedIssueSchema,
    'gramsevak_assigned_issues'
  );
