import { Response } from "express";
import TryCatch from "../config/TryCatch.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import { Chat } from "../models/Chat.js";

export const createNewChat = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {

    // 🔐 requester MUST be logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const userId = req.user.id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      return res.status(400).json({
        message: "Other userId is required",
      });
    }

    // ❌ prevent self chat
    if (userId === otherUserId) {
      return res.status(400).json({
        message: "You cannot chat with yourself",
      });
    }

    // ✅ check existing chat
    const existingChat = await Chat.findOne({
      users: { $all: [userId, otherUserId], $size: 2 },
    });

    if (existingChat) {
      return res.status(200).json({
        message: "Chat already exists",
        chatId: existingChat._id,
      });
    }

    // ✅ create chat
    const newChat = await Chat.create({
      users: [userId, otherUserId],
    });

    return res.status(201).json({
      message: "Chat created",
      chatId: newChat._id,
    });
  }
);
