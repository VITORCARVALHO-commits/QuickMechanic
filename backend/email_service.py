import os
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

logger = logging.getLogger(__name__)

SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
FROM_EMAIL = os.environ.get('SENDGRID_FROM_EMAIL', 'noreply@clickmecanico.com')

def send_email(to_email: str, subject: str, html_content: str):
    """Send email via SendGrid"""
    if not SENDGRID_API_KEY:
        logger.warning("SendGrid API key not configured")
        return False
    
    try:
        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=to_email,
            subject=subject,
            html_content=html_content
        )
        
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        
        logger.info(f"Email sent to {to_email}: {subject} (Status: {response.status_code})")
        return True
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return False

# Email templates
def email_new_order_to_mechanic(mechanic_email: str, mechanic_name: str, order_id: str, service: str, location: str):
    """Notify mechanic about new order"""
    subject = f"Novo Pedido #{order_id} - ClickMecanico"
    html = f"""
    <h2>Olá {mechanic_name}!</h2>
    <p>Você tem um novo pedido disponível:</p>
    <ul>
        <li><strong>Pedido:</strong> #{order_id}</li>
        <li><strong>Serviço:</strong> {service}</li>
        <li><strong>Local:</strong> {location}</li>
    </ul>
    <p>Acesse o dashboard para enviar seu orçamento.</p>
    <a href="https://fixconnect-12.preview.emergentagent.com/mechanic/dashboard" style="background:#1EC6C6;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Ver Pedido</a>
    """
    return send_email(mechanic_email, subject, html)

def email_quote_to_client(client_email: str, client_name: str, order_id: str, mechanic_name: str, price: float):
    """Notify client about mechanic quote"""
    subject = f"Orçamento Recebido - Pedido #{order_id}"
    html = f"""
    <h2>Olá {client_name}!</h2>
    <p>O mecânico <strong>{mechanic_name}</strong> enviou um orçamento:</p>
    <ul>
        <li><strong>Pedido:</strong> #{order_id}</li>
        <li><strong>Valor:</strong> R$ {price:.2f}</li>
    </ul>
    <p>Acesse o dashboard para aprovar ou recusar.</p>
    <a href="https://fixconnect-12.preview.emergentagent.com/dashboard" style="background:#1EC6C6;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Ver Orçamento</a>
    """
    return send_email(client_email, subject, html)

def email_payment_confirmed(mechanic_email: str, mechanic_name: str, order_id: str):
    """Notify mechanic that payment was confirmed"""
    subject = f"Pagamento Confirmado - Pedido #{order_id}"
    html = f"""
    <h2>Ótima notícia, {mechanic_name}!</h2>
    <p>O pagamento do pedido <strong>#{order_id}</strong> foi confirmado.</p>
    <p>O serviço está agendado. Acesse o dashboard para ver detalhes.</p>
    <a href="https://fixconnect-12.preview.emergentagent.com/mechanic/dashboard" style="background:#27AE60;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Ver Agenda</a>
    """
    return send_email(mechanic_email, subject, html)
