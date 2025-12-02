const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, trim: true, maxlength: 1000 },
  image: { type: String, default: '' },
  visibility: { type: String, enum: ['friends','public','private'], default: 'friends' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }]
});

module.exports = mongoose.model('Post', PostSchema);
