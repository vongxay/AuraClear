"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getCurrentUser, signIn, signUp, signOut } from '@/lib/supabase';
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

  // เช็คสถานะการล็อกอินเมื่อโหลดแอพ
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ดึงข้อมูลผู้ใช้จาก Supabase
        const supabaseUser = await getCurrentUser();
        
        if (supabaseUser) {
          // ดึงข้อมูลผู้ใช้จาก Supabase Profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();
            
          if (profileError) throw profileError;
          
          if (profileData) {
            setUser({
              id: supabaseUser.id,
              firstName: profileData.first_name || '',
              lastName: profileData.last_name || '',
              email: supabaseUser.email || '',
              phone: profileData.phone || '',
              avatarUrl: profileData.avatar_url || '',
              points: profileData.points || 0,
              memberSince: new Date(profileData.created_at || Date.now()).toLocaleDateString('th-TH', { 
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
      
      // ดึงข้อมูลผู้ใช้จาก Supabase Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์:', profileError);
      }
      
      // ถ้าไม่มีข้อมูลโปรไฟล์ให้สร้างใหม่
      if (!profileData) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: supabaseUser.id,
            email: email,
            first_name: '',
            last_name: '',
            points: 0,
          }]);
          
        if (insertError) {
          console.error('เกิดข้อผิดพลาดในการสร้างโปรไฟล์:', insertError);
        }
      }
      
      // ตั้งค่าข้อมูลผู้ใช้
      setUser({
        id: supabaseUser.id,
        firstName: profileData?.first_name || '',
        lastName: profileData?.last_name || '',
        email: email,
        phone: profileData?.phone || '',
        avatarUrl: profileData?.avatar_url || '',
        points: profileData?.points || 0,
        memberSince: new Date(profileData?.created_at || Date.now()).toLocaleDateString('th-TH', { 
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
      const { user: supabaseUser, session } = await signUp(userData.email, userData.password);
      
      if (!supabaseUser) {
        return false;
      }
      
      // สร้างโปรไฟล์ในตาราง profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: supabaseUser.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          points: 0,
        }]);
        
      if (profileError) {
        console.error('เกิดข้อผิดพลาดในการสร้างโปรไฟล์:', profileError);
        return false;
      }
      
      // อย่าล็อกอินอัตโนมัติ ให้ผู้ใช้ยืนยันอีเมลก่อน (ถ้าเปิดใช้งานคุณสมบัตินี้ใน Supabase)
      return true;
    } catch (error) {
      console.error('การลงทะเบียนล้มเหลว:', error);
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
        // อัพเดตข้อมูลในตาราง profiles
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: userData.firstName || user.firstName,
            last_name: userData.lastName || user.lastName,
            phone: userData.phone || user.phone,
            avatar_url: userData.avatarUrl || user.avatarUrl,
          })
          .eq('id', user.id);
          
        if (error) throw error;
        
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