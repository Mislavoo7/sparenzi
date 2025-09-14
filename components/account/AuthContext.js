import React, { createContext, useState, useEffect } from 'react';
import config from '@/components/helpers/config';
import apiRoutes from '@/components/helpers/apiRoutes';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state for initial auth check

  const setGlobalSettings = (userData) => {
    if (userData) {
      let parsed;

      if (userData["success"]) {
        parsed = userData["user"];
      } else {
        parsed = userData;
      }
      global.language = parsed.language?.toUpperCase() || config.locale;
      global.currency = parsed["currency"] || config.currency; 
      global.theme = parsed.theme || config.theme;
    }
  };

  // Validate token with backend
  const validateToken = async (tokenToValidate) => {
    try {
      const response = await fetch(`${apiRoutes.baseUrl}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenToValidate}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        return { isValid: true, userData };
      } else {
        return { isValid: false, userData: null };
      }
    } catch (error) {
      console.error('Error validating token:', error);
      return { isValid: false, userData: null };
    }
  };

  const updateProfile = async () => {
    if (!token) {
      console.log('No token available for profile update');
      return;
    }
    
    try {
      setIsUpdatingProfile(true);
      const response = await fetch(`${apiRoutes.baseUrl}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, logout user
          await logout();
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedUserData = await response.json();
      
      // Update SecureStore with new user data
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUserData));
      
      // Update state and global settings
      setGlobalSettings(updatedUserData);
      setUser(updatedUserData);
      
      console.log('Profile updated successfully');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      // Optionally handle error (show toast, etc.)
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const login = async (newToken, userData) => {
    await SecureStore.setItemAsync('authToken', newToken);
    await SecureStore.setItemAsync('user', JSON.stringify(userData));
    setToken(newToken);
    setGlobalSettings(userData);
    setUser(userData);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('user');
    setToken(null);
    setUser(null);
    // Reset global settings to defaults
    global.language = config.locale;
    global.currency = config.currency;
    global.theme = config.theme;
  };

  const loadAuth = async () => {
    try {
      setIsLoading(true);
      
      const savedToken = await SecureStore.getItemAsync('authToken');
      const savedUser = await SecureStore.getItemAsync('user');
      
      if (savedToken && savedUser) {
        console.log('Found saved token, validating...');
        
        // Validate token with backend
        const { isValid, userData } = await validateToken(savedToken);
        
        if (isValid) {
          console.log('Token is valid, logging in user');
          setToken(savedToken);
          // Use fresh userData from validation or fall back to saved user
          const userDataToUse = userData || JSON.parse(savedUser);

          setGlobalSettings(userDataToUse["user"]);
          setUser(userDataToUse["user"]);

          // Update stored user data with fresh data if available
          if (userData) {
            await SecureStore.setItemAsync('user', JSON.stringify(userData));
          }
        } else {
          console.log('Token is invalid or expired, logging out');
          // Token is invalid, clear stored data
          await logout();
        }
      } else {
        console.log('No saved authentication found');
      }
    } catch (error) {
      console.error('Error loading auth:', error);
      // On error, it's safer to logout to ensure clean state
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      login, 
      logout, 
      updateProfile,
      isUpdatingProfile,
      isLoading // Expose loading state so components can show loading indicators
    }}>
      {children}
    </AuthContext.Provider>
  );
};
