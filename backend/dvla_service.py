import os
import requests
import logging
from typing import Optional, Dict
from vehicle_mock_db import search_vehicle_by_plate

logger = logging.getLogger(__name__)

# DVLA API Configuration
DVLA_API_KEY = os.environ.get('DVLA_API_KEY')
DVLA_API_URL = os.environ.get('DVLA_API_URL')

# Mapeamento de cores DVLA para português
COLOR_MAPPING = {
    'BEIGE': 'Bege',
    'BLACK': 'Preto',
    'BLUE': 'Azul',
    'BRONZE': 'Bronze',
    'BROWN': 'Marrom',
    'CREAM': 'Creme',
    'GOLD': 'Dourado',
    'GREEN': 'Verde',
    'GREY': 'Cinza',
    'MAROON': 'Bordô',
    'ORANGE': 'Laranja',
    'PINK': 'Rosa',
    'PURPLE': 'Roxo',
    'RED': 'Vermelho',
    'SILVER': 'Prata',
    'TURQUOISE': 'Turquesa',
    'WHITE': 'Branco',
    'YELLOW': 'Amarelo'
}

# Mapeamento de combustível DVLA
FUEL_MAPPING = {
    'PETROL': 'Gasolina',
    'DIESEL': 'Diesel',
    'ELECTRIC': 'Elétrico',
    'HYBRID': 'Híbrido',
    'HYBRID ELECTRIC': 'Híbrido Elétrico',
    'PLUG-IN HYBRID': 'Híbrido Plug-in',
    'GAS': 'Gás',
    'GAS BI-FUEL': 'Bi-combustível (Gás)'
}

def format_plate(plate: str) -> str:
    """Formata placa UK no padrão AB12 CDE"""
    clean = plate.replace(' ', '').replace('-', '').upper()
    if len(clean) == 7:
        return f"{clean[:2]}{clean[2:4]} {clean[4:]}"
    return plate

def search_vehicle_dvla(registration_number: str) -> Optional[Dict]:
    """
    Busca veículo na API DVLA
    Retorna dados formatados ou None se não encontrar
    """
    try:
        # Remove espaços e formata
        clean_plate = registration_number.replace(' ', '').replace('-', '').upper()
        
        logger.info(f"Consultando DVLA API para placa: {clean_plate}")
        
        headers = {
            'x-api-key': DVLA_API_KEY,
            'Content-Type': 'application/json'
        }
        
        payload = {
            'registrationNumber': clean_plate
        }
        
        response = requests.post(
            DVLA_API_URL,
            json=payload,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            logger.info(f"DVLA retornou dados para: {clean_plate}")
            
            # Mapeia dados DVLA para nosso formato
            vehicle_data = {
                'plate': format_plate(clean_plate),
                'make': data.get('make', '').lower(),
                'make_name': data.get('make', '').title(),
                'model': data.get('model', 'Unknown'),  # DVLA não retorna modelo, só marca
                'year': str(data.get('yearOfManufacture', '')),
                'color': COLOR_MAPPING.get(data.get('colour', '').upper(), data.get('colour', '')),
                'fuel': FUEL_MAPPING.get(data.get('fuelType', '').upper(), data.get('fuelType', '')),
                'version': f"{data.get('make', '')} {data.get('engineCapacity', '')}cc",
                'category': get_vehicle_category(data.get('typeApproval', '')),
                'power': calculate_power(data.get('engineCapacity', 0)),
                'transmission': 'Unknown',  # DVLA não fornece
                'doors': 'Unknown',  # DVLA não fornece
                'engine_size': f"{data.get('engineCapacity', '')}cc",
                'co2': f"{data.get('co2Emissions', 'N/A')}g/km",
                'mpg': 'N/A',  # DVLA não fornece
                'country': 'UK',
                'tax_status': data.get('taxStatus', 'Unknown'),
                'mot_status': data.get('motStatus', 'Unknown'),
                'mot_expiry': data.get('motExpiryDate', 'N/A')
            }
            
            return vehicle_data
            
        elif response.status_code == 404:
            logger.warning(f"Veículo não encontrado na DVLA: {clean_plate}")
            return None
        else:
            logger.error(f"DVLA API erro {response.status_code}: {response.text}")
            return None
            
    except requests.exceptions.Timeout:
        logger.error(f"Timeout ao consultar DVLA para placa: {registration_number}")
        return None
    except Exception as e:
        logger.error(f"Erro ao consultar DVLA: {str(e)}")
        return None

def get_vehicle_category(type_approval: str) -> str:
    """Determina categoria do veículo baseado no type approval"""
    if not type_approval:
        return 'Unknown'
    
    type_approval = type_approval.upper()
    
    if 'M1' in type_approval:
        return 'Hatchback/Sedan'
    elif 'N1' in type_approval:
        return 'Van/Pickup'
    elif 'M2' in type_approval or 'M3' in type_approval:
        return 'Bus/Coach'
    else:
        return 'Other'

def calculate_power(engine_capacity: int) -> str:
    """Estima potência baseado na cilindrada (aproximação)"""
    if not engine_capacity:
        return 'Unknown'
    
    # Fórmula aproximada: 1cv por 15-20cc para motores normais
    estimated_hp = int(engine_capacity / 17)
    return f"{estimated_hp}cv"

def search_vehicle_with_fallback(plate: str) -> Optional[Dict]:
    """
    Tenta buscar na API DVLA primeiro
    Se falhar, usa mock database como fallback
    """
    # Tenta DVLA primeiro
    dvla_data = search_vehicle_dvla(plate)
    
    if dvla_data:
        logger.info(f"Dados obtidos da DVLA para: {plate}")
        return dvla_data
    
    # Fallback para mock
    logger.info(f"DVLA não retornou dados, usando mock database para: {plate}")
    mock_data = search_vehicle_by_plate(plate)
    
    if mock_data:
        logger.info(f"Dados obtidos do mock para: {plate}")
        return mock_data
    
    return None
