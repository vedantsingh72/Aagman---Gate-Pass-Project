import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const backdropRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated()) {
    return null;
  }

 
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

 
  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      setIsOpen(false);
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleClose = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };


  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

 
  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };


  const loginItems = [
    { label: 'Student Login', path: '/login?role=user', role: 'user' },
    { label: 'Department Login', path: '/login?role=department', role: 'department' },
    { label: 'Academic Login', path: '/login?role=academic', role: 'academic' },
    { label: 'Hostel Office Login', path: '/login?role=hosteloffice', role: 'hosteloffice' },
    { label: 'Gate Login', path: '/login?role=gate', role: 'gate' },
  ];

  const registerItems = [
    { label: 'Student Register', path: '/register/student' },
    { label: 'Department Register', path: '/register/department' },
    { label: 'Academic Register', path: '/register/academic' },
    { label: 'Hostel Office Register', path: '/register/hosteloffice' },
    { label: 'Gate Register', path: '/register/gate' },
  ];

  return (
    <>
    
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Login or Register"
      >
        <span>Login / Register</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

     
      {isOpen && (
        <div
          ref={backdropRef}
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          aria-hidden="true"
        >
         
          <div
            ref={menuRef}
            onClick={handleModalClick}
            className="absolute right-4 top-20 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transform transition-all duration-200 ease-out"
            style={{
              animation: 'fadeIn 0.2s ease-out',
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-menu-title"
          >
        
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 id="auth-menu-title" className="text-sm font-semibold text-gray-900">
                Login / Register
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                aria-label="Close menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="py-2 max-h-96 overflow-y-auto">
            
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Login
                </h3>
              </div>
              <div className="py-1">
                {loginItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigate(item.path);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 focus:outline-none focus:bg-blue-50 focus:text-blue-600"
                    role="menuitem"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              
              <div className="px-4 py-2 border-t border-b border-gray-200 mt-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Register
                </h3>
              </div>
              <div className="py-1">
                {registerItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigate(item.path);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 focus:outline-none focus:bg-blue-50 focus:text-blue-600"
                    role="menuitem"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthMenu;

