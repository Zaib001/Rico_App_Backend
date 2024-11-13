const { check, validationResult } = require("express-validator");
const Message = require("../models/Message");
const User = require("../models/User");
const socketIO = require("../config/socket");

const cloudStorage = require("../services/cloudStorage");
const analyticsService = require("../services/analyticsService");
const rateLimiter = require("../middlewares/rateLimiter");

exports.sendMessage = async (req, res) => {
  // Step 1: Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { receiverId, message, messageType } = req.body;

  try {
    // Step 2: Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    let audioFilePath = null;

    // Step 3: Handle audio file upload if applicable
    if (messageType === "audio" && req.file) {
      try {
        const uploadedFile = await cloudStorage.uploadFile(req.file);
        audioFilePath = uploadedFile.Location;
      } catch (uploadError) {
        console.error("Error uploading audio file:", uploadError);
        return res.status(500).json({ error: "Error uploading audio file" });
      }
    }

    // Step 4: Create the new message
    const newMessage = new Message({
      sender: req.user._id,
      receiver: receiverId,
      message,
      messageType,
      audioFile: audioFilePath,
    });
    await newMessage.save();

    // Step 5: Emit real-time message via Socket.io
    socketIO.to(receiverId).emit("newMessage", {
      sender: req.user,
      message: newMessage,
    });

    // Step 6: Log the messaging activity
    await analyticsService.logMessageActivity(req.user._id, receiverId);

    

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Error sending message" });
  }
};

exports.getMessages = async (req, res) => {
  const { receiverId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;

  try {
    // Step 1: Validate if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    // Step 2: Paginated message retrieval
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: receiverId },
        { sender: receiverId, receiver: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      page,
      limit,
      totalMessages: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
};
