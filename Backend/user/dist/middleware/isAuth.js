import jwt from "jsonwebtoken";
const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
    throw new Error("JWT_SECRET missing in .env");
}
const JWT_SECRET = rawSecret; // ✔ TS now knows it's ALWAYS a string
export const isAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Please login - Missing token" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded || !decoded.id) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        req.user = {
            _id: decoded.id,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: "JWT verification failed" });
    }
};
//# sourceMappingURL=isAuth.js.map