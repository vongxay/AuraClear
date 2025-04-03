import { supabase } from './supabase';

// ประเภทข้อมูลสำหรับลูกค้า
export type Customer = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  points?: number;
  created_at?: string;
};

// ประเภทของข้อผิดพลาด
export type DatabaseError = Error | { message: string };

/**
 * ดึงข้อมูลลูกค้าจาก ID
 */
export async function getCustomerById(id: string) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า:', error);
      return { success: false, error: error as DatabaseError };
    }

    return { success: true, customer: data as Customer };
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า:', error);
    return { success: false, error: error as DatabaseError };
  }
}

/**
 * สร้างหรืออัปเดตข้อมูลลูกค้า
 */
export async function createOrUpdateCustomer(customer: Partial<Customer> & { id: string; email: string }) {
  try {
    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วนหรือไม่
    if (!customer.id || !customer.email) {
      return {
        success: false,
        operation: 'invalid_data',
        error: new Error('ข้อมูล ID หรืออีเมลไม่ครบถ้วน') as DatabaseError
      };
    }

    // ตรวจสอบว่ามีข้อมูลลูกค้าอยู่แล้วหรือไม่
    const { success: checkSuccess, customer: existingCustomer } = await getCustomerById(customer.id);

    if (checkSuccess && existingCustomer) {
      // อัปเดตข้อมูลลูกค้าที่มีอยู่
      const { data, error } = await supabase
        .from('customers')
        .update({
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          postal_code: customer.postal_code,
          country: customer.country,
          updated_at: new Date().toISOString(),
        })
        .eq('id', customer.id);

      if (error) {
        console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูลลูกค้า:', error);
        return { success: false, operation: 'update', error: error as DatabaseError };
      }

      return { success: true, operation: 'update', data };
    } else {
      // สร้างข้อมูลลูกค้าใหม่
      const { data, error } = await supabase
        .from('customers')
        .insert({
          id: customer.id,
          email: customer.email,
          first_name: customer.first_name || '',
          last_name: customer.last_name || '',
          phone: customer.phone || '',
          address: customer.address || '',
          city: customer.city || '',
          state: customer.state || '',
          postal_code: customer.postal_code || '',
          country: customer.country || '',
          points: customer.points || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('เกิดข้อผิดพลาดในการสร้างข้อมูลลูกค้า:', error);
        return { success: false, operation: 'insert', error: error as DatabaseError };
      }

      return { success: true, operation: 'insert', data };
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้างหรืออัปเดตข้อมูลลูกค้า:', error);
    return { success: false, error: error as DatabaseError };
  }
}

/**
 * อัปเดตที่อยู่ของลูกค้า
 */
export async function updateCustomerAddress(customerId: string, addressData: {
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update({
        address: addressData.address,
        city: addressData.city,
        state: addressData.state,
        postal_code: addressData.postal_code,
        country: addressData.country,
        updated_at: new Date().toISOString(),
      })
      .eq('id', customerId);

    if (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตที่อยู่ลูกค้า:', error);
      return { success: false, error: error as DatabaseError };
    }

    return { success: true, data };
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตที่อยู่ลูกค้า:', error);
    return { success: false, error: error as DatabaseError };
  }
}

/**
 * ดึงรายการคำสั่งซื้อของลูกค้า
 */
export async function getCustomerOrders(customerId: string) {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(*)
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ:', error);
      return { success: false, error: error as DatabaseError, orders: [] };
    }

    return { success: true, orders: orders || [] };
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ:', error);
    return { success: false, error: error as DatabaseError, orders: [] };
  }
}

/**
 * ดึงรายการสินค้าที่ชื่นชอบของลูกค้า
 */
export async function getCustomerWishlist(customerId: string) {
  try {
    const { data: wishlistItems, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        products:product_id(*)
      `)
      .eq('customer_id', customerId);

    if (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้าที่ชื่นชอบ:', error);
      return { success: false, error: error as DatabaseError, wishlistItems: [] };
    }

    return { success: true, wishlistItems: wishlistItems || [] };
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้าที่ชื่นชอบ:', error);
    return { success: false, error: error as DatabaseError, wishlistItems: [] };
  }
}

/**
 * ลบสินค้าออกจากรายการที่ชื่นชอบ
 */
export async function removeFromWishlist(customerId: string, productId: string) {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .delete()
      .eq('customer_id', customerId)
      .eq('product_id', productId);

    if (error) {
      console.error('เกิดข้อผิดพลาดในการลบสินค้าจากรายการที่ชื่นชอบ:', error);
      return { success: false, error: error as DatabaseError };
    }

    return { success: true, data };
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบสินค้าจากรายการที่ชื่นชอบ:', error);
    return { success: false, error: error as DatabaseError };
  }
}
