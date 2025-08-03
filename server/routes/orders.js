import express from "express";
import Order from "../models/Order.js";
import Job from "../models/Job.js";
import { protectRoute } from "../middleware/privateRoutes.js";

const router = express.Router();

// ✅ Create an order (when a buyer places an order)
router.post("/", protectRoute, async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const order = new Order({
      jobId,
      gigId: jobId,
      buyerId: req.user.id,
      sellerId: job.postedBy,
      price: job.price,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// ✅ Get orders for logged-in user (buyer or seller)
router.get("/", protectRoute, async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ buyerId: req.user.id }, { sellerId: req.user.id }],
    })
      .populate("jobId", "title")
      .populate("buyerId", "username")
      .populate("sellerId", "username");

    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ✅ Freelancer delivers work
router.put("/:id/deliver", protectRoute, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: "delivered",
        deliveryMessage: req.body.deliveryMessage,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Deliver error:", error);
    res.status(500).json({ message: "Delivery failed" });
  }
});

// ✅ Client approves work
router.put("/:id/complete", protectRoute, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Completion error:", error);
    res.status(500).json({ message: "Completion failed" });
  }
});

// ✅ Admin fetch with filters
router.get("/admin", protectRoute, async (req, res) => {
  const { buyerId, sellerId } = req.query;
  const filter = {};

  if (buyerId) filter.buyerId = buyerId;
  if (sellerId) filter.sellerId = sellerId;

  try {
    const orders = await Order.find(filter)
      .populate("gigId", "title")
      .populate("buyerId", "username")
      .populate("sellerId", "username");

    res.json(orders);
  } catch (error) {
    console.error("Admin fetch error:", error);
    res.status(500).json({ message: "Failed to fetch admin orders" });
  }
});

export default router;
