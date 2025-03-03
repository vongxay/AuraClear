
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ShoppingBag, Search, Heart, UserRound, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/contexts/WishlistContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { wishlist, getCartCount } = useWishlist();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Here you would typically implement the actual search functionality
    // For example, redirect to search results page or filter products
    setSearchOpen(false); // Close search after submit
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '#products' },
    { name: 'Categories', href: '#categories' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/90 backdrop-blur-md border-b border-cosmetic-beige/30 py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-8">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-medium tracking-tight">
            AuraClear
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium hover-lift"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Search Bar (Desktop) */}
          <div className={cn(
            "hidden md:flex items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
            searchOpen ? "w-64 opacity-100" : "w-0 opacity-0"
          )}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                className="w-full bg-white/80 border-cosmetic-beige focus:border-cosmetic-charcoal"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-cosmetic-beige/30 relative" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-cosmetic-beige/30" 
              aria-label="Search"
              onClick={toggleSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-cosmetic-beige/30 relative" aria-label="Cart">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cosmetic-charcoal text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-cosmetic-beige/30 ml-1" aria-label="Login">
              <LogIn className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Icons/Menu */}
          <div className="md:hidden flex items-center space-x-1">
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="Cart">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cosmetic-charcoal text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Search"
              onClick={toggleSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button onClick={toggleMenu} variant="ghost" size="icon" className="rounded-full">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Search Bar */}
        <div className={cn(
          "transition-all duration-300 overflow-hidden",
          searchOpen ? "h-14 opacity-100 py-3" : "h-0 opacity-0 py-0"
        )}>
          <form onSubmit={handleSearchSubmit} className="w-full">
            <Input
              type="text"
              placeholder="Search products..."
              className="w-full bg-white/80 border-cosmetic-beige focus:border-cosmetic-charcoal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-x-0 top-0 h-screen bg-white z-40 flex flex-col p-6 transition-transform duration-300 ease-in-out transform",
          isOpen ? "translate-y-0" : "-translate-y-full",
          "md:hidden"
        )}
      >
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-2xl font-serif font-medium tracking-tight">
            Lumière
          </Link>
          <Button onClick={toggleMenu} variant="ghost" size="icon" className="rounded-full">
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="flex flex-col space-y-6">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-lg font-medium hover:text-cosmetic-charcoal transition-colors border-b border-cosmetic-beige py-2"
              onClick={toggleMenu}
            >
              {link.name}
            </a>
          ))}
          <Link 
            to="/wishlist" 
            className="text-lg font-medium hover:text-cosmetic-charcoal transition-colors border-b border-cosmetic-beige py-2 flex justify-between items-center"
            onClick={toggleMenu}
          >
            Wishlist
            {wishlist.length > 0 && (
              <span className="bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link 
            to="/cart" 
            className="text-lg font-medium hover:text-cosmetic-charcoal transition-colors border-b border-cosmetic-beige py-2 flex justify-between items-center"
            onClick={toggleMenu}
          >
            Cart
            {cartCount > 0 && (
              <span className="bg-cosmetic-charcoal text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <div className="text-lg font-medium hover:text-cosmetic-charcoal transition-colors border-b border-cosmetic-beige py-2">
            Login
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
