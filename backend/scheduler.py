import asyncio
import logging
from datetime import datetime, timezone, timedelta
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from email_service import send_email
from sms_service import sms_reminder_24h, sms_reminder_1h

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

async def check_reminders_24h():
    """Check for services 24h from now"""
    from server import db
    
    try:
        tomorrow = datetime.now(timezone.utc) + timedelta(days=1)
        tomorrow_str = tomorrow.strftime('%Y-%m-%d')
        
        orders = await db.quotes.find({
            'status': 'paid',
            'date': tomorrow_str
        }, {'_id': 0}).to_list(100)
        
        for order in orders:
            client = await db.users.find_one({'id': order['client_id']}, {'_id': 0})
            if client and client.get('phone'):
                sms_reminder_24h(
                    client['name'],
                    client['phone'],
                    order['service'],
                    order['date'],
                    order['time']
                )
                logger.info(f"Sent 24h reminder for order {order['id']}")
    except Exception as e:
        logger.error(f"Error in 24h reminder job: {str(e)}")

async def check_reminders_1h():
    """Check for services 1h from now"""
    from server import db
    
    try:
        now = datetime.now(timezone.utc)
        one_hour_later = now + timedelta(hours=1)
        
        orders = await db.quotes.find({
            'status': 'paid',
            'date': now.strftime('%Y-%m-%d')
        }, {'_id': 0}).to_list(100)
        
        for order in orders:
            order_time = datetime.strptime(order['time'], '%H:%M').time()
            order_datetime = datetime.combine(now.date(), order_time)
            
            if abs((order_datetime - one_hour_later).total_seconds()) < 300:  # Within 5 min
                client = await db.users.find_one({'id': order['client_id']}, {'_id': 0})
                if client and client.get('phone'):
                    sms_reminder_1h(client['name'], client['phone'], order['service'], order['time'])
                    logger.info(f"Sent 1h reminder for order {order['id']}")
    except Exception as e:
        logger.error(f"Error in 1h reminder job: {str(e)}")

async def cleanup_old_data():
    """Cleanup data older than 90 days"""
    from server import db
    
    try:
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=90)
        cutoff_str = cutoff_date.isoformat()
        
        # Delete old notifications
        result = await db.notifications.delete_many({'created_at': {'$lt': cutoff_str}, 'read': True})
        logger.info(f"Cleaned up {result.deleted_count} old notifications")
        
        # Archive old orders
        await db.quotes.update_many(
            {'created_at': {'$lt': cutoff_str}, 'status': 'completed'},
            {'$set': {'archived': True}}
        )
    except Exception as e:
        logger.error(f"Error in cleanup job: {str(e)}")

def start_scheduler():
    """Start background jobs"""
    # Check 24h reminders at 9 AM daily
    scheduler.add_job(check_reminders_24h, CronTrigger(hour=9, minute=0))
    
    # Check 1h reminders every hour
    scheduler.add_job(check_reminders_1h, CronTrigger(minute=0))
    
    # Cleanup weekly on Sunday at 2 AM
    scheduler.add_job(cleanup_old_data, CronTrigger(day_of_week='sun', hour=2, minute=0))
    
    scheduler.start()
    logger.info("Scheduler started")
