"""
Serviço de consulta de placas brasileiras usando wdapi2.com.br
"""
import httpx
import os
import logging
from typing import Optional, Dict

logger = logging.getLogger(__name__)

BRASIL_API_TOKEN = os.environ.get('BRASIL_API_TOKEN', '')
BRASIL_API_URL = "https://wdapi2.com.br/consulta"


async def search_brasil_placa(placa: str) -> Optional[Dict]:
    """
    Consulta placa brasileira na API wdapi2.com.br
    
    Args:
        placa: Placa no formato ABC1234 ou ABC1D23
        
    Returns:
        Dados do veículo ou None se não encontrado
    """
    try:
        # Remove caracteres especiais e converte para maiúsculas
        placa_limpa = placa.upper().replace("-", "").replace(" ", "")
        
        # Valida formato brasileiro (ABC1234 ou ABC1D23)
        if len(placa_limpa) != 7:
            logger.warning(f"Placa inválida (tamanho): {placa}")
            return None
        
        url = f"{BRASIL_API_URL}/{placa_limpa}/{BRASIL_API_TOKEN}"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            
            if response.status_code == 200:
                data = response.json()
                
                # Verifica se tem mensagem de erro
                if "message" in data and "Token Invalido" in data["message"]:
                    logger.error(f"Token inválido na API Brasil")
                    return None
                
                # Mapeia para formato do sistema
                vehicle_data = {
                    "plate": placa_limpa,
                    "make": data.get("MARCA", ""),
                    "make_name": data.get("MARCA", ""),
                    "model": data.get("MODELO", ""),
                    "year": data.get("ano", ""),
                    "color": data.get("cor", ""),
                    "fuel": data.get("extra", {}).get("combustivel", ""),
                    "version": data.get("VERSAO", ""),
                    "category": data.get("extra", {}).get("tipo_veiculo", ""),
                    "power": "",
                    "transmission": "",
                    "doors": "",
                    "engine_size": data.get("extra", {}).get("motor", ""),
                    "co2": "",
                    "mpg": "",
                    "country": "Brasil"
                }
                
                logger.info(f"Veículo encontrado: {vehicle_data['make']} {vehicle_data['model']} ({vehicle_data['year']})")
                return vehicle_data
            else:
                logger.warning(f"API Brasil retornou status {response.status_code}")
                return None
                
    except httpx.TimeoutException:
        logger.error(f"Timeout ao consultar placa {placa}")
        return None
    except Exception as e:
        logger.error(f"Erro ao consultar placa brasileira {placa}: {str(e)}")
        return None


def validate_brasil_plate(placa: str) -> bool:
    """
    Valida formato de placa brasileira
    
    Formatos aceitos:
    - Antigo: ABC1234 (3 letras + 4 números)
    - Mercosul: ABC1D23 (3 letras + 1 número + 1 letra + 2 números)
    
    Args:
        placa: String com a placa
        
    Returns:
        True se válida, False caso contrário
    """
    placa_limpa = placa.upper().replace("-", "").replace(" ", "")
    
    if len(placa_limpa) != 7:
        return False
    
    # Formato antigo: ABC1234
    if (placa_limpa[:3].isalpha() and placa_limpa[3:].isdigit()):
        return True
    
    # Formato Mercosul: ABC1D23
    if (placa_limpa[:3].isalpha() and 
        placa_limpa[3].isdigit() and 
        placa_limpa[4].isalpha() and 
        placa_limpa[5:].isdigit()):
        return True
    
    return False
