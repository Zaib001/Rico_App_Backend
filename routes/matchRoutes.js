const express = require('express');
const { searchMatches } = require('../controllers/matchController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/search', authMiddleware, searchMatches);



module.exports = router;
