from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

# Load environment variables FIRST
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env', override=True)

# Import our models and services AFTER loading env
from models import Vehicle, VehicleResponse, Quote, QuoteCreate, QuoteResponse
from vehicle_mock_db import search_vehicle_by_plate
from dvla_service import search_vehicle_with_fallback

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "QuickMechanic API - Sistema de Consulta de Veículos"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# ===== VEHICLE SEARCH ENDPOINTS =====

@api_router.get("/vehicle/plate/{plate}")
async def search_vehicle_by_plate_endpoint(plate: str):
    """
    Busca veículo pela placa usando DVLA API (com fallback para mock)
    Endpoint: GET /api/vehicle/plate/AB12CDE
    
    Fluxo:
    1. Tenta buscar na DVLA API oficial do governo UK
    2. Se falhar ou não encontrar, usa mock database interno
    3. Retorna dados formatados
    """
    try:
        # Normaliza a placa
        clean_plate = plate.replace('-', '').replace(' ', '').upper()
        
        logger.info(f"Buscando veículo para placa: {clean_plate}")
        
        # Busca com fallback (DVLA primeiro, depois mock)
        vehicle_data = search_vehicle_with_fallback(clean_plate)
        
        if vehicle_data:
            return {
                "success": True,
                "data": vehicle_data,
                "message": "Veículo encontrado com sucesso",
                "source": "DVLA API" if vehicle_data.get('tax_status') else "Mock Database"
            }
        else:
            return {
                "success": False,
                "data": None,
                "message": "Placa não encontrada. Veículo pode não estar registrado no UK ou placa inválida.",
                "source": None
            }
    except Exception as e:
        logger.error(f"Erro ao buscar veículo: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ===== QUOTE ENDPOINTS =====

@api_router.post("/quotes")
async def create_quote(quote_data: QuoteCreate):
    """
    Cria um novo orçamento com dados do veículo
    Endpoint: POST /api/quotes
    Body: {
        "plate": "AB12CDE",
        "make": "ford",
        "model": "Fiesta",
        "year": "2012",
        "color": "Azul",
        "fuel": "Gasolina",
        "version": "1.0 EcoBoost",
        "category": "Hatchback",
        "service": "oil_change",
        "location": "London, UK",
        "description": "Preciso trocar o óleo"
    }
    """
    try:
        # Cria objeto Quote
        quote = Quote(**quote_data.model_dump())
        
        # Salva no MongoDB
        await db.quotes.insert_one(quote.model_dump())
        
        logger.info(f"Orçamento criado: {quote.id} - Placa: {quote.plate}")
        
        return {
            "success": True,
            "data": quote,
            "message": "Orçamento salvo com sucesso"
        }
    except Exception as e:
        logger.error(f"Erro ao criar orçamento: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/quotes/{quote_id}")
async def get_quote(quote_id: str):
    """
    Busca um orçamento específico
    Endpoint: GET /api/quotes/{quote_id}
    """
    try:
        quote = await db.quotes.find_one({"id": quote_id})
        
        if quote:
            return {
                "success": True,
                "data": Quote(**quote),
                "message": "Orçamento encontrado"
            }
        else:
            return {
                "success": False,
                "data": None,
                "message": "Orçamento não encontrado"
            }
    except Exception as e:
        logger.error(f"Erro ao buscar orçamento: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/quotes")
async def list_quotes(limit: int = 100):
    """
    Lista todos os orçamentos
    Endpoint: GET /api/quotes?limit=100
    """
    try:
        quotes = await db.quotes.find().sort("created_at", -1).to_list(limit)
        return {
            "success": True,
            "data": [Quote(**quote) for quote in quotes],
            "message": f"{len(quotes)} orçamentos encontrados"
        }
    except Exception as e:
        logger.error(f"Erro ao listar orçamentos: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()