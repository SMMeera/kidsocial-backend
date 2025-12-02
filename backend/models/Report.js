const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['post','user','comment','message'] },
  targetId: { type: String },
  reason: { type: String },
  status: { type: String, enum: ['open','reviewed','dismissed'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
