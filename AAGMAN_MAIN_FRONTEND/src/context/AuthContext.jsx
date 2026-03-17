import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../services/auth.service';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    
    setToken(null);
    setUser(null);
    setRole(null);
  };

  const login = (token, userData, userRole) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userRole);
    
    setToken(token);
    setUser(userData);
    setRole(userRole);
  };


  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        let storedRole = localStorage.getItem('role');
        const storedUser = localStorage.getItem('user');

        if (storedToken) {
          setToken(storedToken);
          if (!storedRole && storedToken) {
            try {              const tokenParts = storedToken.split('.');
              if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                storedRole = payload.role;
                if (storedRole) {
                  localStorage.setItem('role', storedRole);
                }
              }
            } catch (error) {
              console.warn('Failed to decode role from token:', error);
            }
          }

          if (storedRole) {
            setRole(storedRole);
          }
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
            } catch (error) {
              console.error('Failed to parse user data from localStorage:', error);
              localStorage.removeItem('user');
            }
          }

         
          try {
            const response = await getProfile();
            if (response && response.data) {
              setUser(response.data);
              localStorage.setItem('user', JSON.stringify(response.data));
              
             
            }
          } catch (error) {
          
            if (error.response?.status === 401) {
            
              console.log('Token invalid, clearing auth');
              logout();
            } else {
          
              console.warn('Failed to fetch fresh user profile (using cached data):', error.message);
            
              if (!storedUser) {
                console.log('No cached user data, clearing auth');
                logout();
              }
          
            }
          }
        }
      } catch (error) {

        console.error('Error during auth initialization:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has valid token
   */
  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    user,
    role,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

