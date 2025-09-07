"use client";
import { useEffect } from 'react';
import { useHydratedUserStore, useUserStore } from '../../stores/userStore';

export default function AuthSuccess() {
  const { setUser, clearUser, isHydrated } = useHydratedUserStore();

  useEffect(() => {
    if (!isHydrated) return; // Wait for Zustand to hydrate
    
    const handleGoogleAuthSuccess = async () => {
      try {
        console.log('Starting Google auth success handling...');
        
        // Extract tokens from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');

        console.log('Extracted tokens:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken 
        });

        if (accessToken && refreshToken) {
          // Clear any existing tokens and user data first
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          clearUser();
          console.log('Cleared previous auth data');

          // Store new tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          console.log('Stored new tokens in localStorage');

          // Fetch user data using the token
          console.log('Fetching user data from API...');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
            credentials: 'include',
          });

          console.log('API response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('API response data:', data);
            
            // Store user data in Zustand store
            setUser(data.user);
            console.log('User data stored in Zustand:', data.user);
            
            // Verify Zustand storage
            setTimeout(() => {
              const currentStore = useUserStore.getState();
              console.log('Current Zustand state after setUser:', {
                user: currentStore.user,
                isLoggedIn: currentStore.isLoggedIn
              });
            }, 100);
            
            // Redirect to home page
            setTimeout(() => {
              console.log('Redirecting to home page...');
              window.location.replace('/home');
            }, 1000);
          } else {
            const errorData = await response.text();
            console.error('Failed to fetch user data:', response.status, errorData);
            window.location.replace('/Auth?error=auth_failed');
          }
        } else {
          console.error('No tokens found in URL parameters');
          window.location.replace('/Auth?error=no_tokens');
        }
      } catch (error) {
        console.error('Error during Google auth success handling:', error);
        window.location.replace('/Auth?error=auth_error');
      }
    };

    handleGoogleAuthSuccess();
  }, [setUser, clearUser, isHydrated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing authentication...</h2>
        <p className="text-gray-600">Please wait while we set up your account.</p>
      </div>
    </div>
  );
}
