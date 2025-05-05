
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLostFound } from "@/context/LostFoundContext";
import { Home, Search, User, Database } from "lucide-react";
import { useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const { currentUser, logout, isAdmin } = useLostFound();
  const location = useLocation();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-lost-primary">ALFS</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`flex items-center space-x-1 ${location.pathname === "/" ? "text-lost-primary font-medium" : "text-gray-600 hover:text-lost-primary"}`}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          
          <Link 
            to="/search" 
            className={`flex items-center space-x-1 ${location.pathname === "/search" ? "text-lost-primary font-medium" : "text-gray-600 hover:text-lost-primary"}`}
          >
            <Search size={18} />
            <span>Search</span>
          </Link>
          
          {currentUser && !isAdmin() && (
            <Link 
              to="/dashboard" 
              className={`flex items-center space-x-1 ${location.pathname === "/dashboard" ? "text-lost-primary font-medium" : "text-gray-600 hover:text-lost-primary"}`}
            >
              <User size={18} />
              <span>Dashboard</span>
            </Link>
          )}
          
          {currentUser && isAdmin() && (
            <Link 
              to="/admin/dashboard" 
              className={`flex items-center space-x-1 ${location.pathname === "/admin/dashboard" ? "text-lost-primary font-medium" : "text-gray-600 hover:text-lost-primary"}`}
            >
              <Database size={18} />
              <span>Admin</span>
            </Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-sm text-gray-700">
                Hello, {currentUser.name.split(' ')[0]}
                {isAdmin() && <span className="ml-1 text-xs bg-lost-primary text-white px-2 py-0.5 rounded">Admin</span>}
              </span>
              <Button 
                onClick={logout} 
                variant="outline" 
                size="sm"
                className="border-lost-primary text-lost-primary hover:bg-lost-light"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button 
                size="sm"
                className="bg-lost-primary hover:bg-lost-secondary text-white"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t">
        <div className="grid grid-cols-3 w-full">
          <Link 
            to="/" 
            className={`flex flex-col items-center py-2 ${location.pathname === "/" ? "text-lost-primary" : "text-gray-600"}`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            to="/search" 
            className={`flex flex-col items-center py-2 ${location.pathname === "/search" ? "text-lost-primary" : "text-gray-600"}`}
          >
            <Search size={20} />
            <span className="text-xs mt-1">Search</span>
          </Link>
          
          {currentUser && !isAdmin() && (
            <Link 
              to="/dashboard" 
              className={`flex flex-col items-center py-2 ${location.pathname === "/dashboard" ? "text-lost-primary" : "text-gray-600"}`}
            >
              <User size={20} />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
          )}
          
          {currentUser && isAdmin() && (
            <Link 
              to="/admin/dashboard" 
              className={`flex flex-col items-center py-2 ${location.pathname === "/admin/dashboard" ? "text-lost-primary" : "text-gray-600"}`}
            >
              <Database size={20} />
              <span className="text-xs mt-1">Admin</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
