import os
import logging
from typing import Optional
import httpx

logger = logging.getLogger(__name__)

GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', '')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', '')
GOOGLE_REDIRECT_URI = os.environ.get('GOOGLE_REDIRECT_URI', 'http://localhost:3000/auth/google/callback')

async def verify_google_token(token: str) -> Optional[dict]:
    """Verify Google OAuth token and get user info"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                headers={'Authorization': f'Bearer {token}'}
            )
            
            if response.status_code == 200:
                return response.json()
            
            logger.error(f"Google token verification failed: {response.status_code}")
            return None
    except Exception as e:
        logger.error(f"Error verifying Google token: {str(e)}")
        return None

async def get_google_auth_url() -> str:
    """Generate Google OAuth URL"""
    base_url = 'https://accounts.google.com/o/oauth2/v2/auth'
    params = {
        'client_id': GOOGLE_CLIENT_ID,
        'redirect_uri': GOOGLE_REDIRECT_URI,
        'response_type': 'token',
        'scope': 'openid email profile',
        'access_type': 'online'
    }
    
    query = '&'.join([f'{k}={v}' for k, v in params.items()])
    return f'{base_url}?{query}'
