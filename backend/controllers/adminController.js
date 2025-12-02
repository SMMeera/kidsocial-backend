const Report = require('../models/Report');
const Post = require('../models/Post');
const User = require('../models/User');

exports.getReports = async (req, res) => {
  const reports = await Report.find().populate('reporter').sort({ createdAt: -1 });
  res.json({ reports });
};

exports.takeAction = async (req, res) => {
  const { reportId, action } = req.body;
  const report = await Report.findById(reportId);
  if (!report) return res.status(404).json({ error: 'Not found' });
  if (action === 'dismiss') {
    report.status = 'dismissed';
    await report.save();
    return res.json({ ok: true });
  }
  if (action === 'removePost') {
    await Post.findByIdAndDelete(report.targetId);
    report.status = 'reviewed'; await report.save();
    return res.json({ ok: true });
  }
  if (action === 'banUser') {
    const user = await User.findById(report.targetId);
    if (user) { user.banned = true; await user.save(); }
    report.status = 'reviewed'; await report.save();
    return res.json({ ok: true });
  }
  res.status(400).json({ error: 'Unknown action' });
};
