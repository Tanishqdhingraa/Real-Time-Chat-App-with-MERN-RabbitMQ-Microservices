import jwt from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Please login - NO AUTH HEADER",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized: Invalid token" });
            return;
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT secret is missing in environment variables");
        }
        // ✅ Decode the JWT payload
        const decoded = jwt.verify(token, secret);
        // ✅ Map the payload to match IUser interface
        req.user = {
            _id: decoded.id, // required by IUser
            name: decoded.name || "", // optional fallback
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
export default isAuth;
