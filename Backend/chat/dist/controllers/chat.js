import TryCatch from "../config/TryCatch.js";
import { Chat } from "../models/Chat.js";
import { Messages } from "../models/Messages.js";
import axios from "axios";
export const createNewChat = TryCatch(async (req, res) => {
    // 🔐 requester MUST be logged in
    if (!req.user || !req.user._id) {
        return res.status(401).json({
            message: "User not authenticated",
        });
    }
    const userId = req.user._id;
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
});
export const gellAllchats = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(400).json({
            message: "User id is missing",
        });
    }
    const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });
    const chatwithUserData = await Promise.all(chats.map(async (chat) => {
        // ✅ FIX: ObjectId comparison
        const otherUserId = chat.users.find((id) => id.toString() !== userId.toString());
        const unseenCount = await Messages.countDocuments({
            chatId: chat._id,
            sender: { $ne: userId },
            seen: false,
        });
        try {
            const { data } = await axios.get(`${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`);
            return {
                user: data,
                chat: {
                    ...chat.toObject(),
                    latestMessage: chat.latestMessage || null,
                    unseenCount,
                },
            };
        }
        catch (error) {
            console.log(error);
            return {
                user: { _id: otherUserId, name: "Unknown User" },
                chat: {
                    ...chat.toObject(),
                    latestMessage: chat.latestMessage || null,
                    unseenCount,
                },
            };
        }
    }));
    // ✅ FIX: return response
    return res.status(200).json({
        success: true,
        chats: chatwithUserData,
    });
});
export const sendmessage = TryCatch(async (req, res) => {
    const senderId = req.user?._id;
    const { chatId, text } = req.body;
    const imageFile = req.file;
    if (!senderId) {
        res.status(401).json({
            message: "unauthorized",
        });
        return;
    }
    if (!chatId) {
        res.status(400).json({
            message: "ChatId Required",
        });
        return;
    }
    if (!text && !imageFile) {
        res.status(400).json({
            message: "Either text or image is required",
        });
        return;
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
        res.status(404).json({
            message: "Chat not found",
        });
        return;
    }
    const isUserInChat = chat.users.some((userId) => userId.toString() === senderId.toString());
    if (!isUserInChat) {
        res.status(403).json({
            message: "You are not a participant of this chat",
        });
        return;
    }
    const otherUserId = chat.users.find((userId) => userId.toString() !== senderId.toString());
    if (!otherUserId) {
        res.status(401).json({
            message: "No other user",
        });
        return;
    }
    //socket setup
    let messageData = {
        chatId: chatId,
        sender: senderId,
        seen: false,
        seenAt: undefined,
    };
    if (imageFile) {
        messageData.image = {
            url: imageFile.path,
            publicId: imageFile.filename,
        };
        messageData.messageType = "image";
        messageData.text = text || "";
    }
    else {
        messageData.text = text;
        messageData.messageType = "text";
    }
    const message = new Messages(messageData);
    const savedMessage = await message.save();
    const latestMessageText = imageFile ? "📷 Image" : text;
    await Chat.findByIdAndUpdate(chatId, {
        latestMessage: {
            text: latestMessageText,
            sender: senderId,
        },
        updatedAt: new Date(),
    }, { new: true });
    //emiting of sockets
    res.status(201).json({
        message: savedMessage,
        sender: senderId,
    });
});
export const getMessagesByChat = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    const { chatId } = req.params;
    if (!userId) {
        res.status(401).json({
            message: "Unauthorized",
        });
        return;
    }
    if (!chatId) {
        res.status(400).json({
            message: "ChatId Required",
        });
        return;
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
        res.status(404).json({
            message: "Chat not found",
        });
        return;
    }
    const isUserInChat = chat.users.some((userId) => userId.toString() === userId.toString());
    if (!isUserInChat) {
        res.status(403).json({
            message: "You are not a participant of this chat",
        });
        return;
    }
    const messagesToMarkSeen = await Messages.find({
        chatId: chatId,
        sender: { $ne: userId },
        seen: false,
    });
    await Messages.updateMany({
        chatId: chatId,
        sender: { $ne: userId },
        seen: false,
    }, {
        seen: true,
        seenAt: new Date(),
    });
    const messages = await Messages.find({ chatId }).sort({ createdAt: 1 });
    const otherUserId = chat.users.find((id) => id !== userId);
    try {
        const { data } = await axios.get(`${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`);
        if (!otherUserId) {
            res.status(400).json({
                message: "No other user",
            });
            return;
        }
        //   //socket work
        //   if (messagesToMarkSeen.length > 0) {
        //     const otherUserSocketId = getRecieverSocketId(otherUserId.toString());
        //     if (otherUserSocketId) {
        //       io.to(otherUserSocketId).emit("messagesSeen", {
        //         chatId: chatId,
        //         seenBy: userId,
        //         messageIds: messagesToMarkSeen.map((msg) => msg._id),
        //       });
        //     }
        //   }
        res.json({
            messages,
            user: data,
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            messages,
            user: { _id: otherUserId, name: "Unknown User" },
        });
    }
});
//# sourceMappingURL=chat.js.map