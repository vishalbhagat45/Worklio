import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';

export default function Message() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [receiverId, setReceiverId] = useState(""); // hardcode for testing or select from UI later
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!receiverId || !user?.token) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${receiverId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error('Fetch messages failed:', err);
      }
    };

    fetchMessages();

    socket.emit('joinRoom', user._id);

    socket.on('receiveMessage', (msg) => {
      if (msg.senderId === receiverId) {
        setMessages((prev) => [...prev, { sender: msg.senderId, text: msg.content }]);
      }
    });

    socket.on('typing', ({ userId }) => {
      if (userId === receiverId) setIsTyping(true);
    });

    socket.on('stopTyping', ({ userId }) => {
      if (userId === receiverId) setIsTyping(false);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [receiverId, user, socket]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const res = await axios.post(
        '/api/messages',
        { text: message, receiverId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      socket.emit('sendMessage', {
        senderId: user._id,
        receiverId,
        content: message,
      });

      setMessages((prev) => [...prev, res.data]);
      setMessage('');
      socket.emit('stopTyping', { receiverId });
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit('typing', { receiverId });
    }

    const lastTypingTime = new Date().getTime();
    setTimeout(() => {
      const now = new Date().getTime();
      if (now - lastTypingTime >= 3000 && typing) {
        socket.emit('stopTyping', { receiverId });
        setTyping(false);
      }
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col border rounded shadow">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded w-fit max-w-[70%] ${
              msg.sender === user._id ? 'ml-auto bg-green-100' : 'mr-auto bg-gray-100'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isTyping && <p className="text-sm italic text-gray-400">Typing...</p>}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center p-3 border-t">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={handleTyping}
          className="flex-1 border p-2 rounded mr-2"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
