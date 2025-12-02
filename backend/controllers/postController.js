const Post = require('../models/Post');
const { containsProfanity, sanitizeText } = require('../utils/moderation');
const cloudinary = require('../config/cloudinary');

exports.createPost = async (req, res) => {
  try {
    const { text, visibility } = req.body;
    let imageUrl = '';

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, { folder: 'kidsocial/posts' });
      imageUrl = upload.secure_url;
    }

    if (containsProfanity(text)) return res.status(400).json({ error: 'Inappropriate content' });

    const p = new Post({
      author: req.user._id,
      text: sanitizeText(text),
      image: imageUrl,
      visibility: visibility || 'friends'
    });
    await p.save();
    res.json({ ok: true, post: p });
  } catch (err) {
    console.error(err); res.status(500).json({ error: 'Server error' });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username displayName avatarUrl').sort({ createdAt: -1 }).limit(100);
    res.json({ posts });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' });}
};
