const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  displayName: { type: String, required: true },
  email: { type: String },
  passwordHash: { type: String },
  age: { type: Number, required: true },
  role: { type: String, enum: ['kid','guardian','moderator','admin'], default: 'kid' },
  private: { type: Boolean, default: true },
  guardian: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  guardianApproved: { type: Boolean, default: false },
  avatarUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  banned: { type: Boolean, default: false }
});

UserSchema.methods.setPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(password, salt);
};

UserSchema.methods.validatePassword = async function(password) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
