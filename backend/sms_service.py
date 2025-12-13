import os
import logging
from datetime import datetime, timezone, timedelta

logger = logging.getLogger(__name__)

# Twilio credentials (add to .env)
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID', '')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN', '')
TWILIO_PHONE_NUMBER = os.environ.get('TWILIO_PHONE_NUMBER', '')

def send_sms(to_phone: str, message: str):
    """Send SMS via Twilio"""
    if not TWILIO_ACCOUNT_SID:
        logger.warning("Twilio not configured - SMS not sent")
        return False
    
    try:
        from twilio.rest import Client
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        msg = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=to_phone
        )
        
        logger.info(f"SMS sent to {to_phone}: {msg.sid}")
        return True
    except Exception as e:
        logger.error(f"Error sending SMS: {str(e)}")
        return False

def sms_reminder_24h(client_name: str, client_phone: str, service: str, date: str, time: str):
    """Send 24h reminder"""
    message = f"Olá {client_name}! Lembrete: seu serviço '{service}' está agendado para amanhã ({date}) às {time}. QuickMechanic"
    return send_sms(client_phone, message)

def sms_reminder_1h(client_name: str, client_phone: str, service: str, time: str):
    """Send 1h reminder"""
    message = f"Olá {client_name}! Seu mecânico chegará em 1 hora (às {time}). QuickMechanic"
    return send_sms(client_phone, message)

def sms_service_completed(client_name: str, client_phone: str, order_id: str):
    """Notify service completed"""
    message = f"Olá {client_name}! Seu serviço #{order_id} foi concluído. Avalie o mecânico: https://fixconnect-12.preview.emergentagent.com/dashboard"
    return send_sms(client_phone, message)
