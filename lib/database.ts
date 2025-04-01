import { createClient } from '@supabase/supabase-js';
import type { Database } from './types'; // จะสร้างไฟล์นี้ในขั้นตอนถัดไป

// สร้าง URL และ API Key จาก Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// ตรวจสอบว่ามีค่า URL และ API Key หรือไม่
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('กรุณากำหนดค่า NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY ใน env file');
}

// สร้าง supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// ฟังก์ชันสำหรับตรวจสอบตาราง customers
export async function checkCustomersTable() {
  try {
    const { count, error } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('ไม่สามารถเข้าถึงตาราง customers ได้:', error);
    return { success: false, error };
  }
}

// ฟังก์ชันสำหรับสร้างหรืออัพเดตข้อมูลลูกค้าใน customers table
export async function createOrUpdateCustomer({
  id,
  email,
  first_name,
  last_name,
  phone = null,
  address = null,
  city = null,
  state = null,
  postal_code = null,
  country = null,
}: {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
}) {
  try {
    // ตรวจสอบว่าค่า URL และ API key ถูกต้องหรือไม่
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('ไม่พบค่า NEXT_PUBLIC_SUPABASE_URL หรือ NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    
    // ตรวจสอบว่าข้อมูลที่จำเป็นมีครบหรือไม่
    if (!email || !first_name || !last_name) {
      throw new Error('ข้อมูลอีเมล ชื่อ หรือนามสกุลไม่ครบถ้วน');
    }

    // ตรวจสอบการเข้าถึงตาราง customers
    const { success: tableAccessible, error: tableError } = await checkCustomersTable();
    if (!tableAccessible) {
      throw new Error(`ไม่สามารถเข้าถึงตาราง customers ได้: ${JSON.stringify(tableError)}`);
    }

    // ตรวจสอบว่ามีลูกค้าที่ใช้อีเมลนี้ในระบบแล้วหรือไม่
    const { data: existingCustomerByEmail, error: fetchEmailError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchEmailError && fetchEmailError.code !== 'PGRST116') { 
      // PGRST116 คือ error code เมื่อไม่พบข้อมูล
      throw fetchEmailError;
    }

    if (existingCustomerByEmail) {
      // ถ้ามีลูกค้าที่ใช้อีเมลนี้อยู่แล้ว ให้อัพเดตข้อมูล
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          first_name,
          last_name,
          phone,
          address,
          city,
          state,
          postal_code,
          country,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCustomerByEmail.id);

      if (updateError) throw updateError;
      return { success: true, operation: 'updated', customer_id: existingCustomerByEmail.id };
    } else {
      // ถ้ายังไม่มีลูกค้าที่ใช้อีเมลนี้ ให้สร้างข้อมูลใหม่
      // หากไม่มีการระบุ id ให้ใช้ UUID ที่สร้างโดย Supabase
      const { data: newCustomer, error: insertError } = await supabase
        .from('customers')
        .insert([{
          id: id || undefined, // ถ้าไม่ได้ระบุ id ให้เป็น undefined เพื่อให้ Supabase สร้าง UUID ใหม่
          email,
          first_name,
          last_name,
          phone,
          address,
          city,
          state,
          postal_code,
          country,
          points: 0,
          is_vip: false,
          total_orders: 0,
          total_spent: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      return { success: true, operation: 'created', customer_id: newCustomer?.id };
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้างหรืออัพเดตข้อมูลลูกค้า:', error);
    
    // แสดงรายละเอียดเพิ่มเติมเกี่ยวกับข้อผิดพลาด
    if (error instanceof Error) {
      console.error('รายละเอียดข้อผิดพลาด:', error.message);
      console.error('Stack trace:', error.stack);
      return { success: false, error: { message: error.message, stack: error.stack } };
    } else if (typeof error === 'object' && error !== null) {
      const errorJson = JSON.stringify(error, null, 2);
      console.error('ข้อมูลข้อผิดพลาด (Object):', errorJson);
      return { success: false, error: { message: 'ข้อผิดพลาดที่ไม่ใช่ Error instance', details: errorJson } };
    } else {
      console.error('ประเภทข้อผิดพลาดที่ไม่ทราบ:', typeof error);
      console.error('ข้อมูลข้อผิดพลาด:', String(error));
      return { success: false, error: { message: `ข้อผิดพลาดประเภท ${typeof error}`, details: String(error) } };
    }
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลลูกค้าจาก ID
export async function getCustomerById(id: string) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    // จัดการกรณีไม่พบข้อมูล (PGRST116 คือ error code เมื่อไม่พบข้อมูล)
    if (error) {
      if (error.code === 'PGRST116') {
        // กรณีไม่พบข้อมูลลูกค้า ให้ถือว่าไม่มีข้อผิดพลาด แต่ส่งข้อมูลลูกค้าเป็น null
        return { success: true, customer: null };
      }
      // กรณีมีข้อผิดพลาดอื่นๆ
      throw error;
    }

    return { success: true, customer: data };
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า:', error);
    return { success: false, error };
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลลูกค้าจากอีเมล
export async function getCustomerByEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return { success: true, customer: data };
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้าจากอีเมล:', error);
    return { success: false, error };
  }
}
