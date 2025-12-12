from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime, timezone
import uuid

# ===== USER MODELS =====
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None
    user_type: str = "client"  # client, mechanic, admin

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password_hash: str
    name: str
    phone: Optional[str] = None
    user_type: str = "client"
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Mechanic-specific fields
    rating: Optional[float] = None
    review_count: Optional[int] = 0
    specialties: Optional[List[str]] = []
    location: Optional[str] = None
    years_experience: Optional[int] = None
    mobile_service: Optional[bool] = False
    workshop_service: Optional[bool] = False

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    phone: Optional[str]
    user_type: str
    is_active: bool
    rating: Optional[float] = None
    review_count: Optional[int] = None

# Vehicle Model
class Vehicle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    plate: str
    make: str
    make_name: str
    model: str
    year: str
    color: str
    fuel: str
    version: str
    category: str
    power: Optional[str] = None
    transmission: Optional[str] = None
    doors: Optional[str] = None
    engine_size: Optional[str] = None
    co2: Optional[str] = None
    mpg: Optional[str] = None
    country: str = "UK"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class VehicleResponse(BaseModel):
    success: bool
    data: Optional[Vehicle] = None
    message: Optional[str] = None

# ===== QUOTE MODELS =====
class QuoteCreate(BaseModel):
    plate: str
    make: str
    model: str
    year: str
    color: Optional[str] = None
    fuel: Optional[str] = None
    version: Optional[str] = None
    category: Optional[str] = None
    service: str
    location: str
    description: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    location_type: Optional[str] = "mobile"

# ===== VEHICLE MODEL =====
class Vehicle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    plate: str  # OBRIGATÓRIO
    make: str
    model: str
    year: str
    color: Optional[str] = None
    fuel: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class VehicleCreate(BaseModel):
    plate: str
    make: str
    model: str
    year: str
    color: Optional[str] = None
    fuel: Optional[str] = None

# ===== ORDER MODEL (antes Quote) =====
class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: Optional[str] = None
    mechanic_id: Optional[str] = None
    vehicle_id: Optional[str] = None
    
    # Vehicle info (copy for history)
    plate: str
    make: str
    model: str
    year: str
    
    service: str
    location: str
    description: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    location_type: Optional[str] = "mobile"
    
    # Pricing
    labor_price: Optional[float] = None  # Mão de obra
    estimated_price: Optional[float] = None
    final_price: Optional[float] = None
    travel_fee: Optional[float] = 0.0
    
    # Pre-booking
    prebooking_paid: bool = False
    prebooking_amount: float = 50.0  # R$ 50 no Brasil
    
    # Status simples: pending → quoted → accepted → paid → in_progress → completed
    status: str = "pending"
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    vehicle_id: str
    service: str
    location: str
    description: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    location_type: Optional[str] = "mobile"

# Keep Quote for backward compatibility
Quote = Order

class QuoteResponse(BaseModel):
    success: bool
    data: Optional[Quote] = None
    message: Optional[str] = None

class QuoteUpdateStatus(BaseModel):
    status: str
    final_price: Optional[float] = None
    mechanic_id: Optional[str] = None

# ===== PAYMENT MODELS =====
class PaymentCreate(BaseModel):
    quote_id: str
    amount: float
    payment_method: str = "mock"  # mock, stripe, etc
    payment_type: str = "prebooking"  # prebooking, final

class Payment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    quote_id: str
    client_id: str
    amount: float
    payment_method: str
    payment_type: str = "final"  # prebooking, final
    platform_fee: Optional[float] = None
    mechanic_earnings: Optional[float] = None
    status: str = "completed"  # pending, completed, failed, refunded
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ===== WALLET MODELS =====
class Wallet(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    mechanic_id: str
    available_balance: float = 0.0
    pending_balance: float = 0.0
    total_earned: float = 0.0
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PayoutRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    mechanic_id: str
    amount: float
    status: str = "pending"  # pending, approved, paid, rejected
    requested_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    processed_at: Optional[datetime] = None
