"""
Sistema de Pagamento Brasileiro - PIX Mock
Simula integração com gateway de pagamento brasileiro
"""
import uuid
from datetime import datetime, timezone
import logging
import random
import string

logger = logging.getLogger(__name__)


def format_currency_brl(value: float) -> str:
    """
    Formata valor em Real Brasileiro
    Ex: 150.50 -> R$ 150,50
    """
    return f"R$ {value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def generate_pix_code() -> str:
    """
    Gera código PIX mock (formato simulado)
    Em produção, seria gerado pelo gateway (Mercado Pago, PagSeguro, etc)
    """
    # Formato: 00020126...
    random_code = ''.join(random.choices(string.digits, k=100))
    return f"00020126{random_code}"


def generate_pix_qr() -> str:
    """
    Gera QR Code PIX mock
    Em produção, seria uma imagem real do QR Code
    """
    return f"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="


class BrasilPaymentGateway:
    """
    Gateway de pagamento brasileiro (Mock)
    Simula PIX, Cartão de Crédito, Boleto
    """
    
    COMMISSION_BASE = 20.0  # R$ 20 fixo
    COMMISSION_RATE = 0.10  # 10%
    
    @staticmethod
    def calculate_commission(amount: float) -> dict:
        """
        Calcula comissão da plataforma
        R$ 20 fixo + 10% do valor
        """
        commission = BrasilPaymentGateway.COMMISSION_BASE + (amount * BrasilPaymentGateway.COMMISSION_RATE)
        mechanic_receives = amount - commission
        
        return {
            "total": amount,
            "commission": commission,
            "mechanic_receives": mechanic_receives,
            "commission_formatted": format_currency_brl(commission),
            "mechanic_receives_formatted": format_currency_brl(mechanic_receives),
            "total_formatted": format_currency_brl(amount)
        }
    
    @staticmethod
    def process_pix_payment(amount: float, description: str) -> dict:
        """
        Processa pagamento via PIX (Mock)
        
        Em produção, integraria com:
        - Mercado Pago
        - PagSeguro
        - Asaas
        - Gerencianet
        """
        payment_id = str(uuid.uuid4())
        pix_code = generate_pix_code()
        pix_qr = generate_pix_qr()
        
        logger.info(f"PIX payment mock: {format_currency_brl(amount)} - {description}")
        
        return {
            "success": True,
            "payment_id": payment_id,
            "method": "pix",
            "amount": amount,
            "amount_formatted": format_currency_brl(amount),
            "pix_code": pix_code,
            "pix_qr": pix_qr,
            "status": "pending",  # pending -> approved -> completed
            "expires_in": 1800,  # 30 minutos
            "created_at": datetime.now(timezone.utc).isoformat(),
            "description": description
        }
    
    @staticmethod
    def process_credit_card_payment(amount: float, card_data: dict, description: str) -> dict:
        """
        Processa pagamento via Cartão de Crédito (Mock)
        """
        payment_id = str(uuid.uuid4())
        
        # Mock: sempre aprova
        logger.info(f"Credit card payment mock: {format_currency_brl(amount)} - {description}")
        
        return {
            "success": True,
            "payment_id": payment_id,
            "method": "credit_card",
            "amount": amount,
            "amount_formatted": format_currency_brl(amount),
            "status": "approved",
            "installments": card_data.get("installments", 1),
            "card_brand": card_data.get("brand", "unknown"),
            "card_last4": card_data.get("number", "0000")[-4:],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "description": description
        }
    
    @staticmethod
    def process_boleto_payment(amount: float, description: str) -> dict:
        """
        Gera boleto bancário (Mock)
        """
        payment_id = str(uuid.uuid4())
        
        # Linha digitável do boleto (mock)
        linha_digitavel = ''.join(random.choices(string.digits, k=47))
        linha_digitavel_formatted = f"{linha_digitavel[:5]}.{linha_digitavel[5:10]} {linha_digitavel[10:15]}.{linha_digitavel[15:21]} {linha_digitavel[21:26]}.{linha_digitavel[26:32]} {linha_digitavel[32:33]} {linha_digitavel[33:]}"
        
        logger.info(f"Boleto payment mock: {format_currency_brl(amount)} - {description}")
        
        return {
            "success": True,
            "payment_id": payment_id,
            "method": "boleto",
            "amount": amount,
            "amount_formatted": format_currency_brl(amount),
            "status": "pending",
            "boleto_line": linha_digitavel_formatted,
            "boleto_pdf": f"/api/payments/{payment_id}/boleto.pdf",
            "due_date": "2025-12-15",  # 3 dias úteis
            "created_at": datetime.now(timezone.utc).isoformat(),
            "description": description
        }
    
    @staticmethod
    def confirm_payment(payment_id: str) -> dict:
        """
        Confirma pagamento recebido (Mock)
        Webhook seria chamado pelo gateway real
        """
        logger.info(f"Payment confirmed: {payment_id}")
        
        return {
            "success": True,
            "payment_id": payment_id,
            "status": "approved",
            "confirmed_at": datetime.now(timezone.utc).isoformat()
        }
