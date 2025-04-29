
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const { itemsCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Get user's name from user.user_metadata or fall back to email
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="bg-shop-blue text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            ShopSpark
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden focus:outline-none" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Search on desktop */}
          <form 
            onSubmit={handleSearch} 
            className="hidden md:flex flex-grow max-w-md mx-4"
          >
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-l-md border-r-0 text-black"
              />
              <Button 
                type="submit" 
                className="absolute right-0 top-0 h-full rounded-l-none bg-shop-yellow text-shop-text hover:bg-opacity-90"
              >
                <Search size={18} />
              </Button>
            </div>
          </form>

          {/* Nav links on desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/products" className="hover:text-shop-yellow transition">
              Products
            </Link>
            
            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-shop-yellow">
                  <span>{userName}</span>
                  <User size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block text-shop-text">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hover:text-shop-yellow transition flex items-center space-x-1">
                <span>Sign In</span>
                <User size={20} />
              </Link>
            )}
            
            {/* Cart link */}
            <Link to="/cart" className="relative hover:text-shop-yellow transition">
              <ShoppingCart size={24} />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-shop-yellow text-shop-text rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {itemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile menu & search */}
        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md text-black"
                />
                <Button 
                  type="submit" 
                  className="absolute right-0 top-0 h-full rounded-l-none bg-shop-yellow text-shop-text hover:bg-opacity-90"
                >
                  <Search size={18} />
                </Button>
              </div>
            </form>
            <nav className="flex flex-col space-y-3">
              <Link to="/products" className="hover:text-shop-yellow transition">
                Products
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="hover:text-shop-yellow transition">
                    My Profile
                  </Link>
                  <Link to="/orders" className="hover:text-shop-yellow transition">
                    My Orders
                  </Link>
                  <button 
                    onClick={logout}
                    className="text-left hover:text-shop-yellow transition text-red-400"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link to="/login" className="hover:text-shop-yellow transition">
                  Sign In
                </Link>
              )}
              <Link to="/cart" className="flex items-center space-x-2 hover:text-shop-yellow transition">
                <ShoppingCart size={20} />
                <span>Cart ({itemsCount})</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
