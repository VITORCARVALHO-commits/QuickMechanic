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
    user_type: str = "client"  # client, mechanic, admin, autoparts

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
    
    # AutoParts-specific fields
    shop_name: Optional[str] = None
    shop_address: Optional[str] = None
    opening_hours: Optional[str] = None
    postcode: Optional[str] = None

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

class Quote(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: Optional[str] = None
    mechanic_id: Optional[str] = None
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
    estimated_price: Optional[float] = None
    final_price: Optional[float] = None
    travel_fee: Optional[float] = 0.0  # Taxa de deslocamento negociável
    prebooking_paid: bool = False  # Se pagou os £12 de pre-booking
    prebooking_amount: float = 12.0  # Valor fixo de pre-booking
    
    # Parts-related fields
    needs_parts: bool = False
    part_id: Optional[str] = None
    autoparts_id: Optional[str] = None
    part_price: Optional[float] = None
    pickup_code: Optional[str] = None
    part_status: Optional[str] = None  # reserved, picked_up, completed
    
    status: str = "pending"  # pending, prebooked, quoted, accepted, paid, in_progress, completed, cancelled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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

# ===== AUTOPARTS MODELS =====
class Part(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    autoparts_id: str
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    car_make: Optional[str] = None  # Compatible car brand
    car_model: Optional[str] = None  # Compatible car model
    service_type: Optional[str] = None  # What service this part is for
    part_number: Optional[str] = None
    is_available: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PartCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    car_make: Optional[str] = None
    car_model: Optional[str] = None
    service_type: Optional[str] = None
    part_number: Optional[str] = None

class PartReservation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    quote_id: str
    part_id: str
    autoparts_id: str
    mechanic_id: str
    pickup_code: str
    status: str = "reserved"  # reserved, picked_up, cancelled
    reserved_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    picked_up_at: Optional[datetime] = None
    expires_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))  # 24h expiry

class PaymentSplit(BaseModel):
    payment_id: str
    quote_id: str
    total_amount: float
    mechanic_amount: float
    autoparts_amount: float
    platform_amount: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
