import React from 'react';
import { Button } from './ui/button';
import { Chrome } from 'lucide-react';

export const GoogleLoginButton = ({ onSuccess }) => {
  const handleGoogleLogin = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/google/callback&response_type=token&scope=openid email profile`;
    
    // Open popup
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const popup = window.open(
      googleAuthUrl,
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for message from popup
    window.addEventListener('message', async (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        const { access_token } = event.data;
        
        try {
          const API_URL = process.env.REACT_APP_BACKEND_URL;
          const response = await fetch(`${API_URL}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: access_token })
          });
          
          const data = await response.json();
          if (data.success) {
            onSuccess(data);
          }
        } catch (error) {
          console.error('Google login error:', error);
        }
        
        popup?.close();
      }
    });
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      variant="outline"
      className="w-full flex items-center gap-2"
    >
      <Chrome className="h-5 w-5" />
      Continuar com Google
    </Button>
  );
};
