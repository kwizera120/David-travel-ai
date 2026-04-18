import { Link, useLocation, useNavigate } from 'react-router';
import { Home, MapPin, Utensils, Compass, Calendar, Info, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Logo } from './Logo';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/places', icon: MapPin, label: 'Places' },
    { path: '/food-guide', icon: Utensils, label: 'Food' },
    { path: '/trip-planner', icon: Compass, label: 'Trip Planner' },
    { path: '/my-itinerary', icon: Calendar, label: 'Itinerary' },
    { path: '/travel-info', icon: Info, label: 'Info' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <nav className="glass border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
            <Logo />
            <div className="flex flex-col">
              <span className="text-base md:text-xl font-bold text-slate-900 leading-tight tracking-tight group-hover:text-primary transition-colors">SURA RWANDA</span>
              <span className="text-[7px] md:text-[10px] font-medium text-primary/80 uppercase tracking-widest -mt-0.5">Land of a Thousand Hills</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-green-600/20 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
            
            {/* User Menu / Login Button */}
            {isAuthenticated ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 pr-4 bg-slate-100/50 hover:bg-slate-100 rounded-full transition-all border border-border"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-xs">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-border py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 bg-slate-50/50 border-b border-border">
                      <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 btn-primary flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border bg-white/95 backdrop-blur-sm overflow-x-auto">
        <div className="flex gap-1 px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl min-w-[80px] transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-green-600/20'
                    : 'text-slate-600 active:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
              </Link>
            );
          })}
          
          {isAuthenticated ? (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl min-w-[80px] transition-all relative ${
                showUserMenu ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wide truncate max-w-[60px]">{user?.name.split(' ')[0]}</span>
              
              {showUserMenu && (
                <div className="absolute bottom-full right-0 mb-4 w-56 bg-white rounded-xl shadow-2xl border border-border py-2 text-slate-900">
                  <div className="px-4 py-3 bg-slate-50/50 border-b border-border">
                    <p className="text-sm font-bold">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </button>
          ) : (
            <Link
              to="/login"
              className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl min-w-[80px] bg-primary text-primary-foreground shadow-lg shadow-green-600/20"
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wide">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
