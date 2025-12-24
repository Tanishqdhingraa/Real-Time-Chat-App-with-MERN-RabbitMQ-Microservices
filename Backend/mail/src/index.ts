import express from "express";
import dotenv from "dotenv";
import { startsentoptcosnumer } from "./consumer.js";


dotenv.config();
const app = express();

const PORT = process.env.PORT || 3001;

startsentoptcosnumer();


app.get("/", (req, res) => {
  res.send("ITS WORKING CORRECTLY");
});

app.listen(PORT, () => {
  console.log(`❤️  Server of mail-service is running at http://localhost:${PORT}`);
});
