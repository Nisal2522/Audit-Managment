import { Menu, ChevronDown, LogOut, User } from "lucide-react";
import logo from "../../src/assets/logon.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NavBar({ toggleSidebar }) {
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage when component mounts
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const getProfileRoute = () => {
    if (!user) return '/';
    
    if (user.department === 'Admin' && user.position === 'Admin') {
      return '/Admin/profile';
    } else if (user.department === 'Food' && user.position === 'Department Head') {
      return '/food/Head/Profile';
    }
    
  };

  return (
    <nav className="flex items-center justify-between text-white p-4" style={{ backgroundColor: "#064979" }}>
      <div className="flex items-center gap-3">
        <button 
          className="text-white hover:text-gray-400 transition-colors"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <img 
          src={logo} 
          alt="AuditFlow Logo" 
          className="w-10 h-10 cursor-pointer"
          onClick={() => navigate('/')}
        />
        <span 
          className="text-xl font-semibold text-blue-400 cursor-pointer hover:text-blue-300 transition-colors"
          onClick={() => navigate('/')}
        >
          AuditFlow
        </span>
      </div>

      <div className="flex items-center gap-4">
        

        {/* Profile Dropdown */}
        <div className="relative">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-700/50 p-1 rounded-full transition-colors font-poppins"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="Profile menu"
          >
            {user ? (
              <img
                src={user.profilePic || "https://via.placeholder.com/32"}
                alt={`${user.firstname || 'User'} profile`}
                className="w-8 h-8 rounded-full object-cover border-2 border-blue-400 font-poppins "
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/32";
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-blue-400"></div>
            )}
            <span className="hidden md:inline text-sm font-medium">
              {user?.firstname || 'User'}
            </span>
            <ChevronDown 
              size={16} 
              className={`transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
            />
          </div>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div 
              className="absolute right-0 top-12 mt-1 w-56 bg-gray-800 rounded-lg shadow-xl py-1 z-50 border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-gray-700 font-poppins">
                <p className="text-sm font-medium text-white">
                  {user?.firstname} {user?.lastname}
                </p>
                <p className="text-xs text-gray-400 truncate font-poppins">
                  {user?.email}
                </p>
              </div>
              
              <button
                onClick={() => navigate(getProfileRoute())}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors font-poppins"
              >
                <User size={16} className="mr-3" />
                Your Profile
              </button>
              
              
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors font-poppins"
              >
                <LogOut size={16} className="mr-3" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </nav>
  );
}