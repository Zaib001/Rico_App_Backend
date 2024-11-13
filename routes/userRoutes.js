const express = require('express');
const { updateProfile,reportUser,getAcceptedUsers ,getLikedUsers,likeUser,acceptLike, createProfile, blockUser, unblockUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// **Create Profile Route (POST)**
router.post('/profile',authMiddleware, createProfile); // Add new user profile

// **Update Profile Route (PUT)**
router.put('/updateProfile', authMiddleware, updateProfile); // Update user profile

// **Block User Route**
router.post('/block-user/:userId', authMiddleware, blockUser); 

// **Unblock User Route**
router.post('/unblock-user/:userId', authMiddleware, unblockUser);

router.post('/report-user/:userId', authMiddleware, reportUser);
router.post('/like-user/:userId', authMiddleware, likeUser);
router.post('/accept-like/:userId', authMiddleware, acceptLike);
router.get('/likedUsers', authMiddleware, getLikedUsers);

router.get('/acceptedLike', authMiddleware, getAcceptedUsers);
module.exports = router;
