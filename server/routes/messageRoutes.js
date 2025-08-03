import express from "express";
import {
  sendMessage,
  getMessages,
  getRecentChats,
} from "../controllers/messageController.js";
import { protectRoute } from "../middleware/privateRoutes.js";

const router = express.Router();

router.post("/", protectRoute, sendMessage);
router.get("/recent", protectRoute, getRecentChats);
router.get("/:userId", protectRoute, getMessages);

export default router;
