import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useGoldRate } from '../../context/GoldRateContext';
import { productsDatabase } from '../../data/products';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { rates, formatCurrency } = useGoldRate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Shrink header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Handle live search suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = productsDatabase.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Collections', path: '/collections' },
    { label: 'Gold Rate', path: '/gold-rate' },
    { label: 'Gold Rate Guide', path: '/blogs' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <header className="sticky top-0 z-100 w-full transition-all duration-500 bg-luxury-bg/95 border-b border-gold-primary/10">
        {/* Real-time Gold Rate Ribbon */}
        <div className="w-full bg-[#080808] border-b border-gold-primary/5 py-1 text-[10px] uppercase font-body text-gold-light/80 select-none overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 animate-pulse">
              <TrendingUp className="w-3.5 h-3.5 text-gold-primary" />
              <span>Live Rates: </span>
              <span className="text-white font-medium">24K: {formatCurrency(rates['24K'])}/g</span>
              <span className="opacity-40">|</span>
              <span className="text-white font-medium">22K: {formatCurrency(rates['22K'])}/g</span>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <span>Secured Shipping Worldwide</span>
              <span className="opacity-40">•</span>
              <span>100% Certified Hallmark Gold</span>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className={`w-full transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex flex-col items-start select-none">
              <span className="font-heading text-xl md:text-2xl font-light tracking-[0.2em] text-gold-primary uppercase">
                JKS Jewels
              </span>
              <span className="text-[8px] uppercase tracking-[0.3em] font-luxury text-luxury-white/60">
                Crafted In Gold
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs uppercase tracking-widest font-body hover:text-gold-primary transition duration-300 ${
                    location.pathname === link.path ? 'text-gold-primary font-medium' : 'text-neutral-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-4 text-white">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hover:text-gold-primary transition p-1.5"
                aria-label="Open Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Wishlist Link */}
              <Link to="/wishlist" className="hover:text-gold-primary transition p-1.5 relative" aria-label="Wishlist">
                <Heart className="w-4.5 h-4.5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gold-primary text-black text-[9px] font-bold flex items-center justify-center scale-90">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link to="/cart" className="hover:text-gold-primary transition p-1.5 relative" aria-label="Shopping Cart">
                <ShoppingBag className="w-4.5 h-4.5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gold-primary text-black text-[9px] font-bold flex items-center justify-center scale-90">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Profile Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="hover:text-gold-primary transition p-1.5 flex items-center gap-1"
                  aria-label="User Account"
                >
                  <User className="w-4.5 h-4.5" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-48 rounded bg-luxury-surface border border-gold-primary/10 py-1 shadow-2xl z-110 text-left select-none">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gold-primary/10 text-xs font-semibold text-gold-light truncate">
                          Hi, {user.name}
                        </div>
                        <Link to="/profile" className="block px-4 py-2 text-xs text-neutral-300 hover:bg-gold-primary hover:text-black transition">
                          My Profile
                        </Link>
                        <Link to="/orders" className="block px-4 py-2 text-xs text-neutral-300 hover:bg-gold-primary hover:text-black transition">
                          My Orders
                        </Link>
                        <Link to="/addresses" className="block px-4 py-2 text-xs text-neutral-300 hover:bg-gold-primary hover:text-black transition">
                          Addresses
                        </Link>
                        <Link to="/settings" className="block px-4 py-2 text-xs text-neutral-300 hover:bg-gold-primary hover:text-black transition">
                          Account Settings
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition border-t border-gold-primary/10 mt-1"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block px-4 py-2 text-xs text-neutral-300 hover:bg-gold-primary hover:text-black transition">
                          Login
                        </Link>
                        <Link to="/register" className="block px-4 py-2 text-xs text-neutral-300 hover:bg-gold-primary hover:text-black transition">
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden hover:text-gold-primary transition p-1.5"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide down Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-150 bg-black/90 flex flex-col justify-start pt-24 px-4 select-none">
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-gold-primary transition"
            aria-label="Close Search"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="max-w-2xl mx-auto w-full">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search gold rings, bridal necklaces, diamonds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b-2 border-gold-primary/30 focus:border-gold-primary text-xl py-3 px-2 text-white outline-none placeholder-neutral-600 transition font-heading font-light"
                autoFocus
              />
              <button type="submit" className="absolute right-3 top-3 text-gold-primary hover:text-gold-light" aria-label="Submit Search">
                <Search className="w-6 h-6" />
              </button>
            </form>

            {/* Quick Suggestions */}
            {searchResults.length > 0 && (
              <div className="bg-luxury-surface border border-gold-primary/10 rounded mt-4 overflow-hidden shadow-2xl">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center gap-4 p-3 hover:bg-gold-primary/5 border-b border-gold-primary/5 transition group"
                  >
                    <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded bg-luxury-bg" />
                    <div className="text-left">
                      <div className="text-xs font-semibold text-white group-hover:text-gold-primary transition">{product.name}</div>
                      <div className="text-[10px] text-luxury-gray mt-0.5">{product.category} • {product.purity} Gold</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            <div className="mt-8 text-left">
              <h4 className="text-[10px] uppercase font-body tracking-wider text-gold-primary font-semibold mb-3">Popular Searches</h4>
              <div className="flex flex-wrap gap-2">
                {['Gold Rings', 'Bridal Necklaces', 'Diamonds', 'Temple Collection', 'Earrings'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      navigate(`/search?q=${encodeURIComponent(tag)}`);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-[10px] uppercase tracking-widest font-body bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded hover:border-gold-primary transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-y-0 right-0 z-120 w-64 bg-luxury-surface border-l border-gold-primary/10 shadow-2xl flex flex-col pt-20 select-none lg:hidden">
          <nav className="flex flex-col gap-4 px-6 text-left">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-widest font-body py-2 hover:text-gold-primary transition ${
                  location.pathname === link.path ? 'text-gold-primary font-semibold' : 'text-neutral-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gold-primary/10 my-4 pt-4 flex flex-col gap-4">
              <Link to="/wishlist" className="text-sm uppercase tracking-widest font-body flex items-center gap-2 text-neutral-300 hover:text-gold-primary">
                <Heart className="w-4 h-4 text-gold-primary" />
                <span>My Wishlist ({wishlistItems.length})</span>
              </Link>
              <Link to="/cart" className="text-sm uppercase tracking-widest font-body flex items-center gap-2 text-neutral-300 hover:text-gold-primary">
                <ShoppingBag className="w-4 h-4 text-gold-primary" />
                <span>Shopping Cart ({cartItems.length})</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
export default Header;
