"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type WishlistContextType = {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
  clearWishlist: () => void;
  totalItems: number;
};

const WISHLIST_STORAGE_KEY = 'wishlist';

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (storedWishlist) {
          setWishlistItems(JSON.parse(storedWishlist));
        }
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error);
      }
      setIsInitialized(true);
    };
    
    loadWishlist();
  }, []);

  // Save wishlist to localStorage whenever it changes - with debounce
  useEffect(() => {
    if (!isInitialized) return;
    
    const saveWishlist = () => {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
      } catch (error) {
        console.error('Failed to save wishlist to localStorage:', error);
      }
    };
    
    // Debounce the save operation
    const timeoutId = setTimeout(saveWishlist, 300);
    return () => clearTimeout(timeoutId);
  }, [wishlistItems, isInitialized]);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlistItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
      
      if (existingItemIndex > -1) {
        // Item already exists in wishlist, do nothing
        return prevItems;
      } else {
        // Item doesn't exist, add it
        return [...prevItems, item];
      }
    });
  }, []);

  const removeFromWishlist = useCallback((itemId: string) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const isInWishlist = useCallback((itemId: string) => {
    return wishlistItems.some(item => item.id === itemId);
  }, [wishlistItems]);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const totalItems = useMemo(() => wishlistItems.length, [wishlistItems]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    totalItems,
  }), [
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    totalItems
  ]);

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};