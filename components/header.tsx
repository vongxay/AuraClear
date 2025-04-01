"use client";

import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, User, Search, Menu, X, Sun, Moon, Heart, Award, Home, ShoppingCart, Grid, Phone, Info, UserCheck, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { useAuth } from '@/context/auth-context';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { name: 'Home', href: '/', icon: <Home className="h-5 w-5" />, thaiName: 'หน้าหลัก' },
  { name: 'Product', href: '#featured-products', icon: <ShoppingCart className="h-5 w-5" />, thaiName: 'สินค้า', isHashLink: true },
  { name: 'Categories', href: '#categories', icon: <Grid className="h-5 w-5" />, thaiName: 'หมวดหมู่', isHashLink: true },
  { name: 'Account', href: '/account', icon: <User className="h-5 w-5" />, thaiName: 'บัญชีผู้ใช้' },
  { name: 'About', href: '/about', icon: <Info className="h-5 w-5" />, thaiName: 'เกี่ยวกับ' },
];

const Header = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentHash, setCurrentHash] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { cartItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, isLoggedIn, logout } = useAuth();

  const totalItems = useMemo(() => 
    cartItems.reduce((total, item) => total + item.quantity, 0), 
    [cartItems]
  );

  const headerClass = useMemo(() => `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
  }`, [isScrolled]);

  // Optimized scroll listener with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash changes
  useEffect(() => {
    setCurrentHash(window.location.hash);
    
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isHashActive = useCallback((href: string) => {
    if (!href.startsWith('#')) return false;
    
    const targetId = href.substring(1);
    const currentId = currentHash.startsWith('#') ? currentHash.substring(1) : currentHash;
    
    if (currentHash === '' && href === '/') return true;
    
    return targetId === currentId;
  }, [currentHash]);

  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    if (href.startsWith('#')) {
      setCurrentHash(href);
    }
    
    if (pathname !== '/') {
      router.push('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, router]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <>
      <header className={headerClass}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Aura<span className="text-pink-500">Clear</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                link.isHashLink ? (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                    className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                      pathname === '/' && isHashActive(link.href)
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {link.thaiName || link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === link.href
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {link.thaiName || link.name}
                  </Link>
                )
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Link href="/points">
                <Button variant="ghost" size="icon" className="relative" aria-label="Points">
                  <Award className="h-5 w-5" />
                  {isLoggedIn && user && user.points && user.points > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {user.points}
                    </span>
                  )}
                </Button>
              </Link>
              
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative" aria-label="Wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
              {isLoggedIn ? (
                <div className="relative p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full transform scale-110 shadow-lg hover:scale-125 transition-transform cursor-pointer">
                  {user?.avatarUrl ? (
                    <Link href="/account/profile">
                      <Image 
                        src={user.avatarUrl} 
                        width={20} 
                        height={20} 
                        className="rounded-full hover:opacity-80 transition-opacity" 
                        alt="Profile" 
                      />
                      <span className="sr-only">โปรไฟล์ของ {user.first_name}</span>
                    </Link>
                  ) : (
                    <Link href="/account/profile">
                      <UserCheck className="h-5 w-5 text-white hover:text-gray-200 transition-colors" />
                      <span className="sr-only">โปรไฟล์ของ {user?.first_name}</span>
                    </Link>
                  )}
                  <span className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></span>
                </div>
              ) : (
                <Link href="/account">
                  <div className="p-2 rounded-full border border-dashed border-muted-foreground/50 hover:border-primary/70 hover:scale-110 transition-all cursor-pointer">
                    <LogIn className="h-5 w-5 hover:text-primary transition-colors" />
                  </div>
                </Link>
              )}
            </div>

            {/* Mobile Header Actions - Simplified */}
            <div className="flex items-center space-x-2 md:hidden">
              <Link href="/points">
                <Button variant="ghost" size="icon" className="relative h-10 w-10" aria-label="Points">
                  <Award className="h-5 w-5" />
                  {isLoggedIn && user && user.points && user.points > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {user.points}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative h-10 w-10" aria-label="Wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative h-10 w-10" aria-label="Cart">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetTitle className="sr-only">เมนูนำทาง</SheetTitle>
                  <div className="flex flex-col h-full py-6">
                    <div className="flex items-center justify-between mb-8">
                      <Link href="/" className="text-xl font-bold">
                        Aura<span className="text-pink-500">Clear</span>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                      >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      </Button>
                    </div>
                    
                    {isLoggedIn && (
                      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full">
                            {user?.avatarUrl ? (
                              <Image src={user.avatarUrl} width={32} height={32} alt="Avatar" className="rounded-full" />
                            ) : (
                              <UserCheck className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                            <p className="text-xs text-muted-foreground">แต้มสะสม: {user?.points || 0} แต้ม</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <nav className="flex flex-col space-y-6">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={`text-lg font-medium transition-colors hover:text-primary flex items-center ${
                            pathname === link.href
                              ? 'text-pink-500'
                              : 'text-muted-foreground'
                          }`}
                        >
                          <span className="mr-3">{link.icon}</span>
                          {link.thaiName || link.name}
                        </Link>
                      ))}
                    </nav>
                    <div className="mt-auto space-y-4">
                      {isLoggedIn ? (
                        <>
                          <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                            <Link href="/account/profile">
                              <UserCheck className="mr-2 h-5 w-5" />
                              โปรไฟล์ของฉัน
                            </Link>
                          </Button>
                          <Button variant="outline" className="w-full justify-start" size="lg" onClick={() => logout()}>
                            <LogOut className="mr-2 h-5 w-5" />
                            ออกจากระบบ
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                          <Link href="/account">
                            <User className="mr-2 h-5 w-5" />
                            บัญชีผู้ใช้
                          </Link>
                        </Button>
                      )}
                      <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                        <Link href="/points">
                          <Award className="mr-2 h-5 w-5" />
                          คะแนนสะสม
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                        <Link href="/wishlist">
                          <Heart className="mr-2 h-5 w-5" />
                          สินค้าที่ชอบ
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                        <Link href="/cart">
                          <ShoppingBag className="mr-2 h-5 w-5" />
                          ตะกร้าสินค้า
                        </Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation - App-like experience */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 border-t border-border">
        <div className="flex justify-around items-center h-16">
          {navLinks.map((link, index) => {
            const colors = ['from-pink-500 to-purple-500', 'from-sky-400 to-blue-500', 'from-amber-500 to-orange-500', 'from-emerald-400 to-teal-500', 'from-rose-400 to-red-500'];
            const bgColor = colors[index % colors.length];
            
            let isActive = false;
            
            if (link.isHashLink) {
              if (pathname === '/') {
                isActive = link.href === currentHash || 
                          (link.href.startsWith('#') && '#' + link.href.substring(1) === currentHash);
              }
            } else {
              if (link.href === '/' && pathname === '/') {
                isActive = !currentHash || currentHash === '';
              } else {
                isActive = pathname === link.href;
              }
            }
            
            return link.isHashLink ? (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  handleSmoothScroll(e, link.href);
                  setCurrentHash(link.href);
                }}
                className={`flex flex-col items-center justify-center w-full h-full pt-1 transition-colors duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <div className={`relative mb-1 p-2 transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-br ${bgColor} rounded-full transform scale-110 shadow-lg`
                    : 'rounded-full'
                }`}>
                  {link.icon}
                  {isActive && (
                    <span className="absolute inset-0 bg-white/20 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></span>
                  )}
                </div>
                <span className={`text-xs font-medium transition-all duration-300 ${
                  isActive ? 'font-bold' : ''
                }`}>{link.thaiName || link.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 w-10 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-t-md"></span>
                )}
              </a>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={`flex flex-col items-center justify-center w-full h-full pt-1 transition-colors duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <div className={`relative mb-1 p-2 transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-br ${bgColor} rounded-full transform scale-110 shadow-lg`
                    : 'rounded-full'
                }`}>
                  {link.icon}
                  {isActive && (
                    <span className="absolute inset-0 bg-white/20 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></span>
                  )}
                </div>
                <span className={`text-xs font-medium transition-all duration-300 ${
                  isActive ? 'font-bold' : ''
                }`}>{link.thaiName || link.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 w-10 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-t-md"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Mobile content padding to account for bottom navigation */}
      <div className="md:hidden pb-16"></div>
    </>
  );
});

Header.displayName = 'Header';

export default Header;