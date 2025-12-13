import math
import logging

logger = logging.getLogger(__name__)

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points using Haversine formula (in km)"""
    R = 6371  # Earth radius in km
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    distance = R * c
    return round(distance, 2)

def calculate_travel_fee(distance_km: float) -> float:
    """Calculate travel fee based on distance"""
    if distance_km <= 5:
        return 0  # Free for nearby
    elif distance_km <= 10:
        return 20  # R$ 20 for 5-10km
    elif distance_km <= 20:
        return 40  # R$ 40 for 10-20km
    else:
        return 60  # R$ 60 for 20km+

async def find_nearby_mechanics(db, client_lat: float, client_lon: float, max_distance_km: float = 20):
    """Find mechanics within specified distance"""
    try:
        mechanics = await db.users.find(
            {'user_type': 'mechanic', 'is_active': True, 'approval_status': 'approved'},
            {'_id': 0}
        ).to_list(100)
        
        nearby = []
        for mechanic in mechanics:
            if mechanic.get('latitude') and mechanic.get('longitude'):
                distance = calculate_distance(
                    client_lat, client_lon,
                    mechanic['latitude'], mechanic['longitude']
                )
                
                if distance <= max_distance_km:
                    mechanic['distance'] = distance
                    mechanic['travel_fee'] = calculate_travel_fee(distance)
                    nearby.append(mechanic)
        
        # Sort by distance
        nearby.sort(key=lambda x: x['distance'])
        return nearby
    except Exception as e:
        logger.error(f"Error finding nearby mechanics: {str(e)}")
        return []
