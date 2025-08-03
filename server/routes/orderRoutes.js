import express from "express";
import {
  getOrdersByUserRole,
} from "../controllers/orderController.js";
import { protectRoute } from "../middleware/privateRoutes.js";

const router = express.Router();
const Order = require('../models/Order');

router.get("/", protectRoute, getOrdersByUserRole);
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ clientId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

export default router;
