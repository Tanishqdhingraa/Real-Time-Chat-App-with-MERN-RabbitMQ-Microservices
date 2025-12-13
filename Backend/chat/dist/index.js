import express from 'express';
import dotenv from "dotenv";
const app = express();
dotenv.config();
const port = process.env.PORT || 8001;
app.listen(port, () => {
    console.log(`Chat services is running on http://localhost:${port} `);
});
//# sourceMappingURL=index.js.map