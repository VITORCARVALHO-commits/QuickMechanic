# QuickMechanic - API Contracts & Integration Plan

## Mock Data to Replace

### Frontend Mock Files
- `/app/frontend/src/utils/mockData.js` - Contains all mock data:
  - `carMakes` - Car brands and models
  - `serviceTypes` - Service types with base prices
  - `mockMechanics` - Mechanic profiles with reviews
  - `mockBookings` - Sample bookings

## API Endpoints to Implement

### 1. Quote/Pricing API
**POST /api/quote/calculate**
- Purpose: AI-powered price calculation
- Request:
  ```json
  {
    "carMake": "volkswagen",
    "carModel": "Gol",
    "carYear": "2020",
    "service": "oil_change",
    "location": "São Paulo, SP",
    "description": "Need oil change for my car"
  }
  ```
- Response:
  ```json
  {
    "estimatedPrice": 180,
    "serviceId": "oil_change",
    "breakdown": {
      "labor": 150,
      "aiAdjustment": 30
    }
  }
  ```
- Uses: Emergent LLM for intelligent pricing

### 2. Mechanics API
**GET /api/mechanics/search**
- Query params: `service`, `location`, `mobile`, `workshop`
- Returns: List of mechanics matching criteria

**GET /api/mechanics/:id**
- Returns: Full mechanic profile with reviews

### 3. Bookings API
**POST /api/bookings**
- Create new booking
- Request:
  ```json
  {
    "mechanicId": "1",
    "serviceType": "oil_change",
    "date": "2025-07-10",
    "time": "14:00",
    "address": "Rua Example, 123",
    "carInfo": {
      "make": "volkswagen",
      "model": "Gol",
      "year": "2020"
    },
    "notes": "Additional info",
    "estimatedPrice": 180
  }
  ```

**GET /api/bookings/user/:userId**
- Returns: All bookings for user

**PATCH /api/bookings/:id/status**
- Update booking status (confirmed, completed, cancelled)

### 4. Reviews API
**POST /api/reviews**
- Create review for completed service

**GET /api/reviews/mechanic/:mechanicId**
- Get all reviews for mechanic

### 5. Auth API (with Emergent Google Auth)
**POST /api/auth/google**
- Google OAuth login/signup
- Returns JWT token

**GET /api/auth/me**
- Get current user info

## Database Models

### User
```python
{
  "id": str,
  "email": str,
  "name": str,
  "phone": str,
  "role": str,  # "client" or "mechanic"
  "created_at": datetime
}
```

### Mechanic
```python
{
  "id": str,
  "user_id": str,  # Reference to User
  "photo": str,
  "rating": float,
  "review_count": int,
  "specialties": List[str],
  "mobile": bool,
  "workshop": bool,
  "location": str,
  "years_experience": int,
  "certifications": List[str],
  "about": str,
  "approved": bool
}
```

### Booking
```python
{
  "id": str,
  "user_id": str,
  "mechanic_id": str,
  "service_type": str,
  "date": str,
  "time": str,
  "address": str,
  "car_info": dict,
  "notes": str,
  "estimated_price": float,
  "status": str,  # pending, confirmed, completed, cancelled
  "created_at": datetime
}
```

### Review
```python
{
  "id": str,
  "booking_id": str,
  "mechanic_id": str,
  "user_id": str,
  "rating": int,  # 1-5
  "comment": str,
  "created_at": datetime
}
```

## Frontend Integration Changes

### Pages to Update:
1. **Home.jsx** - Replace quote calculation with API call
2. **SearchBooking.jsx** - Fetch mechanics from API
3. **BookingPage.jsx** - POST booking to API
4. **MechanicProfile.jsx** - Fetch mechanic details from API
5. **Dashboard.jsx** - Fetch user bookings from API

### API Client Setup:
- Create `/app/frontend/src/services/api.js` with axios instance
- Add authentication token handling
- Error handling and loading states

## AI Integration (Emergent LLM)

### Price Calculation AI
- Input: Car info, service type, description
- Output: Estimated price with reasoning
- Model: Use Emergent LLM key for GPT-4 equivalent

### Implementation:
```python
# In backend
from emergentintegrations import EmergentAI

ai = EmergentAI(api_key=os.environ['EMERGENT_LLM_KEY'])

response = ai.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "system",
        "content": "You are a car repair pricing expert..."
    }, {
        "role": "user", 
        "content": f"Calculate price for {service} on {car}..."
    }]
)
```

## Mock Payment Implementation

### Payment Flow:
1. Booking confirmed - No payment yet
2. Service completed - Show payment button (mock)
3. Payment processed - Update booking status
4. Payment endpoint: `POST /api/payments/process` (returns success mock)

## Next Steps:
1. ✅ Frontend with mock data (DONE)
2. 🔄 Install Emergent integrations for AI
3. 🔄 Create backend models and endpoints
4. 🔄 Replace frontend mock calls with real API
5. 🔄 Test complete flow
6. 🔄 Add Google Auth integration
