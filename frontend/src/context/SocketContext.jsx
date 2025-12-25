import { createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { notifyInfo } from '../components/NotificationToast';

const SocketContext = createContext();

const socket = io('http://localhost:5000'); // backend चा URL

export function SocketProvider({ children }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socket.emit('joinVillage', user.village);

      socket.on('issueCreated', (issue) => {
        notifyInfo(`नवीन समस्या: ${issue.title}`);
      });

      socket.on('issueUpdated', (data) => {
        notifyInfo(`समस्या update: ${data.title}`);
      });
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);