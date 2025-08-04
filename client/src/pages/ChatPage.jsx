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

  // Load all conversations for logged-in user
  useEffect(() => {
    const fetchConversations = async () => {
      const res = await axios.get(`/api/messages/conversations/${user._id}`);
      setConversations(res.data);
    };
    fetchConversations();
  }, [user._id]);

  // Fetch messages of selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;
      const res = await axios.get(`/api/messages/${selectedConversation._id}`);
      setMessages(res.data);
    };
    fetchMessages();
  }, [selectedConversation]);

  // Socket setup
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

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const payload = {
      senderId: user._id,
      receiverId:
        selectedConversation.members.find((id) => id !== user._id),
      text: newMessage,
      conversationId: selectedConversation._id,
    };

    const res = await axios.post("/api/messages", payload);
    setMessages([...messages, res.data]);
    setNewMessage("");
    socket.emit("sendMessage", res.data);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen">
      {/* Left: Conversations */}
      <div className="w-1/3 border-r overflow-y-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Inbox</h2>
        {conversations.map((conv) => (
          <div
            key={conv._id}
            onClick={() => setSelectedConversation(conv)}
            className={`p-3 rounded cursor-pointer mb-2 ${
              selectedConversation?._id === conv._id ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
          >
            Chat with {conv.members.find((id) => id !== user._id)}
          </div>
        ))}
      </div>

      {/* Right: Chat Thread */}
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div
                  key={msg._id || i}
                  ref={scrollRef}
                  className={`mb-2 p-2 max-w-xs rounded-lg text-sm ${
                    msg.senderId === user._id
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex items-center">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border rounded px-4 py-2 mr-2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
