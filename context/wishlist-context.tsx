"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './auth-context';

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
  isLoading: boolean;
};

const WISHLIST_STORAGE_KEY = 'wishlist';

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoggedIn } = useAuth();

  // โหลดรายการโปรดจาก localStorage หรือ Supabase
  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        if (isLoggedIn && user) {
          // ถ้าผู้ใช้ล็อกอินแล้ว ดึงรายการโปรดจาก Supabase
          const { data, error } = await supabase
            .from('wishlists')
            .select('items')
            .eq('user_id', user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูลรายการโปรด:', error);
          }
          
          if (data?.items) {
            setWishlistItems(data.items);
          } else {
            // ถ้ายังไม่มีข้อมูลรายการโปรดในฐานข้อมูล ให้ดึงจาก localStorage
            const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
            if (storedWishlist) {
              const localWishlistItems = JSON.parse(storedWishlist);
              setWishlistItems(localWishlistItems);
              
              // บันทึกข้อมูลรายการโปรดจาก localStorage ไปยัง Supabase
              await supabase.from('wishlists').upsert({
                user_id: user.id,
                items: localWishlistItems
              });
            }
          }
        } else {
          // ถ้าไม่ได้ล็อกอิน ดึงรายการโปรดจาก localStorage
          const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
          if (storedWishlist) {
            setWishlistItems(JSON.parse(storedWishlist));
          }
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการโหลดรายการโปรด:', error);
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };
    
    loadWishlist();
  }, [isLoggedIn, user]);

  // บันทึกรายการโปรดเมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (!isInitialized) return;
    
    const saveWishlist = async () => {
      try {
        // บันทึกลงใน localStorage เสมอ (สำหรับผู้ใช้ที่ไม่ได้ล็อกอิน)
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
        
        // ถ้าผู้ใช้ล็อกอินแล้ว บันทึกลงใน Supabase ด้วย
        if (isLoggedIn && user) {
          // ใช้ try/catch เพื่อจัดการกรณีที่เกิดข้อผิดพลาดระหว่างเรียก API
          try {
            const { error } = await supabase
              .from('wishlists')
              .upsert({
                user_id: user.id,
                items: wishlistItems,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id'
              });
              
            if (error) {
              // แสดงข้อมูลข้อผิดพลาดอย่างละเอียด
              console.error('เกิดข้อผิดพลาดในการบันทึกรายการโปรดไปยัง Supabase:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
              });
              
              // จัดการตามรหัสข้อผิดพลาด
              if (error.code === '42P01') {
                console.error('ไม่พบตาราง wishlists โปรดสร้างตารางก่อนใช้งาน');
              } else if (error.code === '23503') {
                console.error('ข้อผิดพลาดเกี่ยวกับ Foreign Key: ไม่พบ user_id ในตาราง auth.users');
              } else if (error.code === '23505') {
                console.error('มีข้อมูลซ้ำกัน (Duplicate Key)');
              } else if (error.code === '42501') {
                console.error('ไม่มีสิทธิ์ในการเข้าถึงตาราง wishlists');
              }
            }
          } catch (innerError) {
            console.error('เกิดข้อผิดพลาดที่ไม่คาดคิดในการบันทึกรายการโปรด:', innerError);
          }
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการบันทึกรายการโปรด (outer):', error);
      }
    };
    
    // Debounce การบันทึกเพื่อลดจำนวนการเขียนข้อมูล
    const timeoutId = setTimeout(saveWishlist, 300);
    return () => clearTimeout(timeoutId);
  }, [wishlistItems, isInitialized, isLoggedIn, user]);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlistItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
      
      if (existingItemIndex > -1) {
        // มีสินค้าอยู่แล้วในรายการโปรด ไม่ต้องทำอะไร
        return prevItems;
      } else {
        // ไม่มีสินค้านี้ ให้เพิ่มเข้าไป
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

  const clearWishlist = useCallback(async () => {
    setWishlistItems([]);
    
    // ถ้าผู้ใช้ล็อกอินแล้ว ลบข้อมูลรายการโปรดใน Supabase
    if (isLoggedIn && user) {
      try {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id);
          
        if (error) {
          console.error('เกิดข้อผิดพลาดในการลบรายการโปรดจาก Supabase:', error);
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบรายการโปรด:', error);
      }
    }
  }, [isLoggedIn, user]);

  const totalItems = useMemo(() => wishlistItems.length, [wishlistItems]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    totalItems,
    isLoading,
  }), [
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    totalItems,
    isLoading
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