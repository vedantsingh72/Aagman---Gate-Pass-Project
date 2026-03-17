import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  ChevronDown, 
  Home,
  User
} from 'lucide-react';
import { ROLE_LABELS } from '../../utils/constants';
import rgiptLogo from '../../images/RGIPT.png';

/**
 * General Navbar Component
 * Provides navigation: Home, Login (when not authenticated), Profile & Logout (when authenticated)
 */
const GlobalHeader = () => {
  const { user, role, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/login');
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [profileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && profileMenuOpen) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [profileMenuOpen]);

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.rollNo) return user.rollNo;
    if (user?.email) return user.email;
    return 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    if (name.includes(' ')) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Home Link */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center gap-3 text-xl font-bold text-white hover:text-indigo-400 transition-colors"
            >
              <img 
                src={rgiptLogo} 
                alt="RGIPT Logo" 
                className="h-10 w-auto object-contain"
              />
              <span>Aagman</span>
            </Link>
          </div>

          {/* Right Section - Login or Profile */}
          <div className="flex items-center gap-4">
            {isAuthenticated() ? (
              // Profile Dropdown (when authenticated)
              <div className="relative" ref={profileMenuRef}>
                <button
                  ref={profileButtonRef}
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="true"
                  aria-label="Profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold">
                    {getUserInitials()}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-white">
                      {getUserDisplayName()}
                    </div>
                    {role && (
                      <div className="text-xs text-slate-400">
                        {ROLE_LABELS[role] || role}
                      </div>
                    )}
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`text-slate-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    {/* Profile Info Section */}
                    <div className="px-4 py-3 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold">
                          {getUserInitials()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">
                            {getUserDisplayName()}
                          </div>
                          {user?.email && (
                            <div className="text-xs text-slate-400 truncate">
                              {user.email}
                            </div>
                          )}
                          {role && (
                            <div className="text-xs text-indigo-400 mt-0.5">
                              {ROLE_LABELS[role] || role}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Home size={16} />
                        <span>Home</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Login Link (when not authenticated)
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
              >
                <User size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
