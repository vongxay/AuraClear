"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getCurrentUser, signIn, signUp, signOut } from '@/lib/supabase';
import { createOrUpdateCustomer, getCustomerById } from '@/lib/database';
import { User as SupabaseUser } from '@supabase/supabase-js';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  points: number;
  memberSince: string;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
};

type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // เช็คสถานะการล็อกอินเมื่อโหลดแอพ
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ดึงข้อมูลผู้ใช้จาก Supabase
        const supabaseUser = await getCurrentUser();
        
        if (supabaseUser) {
          // ดึงข้อมูลผู้ใช้จากตาราง customers
          const { success, customer } = await getCustomerById(supabaseUser.id);
            
          if (!success) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า');
            setIsLoading(false);
            return;
          }
          
          // ถ้าไม่พบข้อมูลลูกค้า ให้สร้างข้อมูลใหม่
          if (!customer) {
            console.log('ไม่พบข้อมูลลูกค้า กำลังสร้างข้อมูลใหม่...');
            
            // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบหรือไม่
            if (!supabaseUser.id || !supabaseUser.email) {
              console.error('ไม่สามารถสร้างข้อมูลลูกค้าได้: ไม่มี ID หรืออีเมลของผู้ใช้');
              setIsLoading(false);
              return;
            }
            
            const { success: createSuccess, operation, error: createError } = await createOrUpdateCustomer({
              id: supabaseUser.id,
              email: supabaseUser.email || '',
              first_name: '',
              last_name: '',
            });
            
            if (!createSuccess) {
              // แสดงข้อมูลข้อผิดพลาดที่เป็นประโยชน์มากขึ้น
              const errorMessage = createError?.message || 'ไม่มีรายละเอียดข้อผิดพลาด';
              const errorDetails = createError?.details || '';
              console.error(`ไม่สามารถสร้างข้อมูลลูกค้าได้: ${errorMessage}`, errorDetails);
              setIsLoading(false);
              return;
            }
            
            // ดึงข้อมูลลูกค้าอีกครั้งหลังจากสร้างข้อมูลใหม่
            const { success: refetchSuccess, customer: newCustomer } = await getCustomerById(supabaseUser.id);
            
            if (refetchSuccess && newCustomer) {
              setUser({
                id: supabaseUser.id,
                firstName: newCustomer.first_name || '',
                lastName: newCustomer.last_name || '',
                email: supabaseUser.email || '',
                phone: newCustomer.phone || '',
                points: newCustomer.points || 0,
                memberSince: new Date(newCustomer.created_at || Date.now()).toLocaleDateString('th-TH', { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                }),
              });
            } else {
              console.error('ไม่สามารถดึงข้อมูลลูกค้าหลังจากสร้างข้อมูลใหม่');
            }
          } else {
            // ถ้าพบข้อมูลลูกค้า ให้ใช้ข้อมูลที่มีอยู่
            setUser({
              id: supabaseUser.id,
              firstName: customer.first_name || '',
              lastName: customer.last_name || '',
              email: supabaseUser.email || '',
              phone: customer.phone || '',
              points: customer.points || 0,
              memberSince: new Date(customer.created_at || Date.now()).toLocaleDateString('th-TH', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              }),
            });
          }
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการตรวจสอบสถานะการเข้าสู่ระบบ:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // ฟังก์ชันติดตามการเปลี่ยนแปลงสถานะการเข้าสู่ระบบ
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          checkAuth();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    checkAuth();

    // ยกเลิกการติดตามเมื่อ component ถูกทำลาย
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ฟังก์ชันล็อกอิน
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { user: supabaseUser, session } = await signIn(email, password);
      
      if (!supabaseUser) {
        return false;
      }
      
      // ดึงข้อมูลผู้ใช้จากตาราง customers
      const { success, customer } = await getCustomerById(supabaseUser.id);
        
      if (!success) {
        console.error('ไม่สามารถดึงข้อมูลลูกค้าได้');
        return false;
      }
      
      // ถ้าไม่มีข้อมูลลูกค้าให้สร้างใหม่
      if (!customer) {
        console.log('ไม่พบข้อมูลลูกค้า กำลังสร้างข้อมูลใหม่...');
        
        // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบหรือไม่
        if (!supabaseUser.id || !email) {
          console.error('ไม่สามารถสร้างข้อมูลลูกค้าได้: ไม่มี ID หรืออีเมลของผู้ใช้');
          return false;
        }
        
        const { success: createSuccess, error: createError } = await createOrUpdateCustomer({ 
          id: supabaseUser.id,
          email: email,
          first_name: '',
          last_name: '',
        });
          
        if (!createSuccess) {
          // แสดงข้อมูลข้อผิดพลาดที่เป็นประโยชน์มากขึ้น
          const errorMessage = createError?.message || 'ไม่มีรายละเอียดข้อผิดพลาด';
          const errorDetails = createError?.details || '';
          console.error(`เกิดข้อผิดพลาดในการสร้างข้อมูลลูกค้า: ${errorMessage}`, errorDetails);
          return false;
        }
        
        // ดึงข้อมูลลูกค้าอีกครั้งหลังจากสร้างข้อมูลใหม่
        const { success: refetchSuccess, customer: newCustomer } = await getCustomerById(supabaseUser.id);
        
        if (refetchSuccess && newCustomer) {
          setUser({
            id: supabaseUser.id,
            firstName: newCustomer.first_name || '',
            lastName: newCustomer.last_name || '',
            email: email,
            phone: newCustomer.phone || '',
            points: newCustomer.points || 0,
            memberSince: new Date(newCustomer.created_at || Date.now()).toLocaleDateString('th-TH', { 
              year: 'numeric', month: 'long', day: 'numeric' 
            }),
          });
          return true;
        } else {
          console.error('ไม่สามารถดึงข้อมูลลูกค้าหลังจากสร้างข้อมูลใหม่');
          return false;
        }
      }
      
      // ตั้งค่าข้อมูลผู้ใช้จากข้อมูลลูกค้าที่มีอยู่
      setUser({
        id: supabaseUser.id,
        firstName: customer.first_name || '',
        lastName: customer.last_name || '',
        email: email,
        phone: customer.phone || '',
        points: customer.points || 0,
        memberSince: new Date(customer.created_at || Date.now()).toLocaleDateString('th-TH', { 
          year: 'numeric', month: 'long', day: 'numeric' 
        }),
      });
      
      return true;
    } catch (error) {
      console.error('เข้าสู่ระบบล้มเหลว:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันลงทะเบียน
  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { user: supabaseUser, session, error } = await signUp(userData.email, userData.password);
      
      // ตรวจสอบข้อผิดพลาดจากการลงทะเบียน
      if (error) {
        if (error.code === 'user-already-registered') {
          // กรณีผู้ใช้ลงทะเบียนไปแล้ว
          setError('อีเมลนี้มีการลงทะเบียนในระบบแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบด้วยอีเมลนี้');
          return false;
        } else {
          // กรณีข้อผิดพลาดอื่นๆ
          setError(error.message || 'เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองอีกครั้ง');
          return false;
        }
      }
      
      if (!supabaseUser) {
        setError('เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองอีกครั้ง');
        return false;
      }
      
      // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบหรือไม่
      if (!supabaseUser.id || !userData.email || !userData.firstName || !userData.lastName) {
        console.error('ไม่สามารถสร้างข้อมูลลูกค้าได้: ข้อมูลผู้ใช้ไม่ครบถ้วน');
        setError('ข้อมูลสำหรับการลงทะเบียนไม่ครบถ้วน โปรดระบุข้อมูลให้ครบถ้วน');
        return false;
      }
      
      // สร้างข้อมูลในตาราง customers
      const { success: customerSuccess, error: customerError } = await createOrUpdateCustomer({
        id: supabaseUser.id,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
      });
        
      if (!customerSuccess) {
        // แสดงข้อมูลข้อผิดพลาดที่เป็นประโยชน์มากขึ้น
        const errorMessage = customerError?.message || 'ไม่มีรายละเอียดข้อผิดพลาด';
        const errorDetails = customerError?.details || '';
        console.error(`เกิดข้อผิดพลาดในการสร้างข้อมูลลูกค้า: ${errorMessage}`, errorDetails);
        setError('เกิดข้อผิดพลาดในการสร้างข้อมูลบัญชี โปรดลองอีกครั้ง');
        return false;
      }
      
      // อย่าล็อกอินอัตโนมัติ ให้ผู้ใช้ยืนยันอีเมลก่อน (ถ้าเปิดใช้งานคุณสมบัตินี้ใน Supabase)
      return true;
    } catch (error: any) {
      console.error('การลงทะเบียนล้มเหลว:', error);
      // ตรวจสอบข้อความข้อผิดพลาดเพื่อแสดงคำแนะนำที่เหมาะสม
      if (error.message?.includes('already registered') || error.message?.includes('already in use')) {
        setError('อีเมลนี้มีการลงทะเบียนในระบบแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบด้วยอีเมลนี้');
      } else {
        setError('เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองอีกครั้ง');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันออกจากระบบ
  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      router.push('/account');
    } catch (error) {
      console.error('ออกจากระบบล้มเหลว:', error);
    }
  };

  // ฟังก์ชันอัพเดตข้อมูลผู้ใช้
  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      try {
        // อัพเดตข้อมูลในตาราง customers
        const { success } = await createOrUpdateCustomer({
          id: user.id,
          email: user.email,
          first_name: userData.firstName || user.firstName,
          last_name: userData.lastName || user.lastName,
          phone: userData.phone || user.phone,
        });
          
        if (!success) throw new Error('ไม่สามารถอัพเดตข้อมูลลูกค้าได้');
        
        // อัพเดตข้อมูลในสเตท
        setUser({ ...user, ...userData });
      } catch (error) {
        console.error('การอัพเดตข้อมูลผู้ใช้ล้มเหลว:', error);
      }
    }
  };

  const value = {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 