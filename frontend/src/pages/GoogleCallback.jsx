import React, { useEffect } from 'react';

export const GoogleCallback = () => {
  useEffect(() => {
    // Get token from URL hash
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    if (accessToken && window.opener) {
      // Send token to parent window
      window.opener.postMessage({
        type: 'GOOGLE_AUTH_SUCCESS',
        access_token: accessToken
      }, window.location.origin);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#1EC6C6] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Autenticando com Google...</p>
      </div>
    </div>
  );
};
