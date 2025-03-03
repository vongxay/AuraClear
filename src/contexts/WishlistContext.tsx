import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the product type to be used throughout the application
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

// Define a cart item type that includes quantity
export interface CartItem {
  product: Product;
  quantity: number;
}

interface WishlistContextType {
  wishlist: Product[];
  cartItems: CartItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  getCartCount: () => number;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage if available
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.some(item => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // If item already exists, update its quantity
        const updatedCart = [...prev];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        return updatedCart;
      } else {
        // Otherwise add new item
        return [...prev, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlist, 
        cartItems,
        addToWishlist, 
        removeFromWishlist, 
        isInWishlist,
        clearWishlist,
        addToCart,
        removeFromCart,
        getCartCount,
        updateCartItemQuantity
      }}
    >
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
