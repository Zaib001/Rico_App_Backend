const User = require("../models/User");
const Filter = require("../models/Filter");
const multer = require("multer");
const path = require("path");
const io = require('../app').io; // Ensure this points to the correct file where `io` is initialized
const Notification = require("../models/Notification");


// Setup Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Adjust the limit as needed
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|wav|mp3/; // Added support for audio files
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Only JPEG, JPG, PNG, and audio files are allowed"));
  },
}).fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "galleryPics", maxCount: 10 }, // Limit for gallery pictures
  { name: "audioBio", maxCount: 1 },
]);

// **Create Profile with Filters and Files**
// Controller code snippet for creating or updating profile
exports.createProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const { filters, bio } = JSON.parse(req.body.data);
      const userId = req.user._id;

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found." });

      // Process files to strings and ensure they're either strings or null
      const profilePicturePath = req.files.profilePicture
        ? `/uploads/${req.files.profilePicture[0].filename}`
        : null;
      const audioBioPath = req.files.audioBio
        ? `/uploads/${req.files.audioBio[0].filename}`
        : null;
      const galleryPicsPaths = req.files.galleryPics
        ? req.files.galleryPics.map((file) => `/uploads/${file.filename}`)
        : [];

      // Ensure fields are strings or null to prevent Mongoose casting errors
      const sanitizedProfilePicture = profilePicturePath && typeof profilePicturePath === 'string' ? profilePicturePath : null;
      const sanitizedAudioBio = audioBioPath && typeof audioBioPath === 'string' ? audioBioPath : null;

      // Create filter document
      const filterDoc = new Filter({
        user: userId,
        ...filters,
        profilePicture: sanitizedProfilePicture || filters.profilePicture || "",
        audioBio: sanitizedAudioBio || filters.audioBio || "",
        galleryPics: galleryPicsPaths.length ? galleryPicsPaths : filters.galleryPics || [],
      });

      await filterDoc.save();

      // Update user's profile
      user.bio = bio || user.bio;
      user.filters = filterDoc._id;

      await user.save();

      res.status(201).json({
        success: true,
        message: "Profile created successfully",
        user,
        filters: filterDoc,
      });
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).json({ error: "Error creating profile." });
    }
  });
};



// **Update Profile and Filters**
exports.updateProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const { bio, ...filters } = req.body;
      const userId = req.user._id;

      // Find the user and associated filters
      const user = await User.findById(userId).populate("filters");
      if (!user) return res.status(404).json({ error: "User not found" });

      // Update filters
      Object.assign(user.filters, filters);
      await user.filters.save();

      // Update bio and profile picture
      user.bio = bio || user.bio;

      // Handle uploaded files
      if (req.files.profilePicture) {
        user.profilePicture = `/uploads/${req.files.profilePicture[0].filename}`;
      }
      if (req.files.audioBio) {
        user.audioBio = `/uploads/${req.files.audioBio[0].filename}`;
      }
      if (req.files.galleryPics) {
        user.galleryPics = req.files.galleryPics.map(file => `/uploads/${file.filename}`);
      }

      await user.save();
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Error updating profile." });
    }
  });
};

// **Block User**
exports.blockUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.blockedUsers.includes(userId)) {
      return res.status(400).json({ error: "User already blocked" });
    }

    user.blockedUsers.push(userId);
    await user.save();

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ error: "Error blocking user." });
  }
};

// **Unblock User**
exports.unblockUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const index = user.blockedUsers.indexOf(userId);
    if (index === -1) {
      return res.status(400).json({ error: "User not blocked" });
    }

    user.blockedUsers.splice(index, 1);
    await user.save();

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ error: "Error unblocking user." });
  }
};
// **Report User**
exports.reportUser = async (req, res) => {
  const { userId } = req.params;
  const { reportReason } = req.body; // Reason for reporting the user

  try {
    // Find the user who is reporting another user
    const reportingUser = await User.findById(req.user._id);
    if (!reportingUser) return res.status(404).json({ error: "Reporting user not found" });

    // Find the user being reported
    const reportedUser = await User.findById(userId);
    if (!reportedUser) return res.status(404).json({ error: "User to be reported not found" });

    // Add a report entry
    reportedUser.reports = reportedUser.reports || [];
    reportedUser.reports.push({
      reportedBy: req.user._id,
      reason: reportReason || "No specific reason provided",
      date: new Date(),
    });

    await reportedUser.save();

    res.status(200).json({ message: "User reported successfully" });
  } catch (error) {
    console.error("Error reporting user:", error);
    res.status(500).json({ error: "Error reporting user." });
  }
};

// Handle liking a user
exports.likeUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot like yourself" });
    }

    const user = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!user || !currentUser) return res.status(404).json({ message: "User not found" });

    if (user.receivedLikes.includes(currentUserId)) {
      return res.status(400).json({ message: "You have already liked this user" });
    }

    user.receivedLikes.push(currentUserId);
    await user.save();

    currentUser.likedUsers.push(userId);
    await currentUser.save();

    io.to(`user-${userId}`).emit("notification", {
      type: "like",
      message: `User ${currentUserId} liked your profile!`,
    });

    if (user.likedUsers.includes(currentUserId)) {
      user.matches.push(currentUserId);
      currentUser.matches.push(userId);

      await user.save();
      await currentUser.save();

      io.to(`user-${userId}`).emit("notification", { type: "match", message: "You have a new match!" });
      io.to(`user-${currentUserId}`).emit("notification", { type: "match", message: "You have a new match!" });
    }

    res.status(200).json({ message: "User liked successfully" });
  } catch (error) {
    console.error("Error liking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.acceptLike = async (req, res) => {
  try {
    const { userId } = req.params; // ID of the user whose like is being accepted
    const currentUserId = req.user._id; // Logged-in user

    const user = await User.findById(userId); // User who sent the like
    const currentUser = await User.findById(currentUserId); // User accepting the like

    if (!user || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current user is in the likedUsers array of the user who sent the like
    if (!user.likedUsers.includes(currentUserId)) {
      return res.status(400).json({ message: "No like to accept or already matched" });
    }

  

    // Add each user to the other's matches array
    user.matches.push(currentUserId);
    currentUser.matches.push(userId);

    // Save changes to both users
    await user.save();
    await currentUser.save();

    // Create a notification for the user whose like was accepted
    user.acceptedLikesNotifications.push({
      fromUser: userId,
      date: new Date(),
    });
    await user.save();

    res.status(200).json({
      success: true,
      message: "Like accepted, you are now matched",
      user: {
        _id: user._id,
        name: user.name,
        accepted:true
      },
    });
  } catch (error) {
    console.error("Error accepting like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};





exports.getLikedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user with their received likes populated
    const user = await User.findById(userId).populate('receivedLikes', 'name email'); // Adjust the fields as needed
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the list of users who liked the current user
    res.status(200).json({ success: true, likedUsers: user.receivedLikes });
  } catch (error) {
    console.error('Error fetching liked users:', error);
    res.status(500).json({ error: 'Error fetching liked users' });
  }
};
exports.getAcceptedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user with their accepted likes notifications populated
    const user = await User.findById(userId).populate('acceptedLikesNotifications.fromUser', 'name email');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the accepted like notifications
    res.status(200).json({ success: true, acceptedLikes: user.acceptedLikesNotifications });
  } catch (error) {
    console.error('Error fetching accepted likes notifications:', error);
    res.status(500).json({ error: 'Error fetching accepted likes notifications' });
  }
};
