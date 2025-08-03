import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const auth = useAuth();
  const user = auth?.user || null;
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (user && user.token) {
      const newSocket = io('http://localhost:5000', {
        query: { userId: user._id },
        auth: { token: user.token },
        transports: ['websocket'],
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to socket.io');
      });

      newSocket.on('online-users', (users) => {
        setOnlineUsers(users);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from socket.io');
      });

      return () => newSocket.disconnect();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
