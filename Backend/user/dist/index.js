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
/////////////REDIS WORKING ///////////////
if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is missing in .env");
}
export const redisclient = createClient({
    url: process.env.REDIS_URL,
});
// 🔥 Show proper errors instead of crashing your app
redisclient.on("error", (err) => {
    console.error("❌ Redis Connection Error:", err.message);
});
// ✅ Proper connect with correct logging
redisclient
    .connect()
    .then(() => console.log("✅ Redis Connected Successfully"))
    .catch((err) => console.error("❌ Redis Connect Failed:", err));
///////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("ITS WORKING  CORRECTLY");
});
app.listen(PORT, () => {
    console.log(`❤️  Server of user-service  is running at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map