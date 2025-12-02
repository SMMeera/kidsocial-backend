const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/email');

function createToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

exports.signup = async (req, res) => {
  try {
    const { username, displayName, password, age, email, role } = req.body;
    if (!username || !displayName || typeof age === 'undefined') return res.status(400).json({ error: 'Missing data' });
    if (age < 6 || age > 18) return res.status(400).json({ error: 'Age not allowed' });

    let user = new User({ username, displayName, age, email, role: role || 'kid' });
    if (password) await user.setPassword(password);
    await user.save();

    const token = createToken(user);
    res.json({ ok: true, token, user });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Username exists' });
    console.error(err); res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const ok = await user.validatePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid password' });
    const token = createToken(user);
    res.json({ ok: true, token, user });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
};

exports.inviteGuardian = async (req, res) => {
  try {
    const { childId, guardianEmail } = req.body;
    const child = await User.findById(childId);
    if (!child) return res.status(404).json({ error: 'Child not found' });
    const token = jwt.sign({ childId, guardianEmail }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const link = `${process.env.FRONTEND_URL}/guardian/approve?token=${token}`;
    await sendMail(guardianEmail, 'KidSocial Guardian Approval', `<p>Please click <a href="${link}">here</a> to approve account for ${child.displayName}.</p>`);
    res.json({ ok: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
};

exports.guardianApprove = async (req, res) => {
  try {
    const { token, accept, guardianId } = req.body;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const child = await User.findById(payload.childId);
    if (!child) return res.status(404).json({ error: 'Child not found' });
    if (accept) {
      if (guardianId) child.guardian = guardianId;
      child.guardianApproved = true;
      await child.save();
      return res.json({ ok: true, child });
    } else {
      return res.json({ ok: false, msg: 'Guardian rejected' });
    }
  } catch (err) { console.error(err); res.status(400).json({ error: 'Invalid token' });}
};
