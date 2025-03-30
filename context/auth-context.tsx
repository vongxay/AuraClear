"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

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
        // ในอนาคตตรงนี้ควรเรียก API เพื่อตรวจสอบโทเค็นและดึงข้อมูลผู้ใช้
        // ตรวจสอบว่ามี token ใน localStorage หรือไม่
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          // จำลองการดึงข้อมูลผู้ใช้จาก API
          // (ในระบบจริงจะต้องส่ง token ไปยัง API เพื่อดึงข้อมูลผู้ใช้)
          const mockUser: User = {
            id: '123456',
            firstName: 'สมชาย',
            lastName: 'รักช้อป',
            email: 'somchai@example.com',
            phone: '081-234-5678',
            avatarUrl: '',
            points: 250,
            memberSince: '15 มีนาคม 2023',
          };
          
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Failed to check authentication status:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ฟังก์ชันล็อกอิน
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // ในอนาคตตรงนี้จะเป็นการเรียกใช้ API สำหรับการล็อกอิน
      // จำลองการล็อกอิน (ในระบบจริงจะต้องส่งข้อมูลไปยัง API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ตรวจสอบข้อมูลผู้ใช้ (ในที่นี้เราใช้การจำลอง)
      if (email === 'test@example.com' && password === 'password123') {
        // จำลองการได้รับ token จาก API
        const mockToken = 'mock_jwt_token_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('auth_token', mockToken);
        
        // จำลองข้อมูลผู้ใช้
        const mockUser: User = {
          id: '123456',
          firstName: 'สมชาย',
          lastName: 'รักช้อป',
          email: email,
          phone: '081-234-5678',
          avatarUrl: '',
          points: 250,
          memberSince: '15 มีนาคม 2023',
        };
        
        setUser(mockUser);
        return true;
      } else {
        // ในกรณีที่ข้อมูลผิด ให้จำลองการล็อกอินด้วยข้อมูลจำลอง (เฉพาะในตัวอย่างนี้)
        // ในระบบจริงควรส่งข้อความเตือนว่าอีเมลหรือรหัสผ่านไม่ถูกต้อง
        const mockToken = 'mock_jwt_token_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('auth_token', mockToken);
        
        const mockUser: User = {
          id: '123456',
          firstName: 'ผู้ใช้',
          lastName: 'ทดสอบ',
          email: email,
          phone: '081-234-5678',
          avatarUrl: '',
          points: 100,
          memberSince: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }),
        };
        
        setUser(mockUser);
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันลงทะเบียน
  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // ในอนาคตตรงนี้จะเป็นการเรียกใช้ API สำหรับการลงทะเบียน
      // จำลองการลงทะเบียน
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // จำลองการสร้างบัญชีใหม่สำเร็จ
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันออกจากระบบ
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    router.push('/account');
  };

  // ฟังก์ชันอัพเดตข้อมูลผู้ใช้
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
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