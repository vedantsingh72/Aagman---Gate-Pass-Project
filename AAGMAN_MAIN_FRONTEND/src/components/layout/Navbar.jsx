import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS } from '../../utils/constants';
import AuthMenu from '../common/AuthMenu';
import rgiptLogo from '../../images/RGIPT.png';


const Navbar = () => {
  const { user, role, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={rgiptLogo} 
                alt="RGIPT Logo" 
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl font-bold">Aagman</span>
            </Link>
            {role && (
              <span className="text-sm bg-blue-700 px-3 py-1 rounded">
                {ROLE_LABELS[role] || role}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated() ? (
              <AuthMenu />
            ) : (
              <>
                {user && (
                  <span className="text-sm">
                    {user.name || user.rollNo || 'User'}
                  </span>
                )}
                {user && (
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                  >
                    Logout
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

