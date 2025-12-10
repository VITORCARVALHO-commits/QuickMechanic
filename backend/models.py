from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

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
    created_at: datetime = Field(default_factory=datetime.utcnow)

class VehicleResponse(BaseModel):
    success: bool
    data: Optional[Vehicle] = None
    message: Optional[str] = None

# Quote Model
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

class Quote(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
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
    estimated_price: Optional[float] = None
    status: str = "pending"  # pending, processed, completed
    created_at: datetime = Field(default_factory=datetime.utcnow)

class QuoteResponse(BaseModel):
    success: bool
    data: Optional[Quote] = None
    message: Optional[str] = None
