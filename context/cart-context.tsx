"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './auth-context';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
};

const CART_STORAGE_KEY = 'cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoggedIn } = useAuth();

  // โหลดตะกร้าสินค้าจาก localStorage หรือ Supabase
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (isLoggedIn && user) {
          // ถ้าผู้ใช้ล็อกอินแล้ว ดึงตะกร้าสินค้าจาก Supabase
          const { data, error } = await supabase
            .from('carts')
            .select('items')
            .eq('user_id', user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูลตะกร้าสินค้า:', error);
          }
          
          if (data?.items) {
            setCartItems(data.items);
          } else {
            // ถ้ายังไม่มีข้อมูลตะกร้าสินค้าในฐานข้อมูล ให้ดึงจาก localStorage
            const storedCart = localStorage.getItem(CART_STORAGE_KEY);
            if (storedCart) {
              const localCartItems = JSON.parse(storedCart);
              setCartItems(localCartItems);
              
              // บันทึกข้อมูลตะกร้าสินค้าจาก localStorage ไปยัง Supabase
              await supabase.from('carts').upsert({
                user_id: user.id,
                items: localCartItems
              });
            }
          }
        } else {
          // ถ้าไม่ได้ล็อกอิน ดึงตะกร้าสินค้าจาก localStorage
          const storedCart = localStorage.getItem(CART_STORAGE_KEY);
          if (storedCart) {
            setCartItems(JSON.parse(storedCart));
          }
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการโหลดตะกร้าสินค้า:', error);
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };
    
    loadCart();
  }, [isLoggedIn, user]);

  // บันทึกตะกร้าสินค้าเมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (!isInitialized) return;
    
    const saveCart = async () => {
      try {
        // บันทึกลงใน localStorage เสมอ (สำหรับผู้ใช้ที่ไม่ได้ล็อกอิน)
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        
        // ถ้าผู้ใช้ล็อกอินแล้ว บันทึกลงใน Supabase ด้วย
        if (isLoggedIn && user) {
          const { error } = await supabase
            .from('carts')
            .upsert({
              user_id: user.id,
              items: cartItems
            });
            
          if (error) {
            console.error('เกิดข้อผิดพลาดในการบันทึกตะกร้าสินค้าไปยัง Supabase:', error);
          }
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการบันทึกตะกร้าสินค้า:', error);
      }
    };
    
    // Debounce การบันทึกเพื่อลดจำนวนการเขียนข้อมูล
    const timeoutId = setTimeout(saveCart, 300);
    return () => clearTimeout(timeoutId);
  }, [cartItems, isInitialized, isLoggedIn, user]);

  const addToCart = useCallback((item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
      
      if (existingItemIndex > -1) {
        // มีสินค้าอยู่แล้ว ให้อัพเดตจำนวน
        return prevItems.map((cartItem, index) => 
          index === existingItemIndex 
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        // ไม่มีสินค้านี้ ให้เพิ่มเข้าไป
        return [...prevItems, item];
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(async () => {
    setCartItems([]);
    
    // ถ้าผู้ใช้ล็อกอินแล้ว ลบข้อมูลตะกร้าสินค้าใน Supabase
    if (isLoggedIn && user) {
      try {
        const { error } = await supabase
          .from('carts')
          .delete()
          .eq('user_id', user.id);
          
        if (error) {
          console.error('เกิดข้อผิดพลาดในการลบตะกร้าสินค้าจาก Supabase:', error);
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบตะกร้าสินค้า:', error);
      }
    }
  }, [isLoggedIn, user]);

  const totalItems = useMemo(() => 
    cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );
  
  const subtotal = useMemo(() => 
    cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
    [cartItems]
  );

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    isLoading,
  }), [
    cartItems,
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    totalItems, 
    subtotal,
    isLoading,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};