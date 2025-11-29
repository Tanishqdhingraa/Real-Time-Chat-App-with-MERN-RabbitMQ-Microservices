import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("❌ JWT_SECRET is missing in your .env file");
}
export const generateToken = (user) => {
    return jwt.sign({
        id: user._id,
        email: user.email,
    }, JWT_SECRET, { expiresIn: "15d" });
};
//# sourceMappingURL=generateToken.js.map