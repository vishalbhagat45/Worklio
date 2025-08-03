import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const { jobId, buyerId, sellerId } = session.metadata;

      const order = new Order({
        job: jobId || null,
        buyer: buyerId,
        seller: sellerId,
        amount: session.amount_total / 100,
        status: "in progress",
        paymentIntentId: session.payment_intent,
        isPaid: true,
        paidAt: new Date(),
      });

      await order.save();

      return res.status(200).json({ received: true });
    } catch (err) {
      console.error("Order creation failed:", err);
      return res.status(500).json({ error: "Order creation error" });
    }
  }

  res.status(200).json({ received: true });
});

export default router;
