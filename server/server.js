import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Route Imports
import jobRoutes from "./routes/jobs.js";
import stripeRoutes from "./routes/stripe.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payment.js";
import webhookRoutes from "./routes/webhooks.js";
import messageRoutes from "./routes/messageRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ["GET", "POST"],
  },
});


app.set("io", io); // Optional: make io accessible in routes/controllers if needed

// ✅ Online Users Map
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    socket.userId = userId;
    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    console.log(`👤 User ${userId} joined room and is now online.`);
  });

  socket.on("typing", ({ receiverId }) => {
    io.to(receiverId).emit("typing", { userId: socket.userId });
  });

  socket.on("stopTyping", ({ receiverId }) => {
    io.to(receiverId).emit("stopTyping", { userId: socket.userId });
  });

  socket.on("sendMessage", ({ senderId, receiverId, content }) => {
    const timestamp = new Date();

    // Emit to receiver if online
    if (receiverId && onlineUsers.has(receiverId)) {
      io.to(receiverId).emit("receiveMessage", {
        senderId,
        content,
        timestamp,
      });

      // Emit to receiver to update their conversation list
      io.to(receiverId).emit("newConversation", {
        userId: senderId,
        lastMessage: content,
        timestamp,
      });
    }

    // Emit to sender to update their own conversation list
    socket.emit("newConversation", {
      userId: receiverId,
      lastMessage: content,
      timestamp,
    });

    console.log(`✉️ Message from ${senderId} to ${receiverId}: ${content}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    }
  });
});

// ✅ Express Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/jobs", jobRoutes);
app.use("/api", stripeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/webhook", webhookRoutes); // Stripe webhook route
app.use("/api/messages", messageRoutes);
app.use("/api/reviews", reviewRoutes);

// ✅ MongoDB Connection + Server Start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
