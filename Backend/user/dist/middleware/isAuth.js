import jwt from "jsonwebtoken";
export const isAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT secret is missing in environment variables");
        }
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // now works with AuthenticateRequest
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized", error });
    }
};
//# sourceMappingURL=isAuth.js.map