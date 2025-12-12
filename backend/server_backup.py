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

# Load environment variables FIRST (override=False for production compatibility)
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env', override=False)

# Import our models and services AFTER loading env
from models import (
    Vehicle, VehicleResponse, VehicleCreate, Quote, QuoteCreate, QuoteResponse, QuoteUpdateStatus,
    User, UserCreate, UserLogin, UserResponse, Payment, PaymentCreate,
    Order, OrderCreate
)
from vehicle_mock_db import search_vehicle_by_plate
from dvla_service import search_vehicle_with_fallback
from auth import hash_password, verify_password, create_access_token, decode_token

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

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
    """Get current user if token is provided, otherwise return None"""
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


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# ===== AUTHENTICATION ROUTES =====

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    """Register a new user (client or mechanic)"""
    try:
        # Check if user already exists
        existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create user
        user = User(
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            name=user_data.name,
            phone=user_data.phone,
            user_type=user_data.user_type
        )
        
        # Save to database
        user_dict = user.model_dump()
        user_dict['created_at'] = user_dict['created_at'].isoformat()
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
    """Get current user information"""
    return {
        "success": True,
        "user": UserResponse(
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

@api_router.post("/orders")
async def create_order(order_data: OrderCreate, current_user: User = Depends(get_current_user)):
    """Create a new service order"""
    try:
        # Get vehicle info
        vehicle = await db.vehicles.find_one({"id": order_data.vehicle_id}, {"_id": 0})
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        
        # Create order
        order = Order(
            client_id=current_user.id,
            vehicle_id=order_data.vehicle_id,
            plate=vehicle["plate"],
            make=vehicle["make"],
            model=vehicle["model"],
            year=vehicle["year"],
            service=order_data.service,
            location=order_data.location,
            description=order_data.description,
            date=order_data.date,
            time=order_data.time,
            location_type=order_data.location_type,
            has_parts=order_data.has_parts,
            status="AGUARDANDO_MECANICO"
        )
        
        doc = order.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await db.orders.insert_one(doc)
        
        logger.info(f"Order created: {order.id} - {order.make} {order.model}")
        
        return {
            "success": True,
            "data": order,
            "message": "Order created successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Backward compatibility - keep /quotes endpoint
@api_router.post("/quotes")
async def create_quote(quote_data: QuoteCreate, current_user: User = Depends(get_current_user_optional)):
    """Legacy endpoint - redirects to orders"""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return await create_order(quote_data, current_user)

@api_router.get("/quotes/my-quotes")
async def get_my_quotes(current_user: User = Depends(get_current_user)):
    """Get quotes/orders for the current user (client or mechanic)"""
    try:
        if current_user.user_type == "client":
            # Get orders created by this client
            orders = await db.orders.find({"client_id": current_user.id}, {"_id": 0}).sort("created_at", -1).to_list(100)
            # Also get legacy quotes for backward compatibility
            quotes = await db.quotes.find({"client_id": current_user.id}, {"_id": 0}).sort("created_at", -1).to_list(100)
            all_quotes = orders + quotes
        elif current_user.user_type == "mechanic":
            # Get orders assigned to this mechanic OR pending orders
            orders = await db.orders.find({
                "$or": [
                    {"mechanic_id": current_user.id},
                    {"status": "AGUARDANDO_MECANICO"}
                ]
            }, {"_id": 0}).sort("created_at", -1).to_list(100)
            # Also get legacy quotes for backward compatibility
            quotes = await db.quotes.find({
                "$or": [
                    {"mechanic_id": current_user.id},
                    {"status": "pending"}
                ]
            }, {"_id": 0}).sort("created_at", -1).to_list(100)
            all_quotes = orders + quotes
        else:
            all_quotes = []
        
        return {
            "success": True,
            "data": all_quotes,
            "message": f"{len(all_quotes)} quotes found"
        }
    except Exception as e:
        logger.error(f"Error fetching user quotes: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/quotes")
async def list_quotes(limit: int = 100):
    """
    Lista todos os orçamentos
    Endpoint: GET /api/quotes?limit=100
    """
    try:
        quotes = await db.quotes.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
        return {
            "success": True,
            "data": [Quote(**quote) for quote in quotes],
            "message": f"{len(quotes)} orçamentos encontrados"
        }
    except Exception as e:
        logger.error(f"Erro ao listar orçamentos: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/quotes/{quote_id}")
async def get_quote(quote_id: str):
    """
    Busca um orçamento específico
    Endpoint: GET /api/quotes/{quote_id}
    """
    try:
        quote = await db.quotes.find_one({"id": quote_id}, {"_id": 0})
        
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

@api_router.patch("/quotes/{quote_id}/status")
async def update_quote_status(
    quote_id: str,
    update_data: QuoteUpdateStatus,
    current_user: User = Depends(get_current_user)
):
    """Update quote status and optionally assign mechanic/price"""
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

# ===== PAYMENT ENDPOINTS =====

@api_router.post("/payments")
async def create_payment(payment_data: PaymentCreate, current_user: User = Depends(get_current_user)):
    """Process payment for a quote/order with platform commission calculation"""
    try:
        # Try to find order first, then quote for backward compatibility
        quote = await db.orders.find_one({"id": payment_data.quote_id}, {"_id": 0})
        if not quote:
            quote = await db.quotes.find_one({"id": payment_data.quote_id}, {"_id": 0})
        
        if not quote:
            raise HTTPException(status_code=404, detail="Order/Quote not found")
        
        if quote.get("client_id") != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to pay for this order")
        
        # Calculate commission (Modelo Híbrido: £5 base + 10%)
        BASE_FEE = 5.0
        COMMISSION_RATE = 0.10
        
        if payment_data.payment_type == "prebooking":
            # Pre-booking: £12 fixo
            platform_fee = 12.0
            mechanic_earnings = 0.0
            autoparts_earnings = 0.0
            new_status = "prebooked"
        else:
            # Final payment with parts split
            total_amount = payment_data.amount
            travel_fee = quote.get("travel_fee", 0.0)
            part_price = quote.get("part_price", 0.0)
            
            # Se já pagou pre-booking, desconta do total
            if quote.get("prebooking_paid"):
                total_amount -= quote.get("prebooking_amount", 12.0)
            
            # Labor amount (without parts and travel fee)
            labor_amount = payment_data.amount - part_price - travel_fee
            
            # Platform commission only on labor
            platform_fee = BASE_FEE + (labor_amount * COMMISSION_RATE)
            
            # Mechanic gets: labor + travel - platform commission
            mechanic_earnings = labor_amount + travel_fee - platform_fee
            
            # AutoParts gets 100% of part price
            autoparts_earnings = part_price
            
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
        
        # Create payment split record
        if payment_data.payment_type == "final" and autoparts_earnings > 0:
            from models import PaymentSplit
            split = PaymentSplit(
                payment_id=payment.id,
                quote_id=payment_data.quote_id,
                total_amount=payment_data.amount,
                mechanic_amount=mechanic_earnings,
                autoparts_amount=autoparts_earnings,
                platform_amount=platform_fee
            )
            split_dict = split.model_dump()
            split_dict['created_at'] = split_dict['created_at'].isoformat()
            await db.payment_splits.insert_one(split_dict)
            
            # Update autoparts wallet if part was used
            if quote.get("autoparts_id"):
                autoparts_wallet = await db.wallets.find_one({"mechanic_id": quote["autoparts_id"]}, {"_id": 0})
                if autoparts_wallet:
                    await db.wallets.update_one(
                        {"mechanic_id": quote["autoparts_id"]},
                        {
                            "$inc": {
                                "pending_balance": autoparts_earnings,
                                "total_earned": autoparts_earnings
                            }
                        }
                    )
                else:
                    from models import Wallet
                    new_wallet = Wallet(
                        mechanic_id=quote["autoparts_id"],
                        pending_balance=autoparts_earnings,
                        total_earned=autoparts_earnings
                    )
                    wallet_dict = new_wallet.model_dump()
                    wallet_dict['updated_at'] = wallet_dict['updated_at'].isoformat()
                    await db.wallets.insert_one(wallet_dict)
        
        # Save payment
        payment_dict = payment.model_dump()
        payment_dict['created_at'] = payment_dict['created_at'].isoformat()
        await db.payments.insert_one(payment_dict)
        
        # Update order/quote
        update_data = {
            "status": new_status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        if payment_data.payment_type == "prebooking":
            update_data["prebooking_paid"] = True
        
        # Try orders first, then quotes
        result = await db.orders.update_one({"id": payment_data.quote_id}, {"$set": update_data})
        if result.matched_count == 0:
            await db.quotes.update_one({"id": payment_data.quote_id}, {"$set": update_data})
        
        # Update mechanic wallet if final payment
        if payment_data.payment_type == "final" and quote.get("mechanic_id"):
            mechanic_id = quote.get("mechanic_id")
            wallet = await db.wallets.find_one({"mechanic_id": mechanic_id}, {"_id": 0})
            
            if wallet:
                # Update existing wallet
                await db.wallets.update_one(
                    {"mechanic_id": mechanic_id},
                    {
                        "$inc": {
                            "pending_balance": mechanic_earnings,
                            "total_earned": mechanic_earnings
                        },
                        "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
                    }
                )
            else:
                # Create new wallet
                from models import Wallet
                new_wallet = Wallet(
                    mechanic_id=mechanic_id,
                    pending_balance=mechanic_earnings,
                    total_earned=mechanic_earnings
                )
                wallet_dict = new_wallet.model_dump()
                wallet_dict['updated_at'] = wallet_dict['updated_at'].isoformat()
                await db.wallets.insert_one(wallet_dict)
        
        logger.info(f"Payment processed: {payment.id} - Type: {payment_data.payment_type} - Platform: £{platform_fee} - Mechanic: £{mechanic_earnings}")
        
        return {
            "success": True,
            "data": payment,
            "message": "Payment processed successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/payments/my-payments")
async def get_my_payments(current_user: User = Depends(get_current_user)):
    """Get payment history for current user"""
    try:
        payments = await db.payments.find({"client_id": current_user.id}, {"_id": 0}).sort("created_at", -1).to_list(100)
        return {
            "success": True,
            "data": [Payment(**payment) for payment in payments],
            "message": f"{len(payments)} payments found"
        }
    except Exception as e:
        logger.error(f"Error fetching payments: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ===== WALLET & PAYOUT ENDPOINTS =====

@api_router.get("/wallet/balance")
async def get_wallet_balance(current_user: User = Depends(get_current_user)):
    """Get mechanic wallet balance"""
    try:
        if current_user.user_type != "mechanic":
            raise HTTPException(status_code=403, detail="Only mechanics have wallets")
        
        wallet = await db.wallets.find_one({"mechanic_id": current_user.id}, {"_id": 0})
        
        if not wallet:
            # Create wallet if doesn't exist
            from models import Wallet
            new_wallet = Wallet(mechanic_id=current_user.id)
            wallet_dict = new_wallet.model_dump()
            wallet_dict['updated_at'] = wallet_dict['updated_at'].isoformat()
            await db.wallets.insert_one(wallet_dict)
            wallet = wallet_dict
        
        return {
            "success": True,
            "data": wallet,
            "message": "Wallet balance retrieved"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching wallet: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/wallet/payout")
async def request_payout(amount: float, current_user: User = Depends(get_current_user)):
    """Request payout from wallet"""
    try:
        if current_user.user_type != "mechanic":
            raise HTTPException(status_code=403, detail="Only mechanics can request payouts")
        
        wallet = await db.wallets.find_one({"mechanic_id": current_user.id}, {"_id": 0})
        
        if not wallet or wallet.get("available_balance", 0) < amount:
            raise HTTPException(status_code=400, detail="Insufficient balance")
        
        # Create payout request
        from models import PayoutRequest
        payout = PayoutRequest(
            mechanic_id=current_user.id,
            amount=amount
        )
        
        payout_dict = payout.model_dump()
        payout_dict['requested_at'] = payout_dict['requested_at'].isoformat()
        await db.payout_requests.insert_one(payout_dict)
        
        # Update wallet (move from available to pending payout)
        await db.wallets.update_one(
            {"mechanic_id": current_user.id},
            {
                "$inc": {"available_balance": -amount},
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
            }
        )
        
        return {
            "success": True,
            "data": payout,
            "message": "Payout request submitted"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payout request error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/wallet/payouts")
async def get_payout_history(current_user: User = Depends(get_current_user)):
    """Get payout history for mechanic"""
    try:
        if current_user.user_type != "mechanic":
            raise HTTPException(status_code=403, detail="Only mechanics have payout history")
        
        payouts = await db.payout_requests.find(
            {"mechanic_id": current_user.id},
            {"_id": 0}
        ).sort("requested_at", -1).to_list(100)
        
        return {
            "success": True,
            "data": payouts,
            "message": f"{len(payouts)} payouts found"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching payouts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ===== VEHICLE ENDPOINTS =====

@api_router.post("/vehicles")
async def create_vehicle(vehicle_data: VehicleCreate, current_user: User = Depends(get_current_user)):
    """Create a new vehicle for client"""
    try:
        from models import Vehicle as VehicleModel
        
        vehicle = VehicleModel(
            client_id=current_user.id,
            **vehicle_data.model_dump()
        )
        
        vehicle_dict = vehicle.model_dump()
        vehicle_dict['created_at'] = vehicle_dict['created_at'].isoformat()
        await db.vehicles.insert_one(vehicle_dict)
        
        logger.info(f"Vehicle created: {vehicle.plate} for client {current_user.id}")
        
        return {
            "success": True,
            "data": vehicle,
            "message": "Vehicle registered successfully"
        }
    except Exception as e:
        logger.error(f"Error creating vehicle: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/vehicles")
async def get_my_vehicles(current_user: User = Depends(get_current_user)):
    """Get all vehicles for current user"""
    try:
        vehicles = await db.vehicles.find({"client_id": current_user.id}, {"_id": 0}).to_list(100)
        return {
            "success": True,
            "data": vehicles,
            "message": f"{len(vehicles)} vehicles found"
        }
    except Exception as e:
        logger.error(f"Error fetching vehicles: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ===== AUTOPARTS ENDPOINTS =====

@api_router.post("/autoparts/parts")
async def create_part(part_data: PartCreate, current_user: User = Depends(get_current_user)):
    """Create a new part in catalog (AutoParts only)"""
    try:
        if current_user.user_type != "autoparts":
            raise HTTPException(status_code=403, detail="Only auto parts shops can add parts")
        
        from models import Part
        part = Part(
            autoparts_id=current_user.id,
            **part_data.model_dump()
        )
        
        part_dict = part.model_dump()
        part_dict['created_at'] = part_dict['created_at'].isoformat()
        await db.parts.insert_one(part_dict)
        
        logger.info(f"Part created: {part.name} by {current_user.shop_name}")
        
        return {
            "success": True,
            "data": part,
            "message": "Part added successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating part: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/autoparts/parts")
async def get_my_parts(current_user: User = Depends(get_current_user)):
    """Get parts catalog for current autoparts shop"""
    try:
        if current_user.user_type != "autoparts":
            raise HTTPException(status_code=403, detail="Only auto parts shops can view catalog")
        
        parts = await db.parts.find({"autoparts_id": current_user.id}, {"_id": 0}).to_list(1000)
        
        return {
            "success": True,
            "data": parts,
            "message": f"{len(parts)} parts found"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching parts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/parts/search")
async def search_parts(
    car_make: Optional[str] = None,
    car_model: Optional[str] = None,
    service_type: Optional[str] = None,
    postcode: Optional[str] = None
):
    """Search for compatible parts"""
    try:
        query = {"is_available": True, "stock": {"$gt": 0}}
        
        if car_make:
            query["car_make"] = {"$regex": car_make, "$options": "i"}
        if car_model:
            query["car_model"] = {"$regex": car_model, "$options": "i"}
        if service_type:
            query["service_type"] = service_type
        
        parts = await db.parts.find(query, {"_id": 0}).to_list(100)
        
        # Enhance with shop info
        for part in parts:
            shop = await db.users.find_one(
                {"id": part["autoparts_id"]},
                {"_id": 0, "shop_name": 1, "shop_address": 1, "postcode": 1}
            )
            if shop:
                part["shop_info"] = shop
        
        return {
            "success": True,
            "data": parts,
            "message": f"{len(parts)} parts found"
        }
    except Exception as e:
        logger.error(f"Error searching parts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/parts/suggestions/{service_type}")
async def get_part_suggestions(service_type: str):
    """Get suggested parts for a service type"""
    try:
        suggested_parts = get_parts_for_service(service_type)
        estimated_cost = get_estimated_parts_cost(service_type)
        
        return {
            "success": True,
            "data": {
                "service_type": service_type,
                "suggested_parts": suggested_parts,
                "estimated_parts_cost": estimated_cost,
                "total_parts_count": len(suggested_parts),
                "required_parts_count": len([p for p in suggested_parts if p.get("required", False)])
            },
            "message": f"{len(suggested_parts)} suggested parts for {service_type}"
        }
    except Exception as e:
        logger.error(f"Error getting part suggestions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/parts/prereserve")
async def prereserve_part(
    order_id: str,
    part_id: str,
    current_user: User = Depends(get_current_user)
):
    """Pre-reserve a part (Mechanic only) - Waits for autoparts confirmation"""
    try:
        if current_user.user_type != "mechanic":
            raise HTTPException(status_code=403, detail="Only mechanics can reserve parts")
        
        # Check part availability
        part = await db.parts.find_one({"id": part_id}, {"_id": 0})
        if not part:
            raise HTTPException(status_code=404, detail="Part not found")
        
        if part["stock"] <= 0:
            raise HTTPException(status_code=400, detail="Part out of stock")
        
        # Create pre-reservation (PENDENTE_CONFIRMACAO)
        from models import PartReservation
        from datetime import timedelta
        
        reservation = PartReservation(
            order_id=order_id,
            part_id=part_id,
            autoparts_id=part["autoparts_id"],
            mechanic_id=current_user.id,
            status="PENDENTE_CONFIRMACAO",
            expires_at=datetime.now(timezone.utc) + timedelta(hours=24)
        )
        
        res_dict = reservation.model_dump()
        res_dict['reserved_at'] = res_dict['reserved_at'].isoformat()
        res_dict['expires_at'] = res_dict['expires_at'].isoformat()
        await db.part_reservations.insert_one(res_dict)
        
        # Update order status
        await db.orders.update_one(
            {"id": order_id},
            {
                "$set": {
                    "needs_parts": True,
                    "part_id": part_id,
                    "autoparts_id": part["autoparts_id"],
                    "part_price": part["price"],
                    "status": "AGUARDANDO_RESERVA_PECA",
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        # Notify AutoPeça
        await create_notification(
            user_id=part["autoparts_id"],
            title="New Part Reservation Request",
            message=f"A mechanic wants to reserve: {part['name']} (£{part['price']}). Please confirm or refuse.",
            notification_type="info",
            related_id=order_id
        )
        
        logger.info(f"Part pre-reserved (pending confirmation): {part_id} for order {order_id}")
        
        return {
            "success": True,
            "data": {
                "reservation_id": reservation.id,
                "part": part,
                "status": "PENDENTE_CONFIRMACAO"
            },
            "message": "Part pre-reserved. Waiting for autoparts confirmation."
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error pre-reserving part: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/autoparts/confirm-reservation/{reservation_id}")
async def confirm_reservation(
    reservation_id: str,
    confirm: bool = True,
    refusal_reason: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Confirm or refuse a part reservation (AutoParts only)"""
    try:
        if current_user.user_type != "autoparts":
            raise HTTPException(status_code=403, detail="Only auto parts shops can confirm reservations")
        
        reservation = await db.part_reservations.find_one(
            {"id": reservation_id, "autoparts_id": current_user.id},
            {"_id": 0}
        )
        
        if not reservation:
            raise HTTPException(status_code=404, detail="Reservation not found")
        
        if reservation["status"] != "PENDENTE_CONFIRMACAO":
            raise HTTPException(status_code=400, detail="Reservation already processed")
        
        if confirm:
            # Generate pickup code
            import random
            import string
            pickup_code = "QM-" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            
            # Update reservation
            await db.part_reservations.update_one(
                {"id": reservation_id},
                {
                    "$set": {
                        "status": "PRONTO_PARA_RETIRADA",
                        "pickup_code": pickup_code,
                        "confirmed_at": datetime.now(timezone.utc).isoformat()
                    }
                }
            )
            
            # Update order
            await db.orders.update_one(
                {"id": reservation["order_id"]},
                {
                    "$set": {
                        "status": "PECA_CONFIRMADA",
                        "pickup_code": pickup_code,
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                }
            )
            
            # Decrease stock
            await db.parts.update_one(
                {"id": reservation["part_id"]},
                {"$inc": {"stock": -1}}
            )
            
            # Notify mechanic
            await create_notification(
                user_id=reservation["mechanic_id"],
                title="Part Ready for Pickup!",
                message=f"Your part reservation has been confirmed. Pickup code: {pickup_code}",
                notification_type="success",
                related_id=reservation["order_id"]
            )
            
            logger.info(f"Reservation confirmed: {pickup_code}")
            
            return {
                "success": True,
                "data": {"pickup_code": pickup_code},
                "message": "Reservation confirmed! Pickup code generated."
            }
        else:
            # Refuse reservation
            await db.part_reservations.update_one(
                {"id": reservation_id},
                {
                    "$set": {
                        "status": "RECUSADO",
                        "refusal_reason": refusal_reason or "Not available"
                    }
                }
            )
            
            # Update order back to ACEITO so mechanic can choose another shop
            await db.orders.update_one(
                {"id": reservation["order_id"]},
                {
                    "$set": {
                        "status": "ACEITO",
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                }
            )
            
            logger.info(f"Reservation refused: {reservation_id}")
            
            return {
                "success": True,
                "message": "Reservation refused. Mechanic will be notified."
            }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error confirming reservation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/autoparts/confirm-pickup")
async def confirm_pickup(pickup_code: str, current_user: User = Depends(get_current_user)):
    """Confirm part pickup (AutoParts only)"""
    try:
        if current_user.user_type != "autoparts":
            raise HTTPException(status_code=403, detail="Only auto parts shops can confirm pickups")
        
        reservation = await db.part_reservations.find_one(
            {"pickup_code": pickup_code, "autoparts_id": current_user.id},
            {"_id": 0}
        )
        
        if not reservation:
            raise HTTPException(status_code=404, detail="Invalid pickup code")
        
        if reservation["status"] == "RETIRADO":
            raise HTTPException(status_code=400, detail="Part already picked up")
        
        # Update reservation
        await db.part_reservations.update_one(
            {"pickup_code": pickup_code},
            {
                "$set": {
                    "status": "RETIRADO",
                    "picked_up_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        # Update order
        await db.orders.update_one(
            {"pickup_code": pickup_code},
            {
                "$set": {
                    "status": "PECA_RETIRADA",
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        logger.info(f"Part picked up: {pickup_code}")
        
        return {
            "success": True,
            "message": "Pickup confirmed successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error confirming pickup: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/orders/{order_id}/accept")
async def accept_order(order_id: str, labor_price: dict, current_user: User = Depends(get_current_user)):
    """Mechanic accepts order and sets labor price"""
    try:
        if current_user.user_type != "mechanic":
            raise HTTPException(status_code=403, detail="Only mechanics can accept orders")
        
        order = await db.orders.find_one({"id": order_id}, {"_id": 0})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Update order with mechanic info
        update_fields = {
            "mechanic_id": current_user.id,
            "labor_price": labor_price.get("labor_price"),
            "status": "ACEITO",
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.orders.update_one(
            {"id": order_id},
            {"$set": update_fields}
        )
        
        # Create notification for client
        await create_notification(
            user_id=order["client_id"],
            title="Order Accepted!",
            message=f"A mechanic has accepted your order for {order['make']} {order['model']}. Labor price: £{labor_price.get('labor_price')}",
            notification_type="success",
            related_id=order_id
        )
        
        logger.info(f"Order {order_id} accepted by mechanic {current_user.id}")
        
        return {"success": True, "message": "Order accepted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error accepting order: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/orders/{order_id}/start-service")
async def start_service(order_id: str, current_user: User = Depends(get_current_user)):
    """Mechanic starts service"""
    try:
        if current_user.user_type != "mechanic":
            raise HTTPException(status_code=403, detail="Only mechanics can start service")
        
        await db.orders.update_one(
            {"id": order_id, "mechanic_id": current_user.id},
            {
                "$set": {
                    "status": "SERVICO_EM_ANDAMENTO",
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        return {"success": True, "message": "Service started"}
    except Exception as e:
        logger.error(f"Error starting service: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/orders/{order_id}/complete-service")
async def complete_service(order_id: str, current_user: User = Depends(get_current_user)):
    """Mechanic completes service"""
    try:
        if current_user.user_type != "mechanic":
            raise HTTPException(status_code=403, detail="Only mechanics can complete service")
        
        await db.orders.update_one(
            {"id": order_id, "mechanic_id": current_user.id},
            {
                "$set": {
                    "status": "SERVICO_FINALIZADO",
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        return {"success": True, "message": "Service completed"}
    except Exception as e:
        logger.error(f"Error completing service: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/autoparts/reservations")
async def get_reservations(current_user: User = Depends(get_current_user)):
    """Get part reservations for autoparts shop"""
    try:
        if current_user.user_type != "autoparts":
            raise HTTPException(status_code=403, detail="Only auto parts shops can view reservations")
        
        reservations = await db.part_reservations.find(
            {"autoparts_id": current_user.id},
            {"_id": 0}
        ).sort("reserved_at", -1).to_list(100)
        
        # Enhance with order and mechanic info
        for res in reservations:
            # Try orders collection first, then fall back to quotes
            order = await db.orders.find_one({"id": res.get("order_id")}, {"_id": 0, "make": 1, "model": 1, "service": 1})
            if not order:
                # Fallback to quotes for backward compatibility
                order = await db.quotes.find_one({"id": res.get("quote_id", res.get("order_id"))}, {"_id": 0, "make": 1, "model": 1, "service": 1})
            
            mechanic = await db.users.find_one({"id": res["mechanic_id"]}, {"_id": 0, "name": 1, "phone": 1})
            part = await db.parts.find_one({"id": res["part_id"]}, {"_id": 0, "name": 1, "price": 1})
            
            if order:
                res["quote_info"] = order
            if mechanic:
                res["mechanic_info"] = mechanic
            if part:
                res["part_info"] = part
        
        return {
            "success": True,
            "data": reservations,
            "message": f"{len(reservations)} reservations found"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching reservations: {str(e)}")
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

# ===== ADMIN ENDPOINTS =====

async def require_admin(current_user: User = Depends(get_current_user)):
    """Ensure user is admin"""
    if current_user.user_type != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@api_router.get("/admin/users")
async def get_all_users(admin: User = Depends(require_admin)):
    """Get all users (admin only)"""
    try:
        users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
        return {
            "success": True,
            "data": users,
            "message": f"{len(users)} users found"
        }
    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.patch("/admin/users/{user_id}/status")
async def update_user_status(
    user_id: str,
    status_data: dict,
    admin: User = Depends(require_admin)
):
    """Update user active status (admin only)"""
    try:
        await db.users.update_one(
            {"id": user_id},
            {"$set": {"is_active": status_data.get("is_active")}}
        )
        
        return {
            "success": True,
            "message": "User status updated"
        }
    except Exception as e:
        logger.error(f"Error updating user status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/payments")
async def get_all_payments(admin: User = Depends(require_admin)):
    """Get all payments (admin only)"""
    try:
        payments = await db.payments.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
        return {
            "success": True,
            "data": payments,
            "message": f"{len(payments)} payments found"
        }
    except Exception as e:
        logger.error(f"Error fetching payments: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/stats")
async def get_admin_stats(admin: User = Depends(require_admin)):
    """Get platform statistics (admin only)"""
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

# ===== NOTIFICATION ENDPOINTS =====

@api_router.get("/notifications")
async def get_notifications(current_user: User = Depends(get_current_user)):
    """Get notifications for current user"""
    try:
        notifications = await db.notifications.find(
            {"user_id": current_user.id},
            {"_id": 0}
        ).sort("created_at", -1).limit(50).to_list(50)
        
        unread_count = await db.notifications.count_documents({
            "user_id": current_user.id,
            "read": False
        })
        
        return {
            "success": True,
            "data": notifications,
            "unread_count": unread_count,
            "message": f"{len(notifications)} notifications found"
        }
    except Exception as e:
        logger.error(f"Error fetching notifications: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.patch("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    """Mark notification as read"""
    try:
        result = await db.notifications.update_one(
            {"id": notification_id, "user_id": current_user.id},
            {"$set": {"read": True}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        return {
            "success": True,
            "message": "Notification marked as read"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error marking notification as read: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/notifications/mark-all-read")
async def mark_all_notifications_read(current_user: User = Depends(get_current_user)):
    """Mark all notifications as read"""
    try:
        result = await db.notifications.update_many(
            {"user_id": current_user.id, "read": False},
            {"$set": {"read": True}}
        )
        
        return {
            "success": True,
            "message": f"{result.modified_count} notifications marked as read"
        }
    except Exception as e:
        logger.error(f"Error marking all notifications as read: {str(e)}")
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