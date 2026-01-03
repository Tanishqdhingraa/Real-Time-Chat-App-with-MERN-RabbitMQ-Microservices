import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { createNewChat, gellAllchats, getMessagesByChat, sendmessage } from "../controllers/chat.js";
import { upload } from '../middleware/multer.js';
const router = express.Router();
router.post('/chat/new', isAuth, createNewChat);
router.get('/chat/all', isAuth, gellAllchats);
router.post('/message', isAuth, upload.single("image"), sendmessage);
router.get('/message/:chatId', isAuth, getMessagesByChat);
export default router;
//# sourceMappingURL=chat.js.map