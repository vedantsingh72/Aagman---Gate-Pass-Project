import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from './Loading';

/**
 * PublicRoute Component
 * Ensures public routes (login, register) are accessible without authentication
 * Redirects to dashboard if user is already authenticated
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, role, loading } = useAuth();


  if (loading) {
    return <Loading message="Loading..." />;
  }

  if (isAuthenticated()) {
    const roleRoutes = {
      user: '/student/dashboard',
      department: '/department/dashboard',
      academic: '/academic/dashboard',
      hosteloffice: '/hostel/dashboard',
      gate: '/gate/dashboard',
    };

    const redirectPath = roleRoutes[role] || '/student/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PublicRoute;
