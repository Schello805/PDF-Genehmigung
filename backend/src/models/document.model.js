const mongoose = require('mongoose');

const signatureFieldSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  page: { type: Number, required: true },
  order: { type: Number },
  signedBy: {
    name: String,
    email: String,
    timestamp: Date,
    signature: String,
    comment: String
  }
});

const documentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  createdBy: {
    name: String,
    email: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  signatureFields: [signatureFieldSchema],
  accessToken: { type: String, required: true },
  auditLog: [{
    action: String,
    performedBy: {
      name: String,
      email: String
    },
    timestamp: { type: Date, default: Date.now },
    details: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

documentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Document', documentSchema);
