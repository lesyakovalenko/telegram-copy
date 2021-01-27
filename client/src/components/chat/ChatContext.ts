import React, { createContext, useContext } from 'react';
import { SocketService } from './chatService';

export const ChatContext: React.Context<SocketService> = createContext(new SocketService());

// functional component context hook
export const useChat = () => useContext(ChatContext);