const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { permit } = require('../middleware/roles');
const admin = require('../controllers/adminController');

router.get('/reports', auth, permit('moderator','admin'), admin.getReports);
router.post('/action', auth, permit('moderator','admin'), admin.takeAction);

module.exports = router;
