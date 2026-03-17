import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, LogIn, LogOut, Home as HomeIcon } from 'lucide-react';
import { ROLE_LABELS } from '../../utils/constants';
import './PillNav.css';

/**
 * PillNav Component
 * Animated pill-style navigation bar with profile/login functionality
 */
const PillNav = ({
  items = [],
  className = '',
  baseColor = '#fff',
  pillColor = '#060010',
  hoveredPillTextColor = '#060010',
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout, isAuthenticated } = useAuth();
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  
  // Separate Home item from other items
  const homeItem = items?.find(item => item.href === "/" || item.label === "Home" || item.label === "Aagman");
  const otherItems = items?.filter(item => item.href !== "/" && item.label !== "Home" && item.label !== "Aagman") || [];
  const navItems = homeItem ? [homeItem, ...otherItems] : otherItems;
  
  const circleRefs = useRef([]);
  const logoRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);

  useEffect(() => {
    // Layout calculation for pill circles
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;
      });
    };

    layout();
    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    // Initial load animation
    if (initialLoadAnimation) {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;

      if (logo) {
        logo.style.transform = 'scale(0)';
        setTimeout(() => {
          logo.style.transition = 'transform 0.6s ease-out';
          logo.style.transform = 'scale(1)';
        }, 10);
      }

      if (navItems) {
        navItems.style.width = '0';
        navItems.style.overflow = 'hidden';
        setTimeout(() => {
          navItems.style.transition = 'width 0.6s ease-out';
          navItems.style.width = 'auto';
        }, 10);
      }
    }

    return () => window.removeEventListener('resize', onResize);
  }, [items, initialLoadAnimation]);

  const handleEnter = (index) => {
    const circle = circleRefs.current[index];
    const pill = circle?.parentElement;
    if (!pill) return;

    const label = pill.querySelector('.pill-label');
    const white = pill.querySelector('.pill-label-hover');

    if (circle) {
      circle.style.transition = 'transform 0.3s ease-out';
      circle.style.transform = 'scale(1.2)';
    }

    if (label) {
      label.style.transition = 'transform 0.3s ease-out';
      label.style.transform = 'translateY(-100%)';
    }

    if (white) {
      white.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
      white.style.transform = 'translateY(0)';
      white.style.opacity = '1';
    }
  };

  const handleLeave = (index) => {
    const circle = circleRefs.current[index];
    const pill = circle?.parentElement;
    if (!pill) return;

    const label = pill.querySelector('.pill-label');
    const white = pill.querySelector('.pill-label-hover');

    if (circle) {
      circle.style.transition = 'transform 0.2s ease-out';
      circle.style.transform = 'scale(0)';
    }

    if (label) {
      label.style.transition = 'transform 0.2s ease-out';
      label.style.transform = 'translateY(0)';
    }

    if (white) {
      white.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
      white.style.transform = 'translateY(100%)';
      white.style.opacity = '0';
    }
  };

  const handleLogoEnter = () => {
    const logo = logoRef.current?.querySelector('img');
    if (logo) {
      logo.style.transition = 'transform 0.2s ease-out';
      logo.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        logo.style.transform = 'rotate(0deg)';
      }, 200);
    }
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        lines[0].style.transform = 'rotate(45deg) translateY(3px)';
        lines[1].style.transform = 'rotate(-45deg) translateY(-3px)';
      } else {
        lines[0].style.transform = 'rotate(0deg) translateY(0)';
        lines[1].style.transform = 'rotate(0deg) translateY(0)';
      }
    }

    if (menu) {
      if (newState) {
        menu.style.visibility = 'visible';
        menu.style.opacity = '1';
        menu.style.transform = 'translateY(0)';
      } else {
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(10px)';
        setTimeout(() => {
          menu.style.visibility = 'hidden';
        }, 200);
      }
    }

    onMobileMenuClick?.();
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    navigate('/login');
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isProfileMenuOpen]);

  const isActive = (item) => {
    if (item.href === "/") {
      return location.pathname === "/";
    }
    return location.pathname?.startsWith(item.href);
  };

  const getUserDisplayName = () => {
    if (user?.name) return user.name.split(' ')[0];
    if (user?.rollNo) return user.rollNo;
    if (user?.email) return user.email.split('@')[0];
    return 'Profile';
  };

  const getUserInitials = () => {
    const name = user?.name || user?.rollNo || user?.email || 'U';
    if (name.includes(' ')) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return name.slice(0, 2).toUpperCase();
  };

  const cssVars = {
    ['--base']: 'transparent',
    ['--pill-bg']: 'transparent',
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor
  };

  // Default items if none provided
  const defaultItems = homeItem ? [] : [{ href: '/', label: 'Aagman' }];
  const finalItems = items.length > 0 ? navItems : defaultItems;

  return (
    <div className="pill-nav-container">
      <nav className={`pill-nav ${className}`} aria-label="Primary" style={cssVars}>
        {/* Logo/Home */}
        {homeItem && (
          <Link
            className="pill-logo"
            to={homeItem.href || '/'}
            aria-label="Home"
            role="menuitem"
            ref={logoRef}
            onMouseEnter={handleLogoEnter}
          >
            <span className="text-xl font-bold text-white">Aagman</span>
          </Link>
        )}

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {otherItems.map((item, i) => {
              const active = isActive(item);
              return (
                <li key={item.href || `item-${i}`} role="none">
                  <Link
                    role="menuitem"
                    to={item.href || '#'}
                    className={`pill${active ? ' is-active' : ''}`}
                    aria-label={item.ariaLabel || item.label}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                  >
                    <span className="pill-circle" ref={el => circleRefs.current[i] = el}></span>
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover">{item.label}</span>
                  </Link>
                </li>
              );
            })}
            
            {/* Profile/Login Link - Desktop */}
            <li role="none" className="relative" ref={profileMenuRef}>
              {isAuthenticated() ? (
                <>
                  <button
                    role="menuitem"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="pill"
                    aria-label="Profile"
                    aria-expanded={isProfileMenuOpen}
                    onMouseEnter={() => handleEnter(otherItems.length)}
                    onMouseLeave={() => handleLeave(otherItems.length)}
                  >
                    <span className="pill-circle" ref={el => circleRefs.current[otherItems.length] = el}></span>
                    <span className="pill-label flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {getUserDisplayName()}
                    </span>
                    <span className="pill-label-hover flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {getUserDisplayName()}
                    </span>
                  </button>
                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-white/5">
                        <div className="text-sm font-medium text-white truncate">
                          {user?.name || user?.rollNo || user?.email || 'User'}
                        </div>
                        {user?.email && (
                          <div className="text-xs text-slate-400 truncate mt-0.5">
                            {user.email}
                          </div>
                        )}
                        {role && (
                          <div className="text-xs text-indigo-400 mt-0.5">
                            {ROLE_LABELS[role] || role}
                          </div>
                        )}
                      </div>
                      <div className="py-2">
                        <Link
                          to="/"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <HomeIcon className="w-4 h-4" />
                          <span>Home</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  role="menuitem"
                  to="/login"
                  className="pill"
                  aria-label="Login"
                  onMouseEnter={() => handleEnter(otherItems.length)}
                  onMouseLeave={() => handleLeave(otherItems.length)}
                >
                  <span className="pill-circle" ref={el => circleRefs.current[otherItems.length] = el}></span>
                  <span className="pill-label flex items-center gap-1.5">
                    <LogIn className="w-3.5 h-3.5" />
                    Login
                  </span>
                  <span className="pill-label-hover flex items-center gap-1.5">
                    <LogIn className="w-3.5 h-3.5" />
                    Login
                  </span>
                </Link>
              )}
            </li>
          </ul>
        </div>

        <button
          className="mobile-menu-button mobile-only"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          ref={hamburgerRef}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef} style={cssVars}>
        <ul className="mobile-menu-list">
          {finalItems.map((item, i) => {
            const active = isActive(item);
            return (
              <li key={item.href || `mobile-item-${i}`}>
                <Link
                  to={item.href || '#'}
                  className={`mobile-menu-link${active ? ' is-active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          
          {/* Profile/Login Link - Mobile */}
          <li>
            {isAuthenticated() ? (
              <>
                <Link
                  to="/"
                  className="mobile-menu-link flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  {getUserDisplayName()}
                </Link>
                <button
                  onClick={handleLogout}
                  className="mobile-menu-link flex items-center gap-2 w-full text-left text-rose-400"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="mobile-menu-link flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PillNav;

