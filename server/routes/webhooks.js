import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Order from "../models/Order.js";
import Job from "../models/Job.js";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("⚠️ Webhook signature verification failed.", err.message);
      return res.sendStatus(400);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        const jobId = session.metadata.jobId;
        const buyerId = session.metadata.buyerId;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        const order = new Order({
          jobId,
          gigId: jobId, // alias for clarity
          buyerId,
          sellerId: job.postedBy,
          price: session.amount_total / 100,
          status: "pending",
        });

        await order.save();
        console.log("✅ Order created via webhook");
      } catch (error) {
        console.error("❌ Webhook order creation failed:", error.message);
      }
    }

    res.sendStatus(200);
  }
);

export default router;
