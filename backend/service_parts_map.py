# Service to Parts Mapping
# Maps each service type to common parts that may be required

SERVICE_PARTS_MAP = {
    "oil_change": [
        {"name": "Engine Oil Filter", "typical_price": 8.50, "required": True},
        {"name": "Engine Oil (5L)", "typical_price": 25.00, "required": True},
        {"name": "Sump Plug Washer", "typical_price": 1.50, "required": True},
        {"name": "Air Filter", "typical_price": 12.00, "required": False},
    ],
    "brakes": [
        {"name": "Brake Pads (Front)", "typical_price": 45.00, "required": True},
        {"name": "Brake Pads (Rear)", "typical_price": 38.00, "required": False},
        {"name": "Brake Discs (Front Pair)", "typical_price": 85.00, "required": False},
        {"name": "Brake Discs (Rear Pair)", "typical_price": 70.00, "required": False},
        {"name": "Brake Fluid", "typical_price": 8.00, "required": True},
    ],
    "suspension": [
        {"name": "Front Shock Absorbers (Pair)", "typical_price": 120.00, "required": True},
        {"name": "Rear Shock Absorbers (Pair)", "typical_price": 110.00, "required": False},
        {"name": "Suspension Spring", "typical_price": 45.00, "required": False},
        {"name": "Anti-Roll Bar Link", "typical_price": 25.00, "required": False},
    ],
    "battery": [
        {"name": "Car Battery", "typical_price": 85.00, "required": True},
        {"name": "Battery Terminal Cleaner", "typical_price": 5.00, "required": False},
    ],
    "air_conditioning": [
        {"name": "AC Refrigerant Gas", "typical_price": 35.00, "required": True},
        {"name": "AC Filter", "typical_price": 15.00, "required": True},
        {"name": "AC Compressor Oil", "typical_price": 12.00, "required": False},
    ],
    "transmission": [
        {"name": "Gearbox Oil", "typical_price": 45.00, "required": True},
        {"name": "Transmission Filter", "typical_price": 28.00, "required": True},
    ],
    "clutch": [
        {"name": "Clutch Kit", "typical_price": 180.00, "required": True},
        {"name": "Clutch Release Bearing", "typical_price": 35.00, "required": True},
        {"name": "Flywheel", "typical_price": 150.00, "required": False},
    ],
    "maintenance": [
        {"name": "Engine Oil Filter", "typical_price": 8.50, "required": True},
        {"name": "Engine Oil (5L)", "typical_price": 25.00, "required": True},
        {"name": "Air Filter", "typical_price": 12.00, "required": True},
        {"name": "Cabin Filter", "typical_price": 15.00, "required": True},
        {"name": "Spark Plugs (Set of 4)", "typical_price": 32.00, "required": False},
    ],
    "tyres": [
        {"name": "Tyre (Single)", "typical_price": 65.00, "required": True},
        {"name": "Wheel Balancing Weights", "typical_price": 3.00, "required": True},
        {"name": "Valve Stem", "typical_price": 2.50, "required": False},
    ],
    "exhaust": [
        {"name": "Exhaust Silencer", "typical_price": 85.00, "required": False},
        {"name": "Exhaust Manifold", "typical_price": 120.00, "required": False},
        {"name": "Exhaust Clamps", "typical_price": 8.00, "required": True},
        {"name": "Exhaust Gasket", "typical_price": 12.00, "required": True},
    ],
    "electrical": [
        {"name": "Alternator Belt", "typical_price": 18.00, "required": False},
        {"name": "Fuses Set", "typical_price": 10.00, "required": False},
        {"name": "Bulb Set", "typical_price": 15.00, "required": False},
    ],
    "diagnostic": [],  # No parts typically required for diagnostic
    "mot": [],  # MOT is inspection only
    "engine": [
        {"name": "Engine Gasket Set", "typical_price": 75.00, "required": False},
        {"name": "Timing Belt Kit", "typical_price": 95.00, "required": False},
        {"name": "Water Pump", "typical_price": 65.00, "required": False},
    ],
}


def get_parts_for_service(service_type: str):
    """Get list of parts typically needed for a service"""
    return SERVICE_PARTS_MAP.get(service_type, [])


def get_required_parts_for_service(service_type: str):
    """Get only required parts for a service"""
    all_parts = SERVICE_PARTS_MAP.get(service_type, [])
    return [part for part in all_parts if part.get("required", False)]


def get_estimated_parts_cost(service_type: str, include_optional: bool = False):
    """Calculate estimated cost of parts for a service"""
    parts = get_parts_for_service(service_type)
    
    if include_optional:
        return sum(part["typical_price"] for part in parts)
    else:
        return sum(part["typical_price"] for part in parts if part.get("required", False))
