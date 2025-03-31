import { createClient } from '@supabase/supabase-js';

// สร้าง URL และ API Key จาก Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// ตรวจสอบว่ามีค่า URL และ API Key หรือไม่
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('กรุณากำหนดค่า NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY ใน env file');
}

// สร้าง supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// ฟังก์ชันสำหรับลงทะเบียนผู้ใช้ใหม่
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

// ฟังก์ชันสำหรับเข้าสู่ระบบ
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

// ฟังก์ชันสำหรับออกจากระบบ
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
} 