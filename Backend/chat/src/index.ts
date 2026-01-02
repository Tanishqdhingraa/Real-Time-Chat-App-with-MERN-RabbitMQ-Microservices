import express from 'express'
import dotenv from "dotenv";
import { connectDb } from './config/db.js';
import chatRoutes from "./routes/chat.js"
const app = express()

dotenv.config();

connectDb();


app.use(express.json());

app.use("/api/v1", chatRoutes);
 

app.get("/",(req,res) =>{
    res.json(" HELLLO FROM CHAT PORT ")
})

const port = process.env.PORT || 8001; 

app.listen(port,()=>{
    console.log(`😎  Chat services is running on http://localhost:${port} `);
    
})