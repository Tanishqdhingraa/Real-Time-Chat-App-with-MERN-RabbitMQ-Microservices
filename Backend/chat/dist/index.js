import express from 'express';
import dotenv from "dotenv";
import { connectDb } from './config/db.js';
const app = express();
dotenv.config();
connectDb();
const port = process.env.PORT || 8001;
app.listen(port, () => {
    console.log(`😎  Chat services is running on http://localhost:${port} `);
});
//# sourceMappingURL=index.js.map