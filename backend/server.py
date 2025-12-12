from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
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

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env', override=False)

# Import models
from models import (
    Vehicle, VehicleResponse, VehicleCreate, Quote, QuoteCreate, QuoteResponse, QuoteUpdateStatus,
    User, UserCreate, UserLogin, UserResponse, Payment, PaymentCreate,
    Order, OrderCreate
)
from vehicle_mock_db import search_vehicle_by_plate
from brasil_placa_api import search_brasil_placa, validate_brasil_plate
from auth import hash_password, verify_password, create_access_token, decode_token
from payment_brasil import BrasilPaymentGateway, format_currency_brl

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== AUTH DEPENDENCY =====
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user from JWT token"""
    token = credentials.credentials
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user)

async def get_current_user_optional(authorization: Optional[str] = Header(None)):
    """Get current user if token is provided"""
    if not authorization:
        return None
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = decode_token(token)
        
        if not payload:
            return None
        
        user_id = payload.get("user_id")
        if not user_id:
            return None
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            return None
        
        return User(**user)
    except Exception:
        return None

# ===== AUTHENTICATION ROUTES =====

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    """Register a new user (client or mechanic)"""
    try:
        # Check if email exists
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed_password = hash_password(user_data.password)
        
        # Create user
        user = User(
            email=user_data.email,
            password_hash=hashed_password,
            name=user_data.name,
            phone=user_data.phone,
            user_type=user_data.user_type
        )
        
        # Convert to dict and handle datetime
        user_dict = user.model_dump()
        user_dict['created_at'] = user_dict['created_at'].isoformat()
        
        # Insert into database
        await db.users.insert_one(user_dict)
        
        # Create JWT token
        token = create_access_token({"user_id": user.id, "user_type": user.user_type})
        
        logger.info(f"New user registered: {user.email} ({user.user_type})")
        
        return {
            "success": True,
            "token": token,
            "user": UserResponse(
                id=user.id,
                email=user.email,
                name=user.name,
                phone=user.phone,
                user_type=user.user_type,
                is_active=user.is_active,
                rating=user.rating,
                review_count=user.review_count
            ),
            "message": "User registered successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    """Login user and return JWT token"""
    try:
        # Find user
        user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
        if not user_doc:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        user = User(**user_doc)
        
        # Verify password
        if not verify_password(credentials.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Check if active
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account is not active")
        
        # Create JWT token
        token = create_access_token({"user_id": user.id, "user_type": user.user_type})
        
        logger.info(f"User logged in: {user.email}")
        
        return {
            "success": True,
            "token": token,
            "user": UserResponse(
                id=user.id,
                email=user.email,
                name=user.name,
                phone=user.phone,
                user_type=user.user_type,
                is_active=user.is_active,
                rating=user.rating,
                review_count=user.review_count
            ),
            "message": "Login successful"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return {
        "success": True,
        "data": UserResponse(
            id=current_user.id,
            email=current_user.email,
            name=current_user.name,
            phone=current_user.phone,
            user_type=current_user.user_type,
            is_active=current_user.is_active,
            rating=current_user.rating,
            review_count=current_user.review_count
        )
    }

# ===== VEHICLE ENDPOINTS =====

@api_router.get("/vehicle/{plate}")
async def get_vehicle_info(plate: str, current_user: Optional[User] = Depends(get_current_user_optional)):
    """Search vehicle by Brazilian plate"""
    try:
        logger.info(f"Busca de veículo para placa: {plate}")
        
        # Valida formato da placa brasileira
        if not validate_brasil_plate(plate):
            raise HTTPException(
                status_code=400, 
                detail="Formato de placa inválido. Use ABC1234 ou ABC1D23"
            )
        
        # Consulta API brasileira
        vehicle_data = await search_brasil_placa(plate)
        
        if vehicle_data:
            return VehicleResponse(
                success=True,
                data=vehicle_data,
                message="Veículo encontrado"
            )
        else:
            # Fallback para mock se API falhar
            logger.info(f"API falhou, tentando mock para {plate}")
            mock_data = search_vehicle_by_plate(plate)
            
            if mock_data:
                return VehicleResponse(
                    success=True,
                    data=mock_data,
                    message="Veículo encontrado (mock)"
                )
            
            raise HTTPException(status_code=404, detail="Veículo não encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar veículo: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/vehicles")
async def create_vehicle(vehicle_data: VehicleCreate, current_user: User = Depends(get_current_user)):
    """Create/save vehicle for user"""
    try:
        # Check if vehicle already exists for this user
        existing = await db.vehicles.find_one({
            "plate": vehicle_data.plate.upper(),
            "user_id": current_user.id
        })
        
        if existing:
            return {
                "success": True,
                "data": Vehicle(**existing),
                "message": "Vehicle already exists"
            }
        
        # Create new vehicle
        vehicle = Vehicle(
            plate=vehicle_data.plate.upper(),
            make=vehicle_data.make or "",
            make_name=vehicle_data.make or "",
            model=vehicle_data.model,
            year=vehicle_data.year or "",
            color="",
            fuel="",
            version="",
            category=""
        )
        
        vehicle_dict = vehicle.model_dump()
        vehicle_dict['created_at'] = vehicle_dict['created_at'].isoformat()
        vehicle_dict['user_id'] = current_user.id
        
        await db.vehicles.insert_one(vehicle_dict)
        
        logger.info(f"Vehicle created: {vehicle.id} - {vehicle.make} {vehicle.model}")
        
        return {
            "success": True,
            "data": vehicle,
            "message": "Vehicle saved successfully"
        }
    except Exception as e:
        logger.error(f"Error creating vehicle: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/vehicles/my-vehicles")
async def get_my_vehicles(current_user: User = Depends(get_current_user)):
    """Get user's vehicles"""
    try:
        vehicles = await db.vehicles.find({"user_id": current_user.id}, {"_id": 0}).to_list(100)
        return {
            "success": True,
            "data": vehicles,
            "message": f"{len(vehicles)} vehicles found"
        }
    except Exception as e:
        logger.error(f"Error fetching vehicles: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ===== QUOTE/ORDER ENDPOINTS =====

@api_router.post("/quotes")
async def create_quote(quote_data: QuoteCreate, current_user: User = Depends(get_current_user)):
    """Create a new service quote/order"""
    try:
        # Get vehicle info
        vehicle = await db.vehicles.find_one({"id": quote_data.vehicle_id}, {"_id": 0})
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        
        # Create quote/order
        order = Order(
            client_id=current_user.id,
            vehicle_id=quote_data.vehicle_id,
            plate=vehicle["plate"],
            make=vehicle.get("make", ""),
            model=vehicle.get("model", ""),
            year=vehicle.get("year", ""),
            service=quote_data.service,
            location=quote_data.location,
            description=quote_data.description,
            date=quote_data.date,
            time=quote_data.time,
            location_type=quote_data.location_type,
            status="pending"
        )
        
        order_dict = order.model_dump()
        order_dict['created_at'] = order_dict['created_at'].isoformat()
        order_dict['updated_at'] = order_dict['updated_at'].isoformat()
        
        await db.quotes.insert_one(order_dict)
        
        logger.info(f"Quote created: {order.id}")
        
        return {
            "success": True,
            "data": order,
            "message": "Quote created successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating quote: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/orders")
async def create_order(order_data: OrderCreate, current_user: User = Depends(get_current_user)):
    """Create order (alias for quotes for compatibility)"""
    return await create_quote(order_data, current_user)

@api_router.get("/quotes/{quote_id}")
async def get_quote(quote_id: str, current_user: User = Depends(get_current_user)):
    """Get quote by ID"""
    try:
        quote = await db.quotes.find_one({"id": quote_id}, {"_id": 0})
        if not quote:
            raise HTTPException(status_code=404, detail="Quote not found")
        
        return {
            "success": True,
            "data": Quote(**quote),
            "message": "Quote found"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching quote: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.patch("/quotes/{quote_id}")
async def update_quote_status(
    quote_id: str,
    update_data: QuoteUpdateStatus,
    current_user: User = Depends(get_current_user)
):
    """Update quote status"""
    try:
        quote = await db.quotes.find_one({"id": quote_id}, {"_id": 0})
        if not quote:
            raise HTTPException(status_code=404, detail="Quote not found")
        
        update_fields = {
            "status": update_data.status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        # If mechanic is submitting a quote
        if current_user.user_type == "mechanic" and update_data.final_price:
            update_fields["mechanic_id"] = current_user.id
            update_fields["final_price"] = update_data.final_price
        
        # Update in database
        await db.quotes.update_one(
            {"id": quote_id},
            {"$set": update_fields}
        )
        
        # Fetch updated quote
        updated_quote = await db.quotes.find_one({"id": quote_id}, {"_id": 0})
        
        logger.info(f"Quote {quote_id} updated to status: {update_data.status}")
        
        return {
            "success": True,
            "data": Quote(**updated_quote),
            "message": "Quote updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating quote: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/quotes/my-quotes")
async def get_my_quotes(current_user: User = Depends(get_current_user)):
    """Get quotes for current user"""
    try:
        if current_user.user_type == "client":
            quotes = await db.quotes.find({"client_id": current_user.id}, {"_id": 0}).sort("created_at", -1).to_list(100)
        elif current_user.user_type == "mechanic":
            quotes = await db.quotes.find({
                "$or": [
                    {"mechanic_id": current_user.id},
                    {"status": "pending"}
                ]
            }, {"_id": 0}).sort("created_at", -1).to_list(100)
        else:
            quotes = []
        
        return {
            "success": True,
            "data": quotes,
            "message": f"{len(quotes)} quotes found"
        }
    except Exception as e:
        logger.error(f"Error fetching user quotes: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ===== PAYMENT ENDPOINTS =====

@api_router.post("/payments")
async def create_payment(payment_data: PaymentCreate, current_user: User = Depends(get_current_user)):
    """Process payment for quote"""
    try:
        # Find quote
        quote = await db.quotes.find_one({"id": payment_data.quote_id}, {"_id": 0})
        if not quote:
            raise HTTPException(status_code=404, detail="Quote not found")
        
        if quote.get("client_id") != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        # Calculate commission using Brazilian gateway
        if payment_data.payment_type == "prebooking":
            # Pre-booking: R$ 50
            platform_fee = 50.0
            mechanic_earnings = 0.0
            new_status = "prebooked"
            commission_info = {
                "total": 50.0,
                "commission": 50.0,
                "mechanic_receives": 0.0,
                "total_formatted": format_currency_brl(50.0)
            }
        else:
            # Final payment - use Brazilian gateway calculation
            commission_info = BrasilPaymentGateway.calculate_commission(payment_data.amount)
            platform_fee = commission_info["commission"]
            mechanic_earnings = commission_info["mechanic_receives"]
            new_status = "paid"
        
        # Create payment record
        payment = Payment(
            quote_id=payment_data.quote_id,
            client_id=current_user.id,
            amount=payment_data.amount,
            payment_method=payment_data.payment_method,
            payment_type=payment_data.payment_type,
            platform_fee=platform_fee,
            mechanic_earnings=mechanic_earnings,
            status="completed"
        )
        
        payment_dict = payment.model_dump()
        payment_dict['created_at'] = payment_dict['created_at'].isoformat()
        await db.payments.insert_one(payment_dict)
        
        # Update quote status
        update_data = {
            "status": new_status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        if payment_data.payment_type == "prebooking":
            update_data["prebooking_paid"] = True
        
        await db.quotes.update_one({"id": payment_data.quote_id}, {"$set": update_data})
        
        # Update mechanic wallet if final payment
        if payment_data.payment_type == "final" and quote.get("mechanic_id"):
            mechanic_wallet = await db.wallets.find_one({"mechanic_id": quote["mechanic_id"]}, {"_id": 0})
            
            if mechanic_wallet:
                await db.wallets.update_one(
                    {"mechanic_id": quote["mechanic_id"]},
                    {
                        "$inc": {
                            "pending_balance": mechanic_earnings,
                            "total_earned": mechanic_earnings
                        }
                    }
                )
            else:
                from models import Wallet
                wallet = Wallet(
                    mechanic_id=quote["mechanic_id"],
                    pending_balance=mechanic_earnings,
                    total_earned=mechanic_earnings
                )
                wallet_dict = wallet.model_dump()
                wallet_dict['updated_at'] = wallet_dict['updated_at'].isoformat()
                await db.wallets.insert_one(wallet_dict)
        
        logger.info(f"Payment processed: {payment.id}")
        
        # If payment method is PIX, generate PIX code
        pix_data = None
        if payment_data.payment_method == "pix":
            pix_response = BrasilPaymentGateway.process_pix_payment(
                payment_data.amount,
                f"QuickMechanic - Order {payment_data.quote_id}"
            )
            pix_data = {
                "pix_code": pix_response["pix_code"],
                "pix_qr": pix_response["pix_qr"],
                "expires_in": pix_response["expires_in"]
            }
        
        return {
            "success": True,
            "data": payment,
            "pix": pix_data,
            "commission_info": commission_info if payment_data.payment_type != "prebooking" else None,
            "message": "Pagamento processado com sucesso"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing payment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/payments/pix/generate")
async def generate_pix(payment_data: dict, current_user: User = Depends(get_current_user)):
    """Generate PIX payment code"""
    try:
        amount = payment_data.get("amount")
        description = payment_data.get("description", "QuickMechanic Payment")
        
        pix_response = BrasilPaymentGateway.process_pix_payment(amount, description)
        
        return {
            "success": True,
            "data": pix_response,
            "message": "Código PIX gerado com sucesso"
        }
    except Exception as e:
        logger.error(f"Error generating PIX: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ===== MECHANIC ENDPOINTS =====

@api_router.get("/mechanics")
async def list_mechanics():
    """List all active mechanics"""
    try:
        mechanics = await db.users.find(
            {"user_type": "mechanic", "is_active": True},
            {"_id": 0, "password_hash": 0}
        ).to_list(100)
        
        return {
            "success": True,
            "data": mechanics,
            "message": f"{len(mechanics)} mechanics found"
        }
    except Exception as e:
        logger.error(f"Error listing mechanics: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/mechanics/wallet")
async def get_wallet(current_user: User = Depends(get_current_user)):
    """Get mechanic wallet"""
    try:
        if current_user.user_type != "mechanic":
            raise HTTPException(status_code=403, detail="Only mechanics can view wallet")
        
        wallet = await db.wallets.find_one({"mechanic_id": current_user.id}, {"_id": 0})
        
        if not wallet:
            from models import Wallet
            wallet = Wallet(mechanic_id=current_user.id)
            wallet_dict = wallet.model_dump()
            wallet_dict['updated_at'] = wallet_dict['updated_at'].isoformat()
            await db.wallets.insert_one(wallet_dict)
            return {
                "success": True,
                "data": wallet,
                "message": "Wallet created"
            }
        
        return {
            "success": True,
            "data": wallet,
            "message": "Wallet found"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching wallet: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ===== ADMIN ENDPOINTS =====

async def require_admin(current_user: User = Depends(get_current_user)):
    """Ensure user is admin"""
    if current_user.user_type != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@api_router.get("/admin/stats")
async def get_admin_stats(admin: User = Depends(require_admin)):
    """Get platform statistics"""
    try:
        total_users = await db.users.count_documents({})
        total_mechanics = await db.users.count_documents({"user_type": "mechanic"})
        total_clients = await db.users.count_documents({"user_type": "client"})
        total_quotes = await db.quotes.count_documents({})
        completed_quotes = await db.quotes.count_documents({"status": "completed"})
        
        # Calculate total revenue
        payments = await db.payments.find({}, {"_id": 0, "amount": 1}).to_list(10000)
        total_revenue = sum(p.get("amount", 0) for p in payments)
        
        return {
            "success": True,
            "data": {
                "total_users": total_users,
                "total_mechanics": total_mechanics,
                "total_clients": total_clients,
                "total_quotes": total_quotes,
                "completed_quotes": completed_quotes,
                "total_revenue": total_revenue
            }
        }
    except Exception as e:
        logger.error(f"Error fetching stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "QuickMechanic API - Sistema de Consulta de Veículos"}

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include router in app
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
