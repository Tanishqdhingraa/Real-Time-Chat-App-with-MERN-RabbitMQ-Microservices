import { generateToken } from "../config/generateToken.js";
import { publishtoQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisclient } from "../index.js";
import { User } from "../model/User.js";
// ========================
// LOGIN — SEND OTP
// ========================
export const loginUser = TryCatch(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    const rateLimitKey = `otp:ratelimit:${email}`;
    const rateLimitExists = await redisclient.get(rateLimitKey);
    // Block if already requested recently
    if (rateLimitExists) {
        return res.status(429).json({
            message: "Too many requests. Please wait before requesting a new OTP.",
        });
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${email}`;
    // Store OTP for 5 minutes
    await redisclient.set(otpKey, otp, {
        EX: 300, // 5 minutes
    });
    // Rate limit for 60 seconds
    await redisclient.set(rateLimitKey, "true", {
        EX: 60,
    });
    const message = {
        to: email,
        subject: "Your OTP Code",
        body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };
    // Push OTP message to RabbitMQ
    await publishtoQueue("send-otp", message);
    return res.status(200).json({
        message: "OTP sent to your email.",
    });
});
// ========================
// VERIFY OTP
// ========================
export const verifyUser = TryCatch(async (req, res) => {
    const { email, otp: enteredOtp } = req.body;
    if (!email || !enteredOtp) {
        return res.status(400).json({
            message: "Email and OTP both are required",
        });
    }
    const otpKey = `otp:${email}`;
    const storedOtp = await redisclient.get(otpKey);
    // Invalid or expired OTP
    if (!storedOtp || storedOtp !== enteredOtp) {
        return res.status(400).json({
            message: "OTP is expired or invalid",
        });
    }
    // OTP valid → delete it
    await redisclient.del(otpKey);
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
        const name = email.split("@")[0]; // use username part
        user = await User.create({ name, email });
    }
    // Create JWT token
    const token = generateToken(user);
    return res.status(200).json({
        message: "User verified successfully",
        user,
        token,
    });
});
export const myProfile = TryCatch(async (req, res) => {
    const user = req.user;
    res.json(user);
});
export const UpdateYourname = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized, login required" });
    }
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const { name } = req.body;
    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Name is required" });
    }
    user.name = name;
    await user.save();
    const token = generateToken(user);
    return res.status(200).json({
        message: "User updated successfully",
        user,
        token,
    });
});
export const getAllUser = TryCatch(async (req, res) => {
    const users = await User.find();
    res.json(users);
});
export const getAUser = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});
//# sourceMappingURL=user.js.map