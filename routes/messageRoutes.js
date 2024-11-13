const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');
const rateLimiter = require('../middlewares/rateLimiter');
const multer = require('multer');
const { body } = require('express-validator');

const upload = multer({ dest: 'uploads/' }); // For handling file uploads

const router = express.Router();

router.post(
  '/send', 
  authMiddleware,
  rateLimiter, 
  upload.single('audioFile'),
  [
    body('receiverId').isMongoId().withMessage('Invalid receiver ID'),
    body('message').notEmpty().withMessage('Message content is required'),
    body('messageType').isIn(['text', 'audio']).withMessage('Invalid message type'),
  ],
  sendMessage
);

router.get('/:receiverId', authMiddleware, getMessages);

module.exports = router;
