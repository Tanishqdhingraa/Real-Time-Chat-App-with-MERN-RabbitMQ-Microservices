import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import { createClient } from "redis";
import cors from 'cors';
import userRoutes from "./routes/user.js";
import { connectRabbitMq } from "./config/rabbitmq.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;
connectDb();
connectRabbitMq();
//ROUTES 
app.use('/api/v1', userRoutes);
// ---------------- REDIS INITIALIZATION ---------------- //
if (!process.env.REDIS_URL) {
    console.error("❌ FATAL: REDIS_URL is missing in your environment variables.");
    throw new Error("Environment variable REDIS_URL is required but not found.");
}
export const redisclient = createClient({
    url: process.env.REDIS_URL,
});
// Log all Redis-level errors
redisclient.on("error", (err) => {
    console.error("🚨 [Redis Error]", {
        message: err.message,
        stack: err.stack,
        code: err.code,
    });
});
// More useful connection logs
redisclient.on("connect", () => {
    console.log("🔄 Attempting to connect to Redis...");
});
redisclient.on("ready", () => {
    console.log("✅ Redis is ready and operational.");
});
redisclient.on("reconnecting", () => {
    console.warn("♻️ Redis reconnecting...");
});
redisclient.on("end", () => {
    console.warn("🔌 Redis connection closed.");
});
// ----------- CONNECT TO REDIS WITH DEBUG LOGGING ---------- //
redisclient
    .connect()
    .then(() => console.log("🎉 Redis Connected Successfully!\n"))
    .catch((err) => {
    console.error("❌ Redis Connection Failed:", {
        message: err.message,
        stack: err.stack,
        code: err.code,
    });
});
app.get("/", (req, res) => {
    res.send("ITS WORKING  CORRECTLY");
});
app.listen(PORT, () => {
    console.log(`❤️  Server of user-service  is running at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map