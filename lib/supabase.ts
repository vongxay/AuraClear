import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// สร้าง URL และ API Key จาก Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// ตรวจสอบว่ามีค่า URL และ API Key หรือไม่
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('กรุณากำหนดค่า NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY ใน env file');
}

// สร้าง supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// ฟังก์ชันสำหรับตรวจสอบการเชื่อมต่อ
export async function checkSupabaseConnection() {
  try {
    // ใช้การตรวจสอบผ่าน auth API ซึ่งมักจะทำงานแม้ไม่ได้ลงชื่อเข้าใช้
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    console.log('เชื่อมต่อกับ Supabase สำเร็จ');
    return true;
  } catch (error) {
    console.error('ไม่สามารถเชื่อมต่อกับ Supabase ได้:', error);
    return false;
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ปัจจุบัน
export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error);
    return null;
  }
}

// ฟังก์ชันตรวจสอบว่าอีเมลมีการลงทะเบียนแล้วหรือยัง
export async function isEmailRegistered(email: string) {
  try {
    // ใช้ signInWithOtp เพื่อส่งอีเมลตรวจสอบ
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false // ถ้า user ไม่มีอยู่จริง จะไม่สร้างใหม่
      }
    });
    
    // ถ้ามี error ว่า "Email not confirmed" แสดงว่ามีอีเมลนี้ในระบบแล้ว
    // แต่ถ้ามี error "User not found" แสดงว่ายังไม่มีผู้ใช้นี้
    if (error) {
      if (error.message.includes('User not found')) {
        return false; // ยังไม่มีผู้ใช้นี้
      }
      // กรณีอื่นๆ (เช่น "Email not confirmed") แสดงว่ามีผู้ใช้นี้แล้ว
      return true;
    }
    
    // ถ้าไม่มี error ก็แปลว่ามีผู้ใช้นี้แล้ว
    return true;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการตรวจสอบอีเมล:', error);
    return false; // กรณีมีข้อผิดพลาดอื่นๆ ถือว่ายังไม่มีผู้ใช้นี้
  }
}

// ฟังก์ชันสำหรับลงทะเบียนผู้ใช้ใหม่
export async function signUp(email: string, password: string) {
  try {
    // ตรวจสอบก่อนว่าอีเมลนี้มีการลงทะเบียนแล้วหรือยัง
    const isExistingUser = await isEmailRegistered(email);
    
    if (isExistingUser) {
      // ถ้ามีผู้ใช้นี้ในระบบแล้ว ให้ส่งค่ากลับว่าลงทะเบียนไม่สำเร็จ พร้อมสาเหตุ
      return { 
        user: null, 
        session: null, 
        error: { 
          message: 'อีเมลนี้มีการลงทะเบียนในระบบแล้ว',
          code: 'user-already-registered' 
        } 
      };
    }
    
    // ถ้ายังไม่มีผู้ใช้นี้ ให้ดำเนินการลงทะเบียน
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      if (error.message.includes('already registered')) {
        return { 
          user: null, 
          session: null, 
          error: { 
            message: 'อีเมลนี้มีการลงทะเบียนในระบบแล้ว',
            code: 'user-already-registered' 
          } 
        };
      }
      throw error;
    }
    
    return { ...data, error: null };
  } catch (error: any) {
    console.error('เกิดข้อผิดพลาดในการลงทะเบียน:', error);
    return { 
      user: null, 
      session: null, 
      error: { 
        message: error.message || 'เกิดข้อผิดพลาดในการลงทะเบียน', 
        code: error.code || 'unknown-error' 
      } 
    };
  }
}

// ฟังก์ชันสำหรับเข้าสู่ระบบ
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ:', error);
    throw error;
  }
}

// ฟังก์ชันสำหรับออกจากระบบ
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
} 