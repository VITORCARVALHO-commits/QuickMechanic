import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import socketService from '../services/socket';

export const ChatWidget = ({ orderId, otherUserId, otherUserName }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      socketService.connect(user.id);
      
      socketService.onNewMessage((msg) => {
        if (msg.order_id === orderId) {
          setMessages(prev => [...prev, msg]);
          if (!isOpen) {
            setUnreadCount(prev => prev + 1);
          }
        }
      });

      socketService.onMessageSent((msg) => {
        if (msg.order_id === orderId) {
          setMessages(prev => [...prev, msg]);
        }
      });

      loadMessages();
    }

    return () => {
      socketService.disconnect();
    };
  }, [user, orderId]);

  useEffect(() => {
    scrollToBottom();
    if (isOpen && unreadCount > 0) {
      setUnreadCount(0);
      socketService.markRead(orderId, user.id);
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/chat/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
        const unread = data.data.filter(m => m.to_user === user.id && !m.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      socketService.sendMessage(user.id, otherUserId, newMessage, orderId);
      setNewMessage('');
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 bg-[#1EC6C6] hover:bg-[#1AB5B5] shadow-lg relative"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96">
      <Card className="shadow-xl">
        <div className="bg-[#1EC6C6] text-white p-4 rounded-t-lg flex justify-between items-center">
          <div>
            <h3 className="font-bold">Chat</h3>
            <p className="text-sm">{otherUserName}</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg, idx) => {
            const isMe = msg.from_user === user.id;
            return (
              <div key={idx} className={`mb-3 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-lg ${
                  isMe ? 'bg-[#1EC6C6] text-white' : 'bg-white text-gray-800'
                }`}>
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua mensagem..."
          />
          <Button onClick={handleSend} className="bg-[#1EC6C6] hover:bg-[#1AB5B5]">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
