import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from './Loading';

/**
 * ProtectedRoute Component
 * Protects routes that require authentication and specific roles
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, loading, token } = useAuth();
  if (loading) {
    return <Loading message="Loading..." />;
  }

  if (!token || !isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles.length > 0) {
    if (!role) {
      return <Loading message="Verifying access..." />;
    }

    const normalizedRole = role?.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
    
    if (!normalizedAllowedRoles.includes(normalizedRole)) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Required role: {allowedRoles.join(', ')}
            </p>
            <p className="text-sm text-gray-500">
              Your role: {role || 'Unknown'}
            </p>
          </div>
        </div>
      );
    }
  }

 
  return children;
};

export default ProtectedRoute;

