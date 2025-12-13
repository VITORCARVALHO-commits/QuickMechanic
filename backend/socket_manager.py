import socketio
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=True,
    engineio_logger=True
)

# Store active connections
active_users = {}  # {user_id: sid}

@sio.event
async def connect(sid, environ):
    logger.info(f"Client connected: {sid}")
    await sio.emit('connected', {'sid': sid}, room=sid)

@sio.event
async def disconnect(sid):
    # Remove from active users
    for user_id, user_sid in list(active_users.items()):
        if user_sid == sid:
            del active_users[user_id]
            logger.info(f"User {user_id} disconnected")
            break
    logger.info(f"Client disconnected: {sid}")

@sio.event
async def authenticate(sid, data):
    """User authenticates with socket"""
    user_id = data.get('user_id')
    if user_id:
        active_users[user_id] = sid
        await sio.emit('authenticated', {'user_id': user_id}, room=sid)
        logger.info(f"User {user_id} authenticated on socket {sid}")

@sio.event
async def send_message(sid, data):
    """Send chat message"""
    try:
        from_user = data.get('from_user')
        to_user = data.get('to_user')
        message = data.get('message')
        order_id = data.get('order_id')
        
        # Save to database
        from server import db
        message_doc = {
            'id': str(datetime.now(timezone.utc).timestamp()),
            'order_id': order_id,
            'from_user': from_user,
            'to_user': to_user,
            'message': message,
            'created_at': datetime.now(timezone.utc).isoformat(),
            'read': False
        }
        
        await db.messages.insert_one(message_doc)
        
        # Send to recipient if online
        if to_user in active_users:
            recipient_sid = active_users[to_user]
            await sio.emit('new_message', message_doc, room=recipient_sid)
        
        # Confirm to sender
        await sio.emit('message_sent', message_doc, room=sid)
        
        logger.info(f"Message from {from_user} to {to_user}")
    except Exception as e:
        logger.error(f"Error sending message: {str(e)}")
        await sio.emit('error', {'message': str(e)}, room=sid)

@sio.event
async def mark_read(sid, data):
    """Mark messages as read"""
    try:
        from server import db
        order_id = data.get('order_id')
        user_id = data.get('user_id')
        
        await db.messages.update_many(
            {'order_id': order_id, 'to_user': user_id},
            {'$set': {'read': True}}
        )
        
        await sio.emit('marked_read', {'order_id': order_id}, room=sid)
    except Exception as e:
        logger.error(f"Error marking read: {str(e)}")
