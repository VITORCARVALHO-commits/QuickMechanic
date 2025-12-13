import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect(userId) {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected');
        if (userId) {
          this.socket.emit('authenticate', { user_id: userId });
        }
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(fromUser, toUser, message, orderId) {
    if (this.socket) {
      this.socket.emit('send_message', {
        from_user: fromUser,
        to_user: toUser,
        message: message,
        order_id: orderId
      });
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('message_sent', callback);
    }
  }

  markRead(orderId, userId) {
    if (this.socket) {
      this.socket.emit('mark_read', {
        order_id: orderId,
        user_id: userId
      });
    }
  }
}

export default new SocketService();
