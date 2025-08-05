import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import socket from "../socket";
import { useAuth } from "../context/AuthContext";

const ChatPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  // Fetch conversations
  useEffect(() => {
    if (!user?._id) return;

    const fetchConversations = async () => {
      try {
        const res = await axios.get(`/api/messages/conversations/${user._id}`);
        setConversations(res.data);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      }
    };

    fetchConversations();
  }, [user._id]);

  // Fetch messages when conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;
      try {
        const res = await axios.get(`/api/messages/${selectedConversation._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  // Handle real-time socket communication
  useEffect(() => {
    socket.emit("join", user._id);

    socket.on("newMessage", (msg) => {
      if (msg.conversationId === selectedConversation?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedConversation, user._id]);

  // Send a new message
  const handleSend = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed || !selectedConversation) return;

    const receiverId = selectedConversation.members.find((id) => id !== user._id);
    const payload = {
      senderId: user._id,
      receiverId,
      text: trimmed,
      conversationId: selectedConversation._id,
    };

    try {
      const res = await axios.post("/api/messages", payload);
      setMessages((prev) => [...prev, res.data]);
      socket.emit("sendMessage", res.data);
      setNewMessage("");
    } catch (err) {
      console.error("Message send failed:", err);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-[90vh] rounded-xl shadow-lg overflow-hidden bg-white border mx-auto max-w-6xl mt-6">
      {/* Left Panel - Conversations */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Inbox</h2>
        {conversations.length === 0 && (
          <p className="text-sm text-gray-500">No conversations found.</p>
        )}
        {conversations.map((conv) => {
          const partnerId = conv.members.find((id) => id !== user._id);
          return (
            <div
              key={conv._id}
              onClick={() => setSelectedConversation(conv)}
              className={`p-3 mb-2 rounded cursor-pointer transition-all ${
                selectedConversation?._id === conv._id
                  ? "bg-blue-100 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              Chat with <span className="text-blue-600">{partnerId}</span>
            </div>
          );
        })}
      </div>

      {/* Right Panel - Chat */}
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  ref={index === messages.length - 1 ? scrollRef : null}
                  className={`max-w-[70%] mb-2 p-3 rounded-lg text-sm ${
                    msg.senderId === user._id
                      ? "ml-auto bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t flex items-center">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border rounded-lg px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
