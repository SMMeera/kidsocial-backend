const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const postController = require('../controllers/postController');
const multer = require('multer');
const upload = multer({ dest: '/tmp/uploads' });

router.get('/', authMiddleware, postController.getFeed);
router.post('/create', authMiddleware, upload.single('image'), postController.createPost);

module.exports = router;
