import Message from "../models/Message.js";
import User from "../models/User.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const sender = req.user.id;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "receiverId and text are required" });
    }

    const newMessage = await Message.create({ sender, receiver: receiverId, text });
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Send Message Error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUser = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: loggedInUser, receiver: userId },
        { sender: userId, receiver: loggedInUser },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Get Messages Error:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const getRecentChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", userId] },
              "$receiver",
              "$sender",
            ],
          },
          lastMessage: { $first: "$text" },
          timestamp: { $first: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          avatar: "$user.avatar",
          lastMessage: 1,
          timestamp: 1,
        },
      },
      { $sort: { timestamp: -1 } },
    ]);

    res.status(200).json(chats);
  } catch (err) {
    console.error("Get Recent Chats Error:", err);
    res.status(500).json({ message: "Failed to fetch recent chats" });
  }
};
