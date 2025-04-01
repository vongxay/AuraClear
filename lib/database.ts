import { supabase } from './supabase';

// Type definition for order status
export type OrderStatus = 
  | "pending" 
  | "processing" 
  | "shipped" 
  | "delivered" 
  | "completed" 
  | "cancelled" 
  | "refunded";

// Table schema definitions to document the database structure
export interface TableDefinitions {
  products: {
    id: string;
    name: string;
    code: string;
    price: number;
    discount: number;
    stock: number;
    description: string;
    ingredients?: string;
    howToUse?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    point?: number;
    images?: string[];
    status?: string;
    category_id?: string;
    created_at: string;
    updated_at: string;
  };
  categories: {
    id: string;
    name: string;
    description?: string;
    parent_id?: string;
    image?: string;
    created_at: string;
    updated_at: string;
  };
  customers: {
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
    points: number;
    loyalty_level_id?: string;
    is_vip?: boolean;
    total_orders: number;
    total_spent: number;
    created_at: string;
    updated_at: string;
  };
  orders: {
    id: string;
    customer_id: string;
    order_number: string;
    status: OrderStatus;
    total_amount: number;
    shipping_amount: number;
    tax_amount: number;
    discount_amount: number;
    payment_image: string;
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_postal_code: string;
    shipping_country: string;
    notes?: string;
    discount_id?: string;
    shipping_method?: string;
    tracking_number?: string;
    created_at: string;
    updated_at: string;
  };
  order_items: {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
    discount: number;
    total: number;
    points: number;
    created_at: string;
  };
  reviews: {
    id: string;
    product_id: string;
    customer_id: string;
    rating: number;
    title: string;
    content: string;
    status: 'pending' | 'published' | 'hidden';
    verified_purchase: boolean;
    reply?: string;
    reply_date?: string;
    created_at: string;
    updated_at: string;
  };
  messages: {
    id: string;
    customer_id: string;
    subject: string;
    content: string;
    status: 'new' | 'read' | 'replied' | 'closed';
    reply?: string;
    reply_date?: string;
    created_at: string;
    updated_at: string;
  };
  discounts: {
    id: string;
    code: string;
    type: 'percentage' | 'fixed' | 'free_shipping';
    value: number;
    minimum_order_amount?: number;
    product_id?: string;
    category_id?: string;
    start_date: string;
    end_date: string;
    usage_limit?: number;
    used_count: number;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
  loyalty_levels: {
    id: string;
    name: string;
    minimum_points: number;
    discount_percentage: number;
    special_perks?: string;
    created_at: string;
    updated_at: string;
  };
  loyalty_rewards: {
    id: string;
    name: string;
    description: string;
    points_required: number;
    reward_type: 'discount' | 'product' | 'free_shipping';
    reward_value: number;
    product_id?: string;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
  content_pages: {
    id: string;
    title: string;
    slug: string;
    content: string;
    meta_title?: string;
    meta_description?: string;
    status: 'draft' | 'published';
    created_at: string;
    updated_at: string;
  };
  blog_posts: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image?: string;
    author_id: string;
    category_id?: string;
    tags?: string[];
    meta_title?: string;
    meta_description?: string;
    status: 'draft' | 'published';
    published_at?: string;
    created_at: string;
    updated_at: string;
  };
  banners: {
    id: string;
    title: string;
    image: string;
    link?: string;
    start_date: string;
    end_date: string;
    position: 'home_top' | 'home_middle' | 'category_top' | 'sidebar';
    priority: number;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
}

// Define the return type for initializeDatabase
interface DatabaseInitResult {
  success: boolean;
  message?: string;
  error?: {
    message?: string;
    code?: string;
    details?: string;
  };
}

// Function to create all necessary tables if they don't exist
export const initializeDatabase = async (): Promise<DatabaseInitResult> => {
  console.log('Initializing database...');
  
  try {
    // Check if connected to Supabase
    const connectionStatus = await supabase
      .from('products')
      .select('count')
      .limit(1);
      
    if (connectionStatus.error) {
      console.error('Error connecting to Supabase:', connectionStatus.error);
      return { success: false, error: connectionStatus.error };
    }
    
    console.log('Successfully connected to Supabase');
    
    // Check if tables exist - we'll do a simple check on a few key tables
    const { data: existingTables, error: tablesError } = await supabase
      .rpc('get_tables');
      
    if (tablesError) {
      console.error('Error checking tables:', tablesError);
      // This could be because the get_tables function doesn't exist yet
      // We'll continue anyway and try to create the tables
    } else {
      console.log('Existing tables:', existingTables);
    }
    
    // Create tables in a specific order to handle foreign key dependencies
    
    // 1. Create customers table if it doesn't exist
    const { error: customersError } = await supabase
      .rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS customers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT UNIQUE NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            phone TEXT,
            address TEXT,
            city TEXT,
            state TEXT,
            postal_code TEXT,
            country TEXT,
            points INTEGER DEFAULT 0,
            loyalty_level_id UUID,
            is_vip BOOLEAN DEFAULT false,
            total_orders INTEGER DEFAULT 0,
            total_spent NUMERIC(10, 2) DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
    
    if (customersError) {
      console.error('Error creating customers table:', customersError);
      return { success: false, error: customersError };
    }
    
    console.log('Customers table created or already exists');
    
    // 2. Create categories table if it doesn't exist
    const { error: categoriesError } = await supabase
      .rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS categories (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            description TEXT,
            parent_id UUID REFERENCES categories(id),
            image TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
    
    if (categoriesError) {
      console.error('Error creating categories table:', categoriesError);
      return { success: false, error: categoriesError };
    }
    
    console.log('Categories table created or already exists');
    
    // 3. Create products table if it doesn't exist
    const { error: productsError } = await supabase
      .rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            price NUMERIC(10, 2) NOT NULL,
            discount NUMERIC(10, 2) DEFAULT 0,
            stock INTEGER DEFAULT 0,
            description TEXT NOT NULL,
            ingredients TEXT,
            how_to_use TEXT,
            meta_title TEXT,
            meta_description TEXT,
            meta_keywords TEXT,
            point INTEGER DEFAULT 0,
            images TEXT[],
            status TEXT DEFAULT 'active',
            category_id UUID REFERENCES categories(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
    
    if (productsError) {
      console.error('Error creating products table:', productsError);
      return { success: false, error: productsError };
    }
    
    console.log('Products table created or already exists');
    
    // 4. Create discounts table if it doesn't exist
    const { error: discountsError } = await supabase
      .rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS discounts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            code TEXT UNIQUE NOT NULL,
            type TEXT NOT NULL,
            value NUMERIC(10, 2) NOT NULL,
            minimum_order_amount NUMERIC(10, 2),
            product_id UUID REFERENCES products(id),
            category_id UUID REFERENCES categories(id),
            start_date TIMESTAMP WITH TIME ZONE NOT NULL,
            end_date TIMESTAMP WITH TIME ZONE NOT NULL,
            usage_limit INTEGER,
            used_count INTEGER DEFAULT 0,
            active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            CHECK (type IN ('percentage', 'fixed', 'free_shipping'))
          );
        `
      });
    
    if (discountsError) {
      console.error('Error creating discounts table:', discountsError);
      return { success: false, error: discountsError };
    }
    
    console.log('Discounts table created or already exists');
    
    // 5. Create orders table if it doesn't exist
    const { error: ordersError } = await supabase
      .rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS orders (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            customer_id UUID REFERENCES customers(id),
            order_number TEXT UNIQUE NOT NULL,
            status TEXT NOT NULL,
            total_amount NUMERIC(10, 2) NOT NULL,
            shipping_amount NUMERIC(10, 2) DEFAULT 0,
            tax_amount NUMERIC(10, 2) DEFAULT 0,
            discount_amount NUMERIC(10, 2) DEFAULT 0,
            payment_image TEXT NOT NULL,
            payment_status TEXT NOT NULL,
            shipping_address TEXT NOT NULL,
            shipping_city TEXT NOT NULL,
            shipping_state TEXT NOT NULL,
            shipping_postal_code TEXT NOT NULL,
            shipping_country TEXT NOT NULL,
            shipping_method TEXT,
            tracking_number TEXT,
            notes TEXT,
            discount_id UUID REFERENCES discounts(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded')),
            CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'))
          );
        `
      });
    
    if (ordersError) {
      console.error('Error creating orders table:', ordersError);
      return { success: false, error: ordersError };
    }
    
    console.log('Orders table created or already exists');
    
    // 6. Create order_items table if it doesn't exist
    const { error: orderItemsError } = await supabase
      .rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS order_items (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
            product_id UUID REFERENCES products(id),
            quantity INTEGER NOT NULL,
            price NUMERIC(10, 2) NOT NULL,
            discount NUMERIC(10, 2) DEFAULT 0,
            total NUMERIC(10, 2) NOT NULL,
            points INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
    
    if (orderItemsError) {
      console.error('Error creating order_items table:', orderItemsError);
      return { success: false, error: orderItemsError };
    }
    
    console.log('Order items table created or already exists');
    
    // 7. Create admin table if it doesn't exist
    const { error: adminError } = await supabase
      .rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS admin (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            last_login TIMESTAMP WITH TIME ZONE
          );
        `
      });
    
    if (adminError) {
      console.error('Error creating admin table:', adminError);
      return { success: false, error: adminError };
    }
    
    console.log('Admin table created or already exists');
    
    // 8. Create reviews table if it doesn't exist
    const { error: reviewsError } = await supabase
      .rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS reviews (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            product_id UUID REFERENCES products(id),
            customer_id UUID REFERENCES customers(id),
            rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('pending', 'published', 'hidden')),
            verified_purchase BOOLEAN DEFAULT false,
            reply TEXT,
            reply_date TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
    
    if (reviewsError) {
      console.error('Error creating reviews table:', reviewsError);
      return { success: false, error: reviewsError };
    }
    
    console.log('Reviews table created or already exists');
    
    // 9. Create messages table if it doesn't exist
    const { error: messagesError } = await supabase
      .rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS messages (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            customer_id UUID REFERENCES customers(id),
            subject TEXT NOT NULL,
            content TEXT NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('new', 'read', 'replied', 'closed')),
            reply TEXT,
            reply_date TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
    
    if (messagesError) {
      console.error('Error creating messages table:', messagesError);
      return { success: false, error: messagesError };
    }
    
    console.log('Messages table created or already exists');
    
    // 10. Create loyalty_levels table if it doesn't exist
    const { error: loyaltyLevelsError } = await supabase
      .rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS loyalty_levels (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            minimum_points INTEGER NOT NULL,
            discount_percentage NUMERIC(5, 2) NOT NULL,
            special_perks TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
    
    if (loyaltyLevelsError) {
      console.error('Error creating loyalty_levels table:', loyaltyLevelsError);
      return { success: false, error: loyaltyLevelsError };
    }
    
    console.log('Loyalty levels table created or already exists');
    
    // 11. Create loyalty_rewards table if it doesn't exist
    const { error: loyaltyRewardsError } = await supabase
      .rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS loyalty_rewards (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            points_required INTEGER NOT NULL,
            reward_type TEXT NOT NULL CHECK (reward_type IN ('discount', 'product', 'free_shipping')),
            reward_value NUMERIC(10, 2) NOT NULL,
            product_id UUID REFERENCES products(id),
            active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
    
    if (loyaltyRewardsError) {
      console.error('Error creating loyalty_rewards table:', loyaltyRewardsError);
      return { success: false, error: loyaltyRewardsError };
    }
    
    console.log('Loyalty rewards table created or already exists');
    
    // 12. Create content_pages table if it doesn't exist
    const { error: contentPagesError } = await supabase
      .rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS content_pages (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            content TEXT NOT NULL,
            meta_title TEXT,
            meta_description TEXT,
            status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
    
    if (contentPagesError) {
      console.error('Error creating content_pages table:', contentPagesError);
      return { success: false, error: contentPagesError };
    }
    
    console.log('Content pages table created or already exists');
    
    // 13. Create blog_posts table if it doesn't exist
    const { error: blogPostsError } = await supabase
      .rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS blog_posts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            excerpt TEXT NOT NULL,
            content TEXT NOT NULL,
            cover_image TEXT,
            author_id UUID REFERENCES admin(id),
            category_id UUID REFERENCES categories(id),
            tags TEXT[],
            meta_title TEXT,
            meta_description TEXT,
            status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
            published_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
    
    if (blogPostsError) {
      console.error('Error creating blog_posts table:', blogPostsError);
      return { success: false, error: blogPostsError };
    }
    
    console.log('Blog posts table created or already exists');
    
    // 14. Create banners table if it doesn't exist
    const { error: bannersError } = await supabase
      .rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS banners (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            image TEXT NOT NULL,
            link TEXT,
            start_date TIMESTAMP WITH TIME ZONE NOT NULL,
            end_date TIMESTAMP WITH TIME ZONE NOT NULL,
            position TEXT NOT NULL CHECK (position IN ('home_top', 'home_middle', 'category_top', 'sidebar')),
            priority INTEGER NOT NULL,
            active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
    
    if (bannersError) {
      console.error('Error creating banners table:', bannersError);
      return { success: false, error: bannersError };
    }
    
    console.log('Banners table created or already exists');
    
    // Add foreign key to customers table for loyalty_level_id after loyalty_levels table is created
    const { error: customersLoyaltyFKError } = await supabase
      .rpc('execute_sql', {
        sql_query: `
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_constraint WHERE conname = 'customers_loyalty_level_id_fkey'
            ) THEN
              ALTER TABLE customers
              ADD CONSTRAINT customers_loyalty_level_id_fkey
              FOREIGN KEY (loyalty_level_id) REFERENCES loyalty_levels(id);
            END IF;
          END $$;
        `
      });
    
    if (customersLoyaltyFKError) {
      console.error('Error adding loyalty_level_id foreign key to customers table:', customersLoyaltyFKError);
      // We'll continue anyway as this is not critical
    }
    
    return { success: true, message: 'Database initialization complete' };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { 
      success: false, 
      error: error instanceof Error 
        ? { message: error.message } 
        : { message: 'Unknown error' } 
    };
  }
};

// Helper function for basic CRUD operations on any table
export const dbHelper = {
  // Create a record in a table
  create: async <T extends keyof TableDefinitions>(
    table: T, 
    data: Omit<TableDefinitions[T], 'id' | 'created_at' | 'updated_at'>
  ) => {
    const record = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: result, error } = await supabase
      .from(table)
      .insert([record])
      .select();
      
    if (error) {
      console.error(`Error creating ${table} record:`, error);
      throw error;
    }
    
    return result?.[0];
  },
  
  // Read records from a table with optional filtering
  read: async <T extends keyof TableDefinitions>(
    table: T, 
    options?: {
      filters?: Record<string, string | number | boolean>;
      limit?: number;
      offset?: number;
      order?: { column: string; ascending?: boolean };
    }
  ) => {
    let query = supabase.from(table).select('*');
    
    // Apply filters if provided
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    // Apply ordering if provided
    if (options?.order) {
      query = query.order(
        options.order.column, 
        { ascending: options.order.ascending ?? false }
      );
    }
    
    // Apply pagination if provided
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.range(
        options.offset, 
        options.offset + (options.limit || 10) - 1
      );
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error(`Error reading ${table} records:`, error);
      throw error;
    }
    
    return { data, count };
  },
  
  // Read a single record by ID
  readById: async <T extends keyof TableDefinitions>(
    table: T, 
    id: string
  ) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error reading ${table} record with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Update a record
  update: async <T extends keyof TableDefinitions>(
    table: T, 
    id: string, 
    data: Partial<TableDefinitions[T]>
  ) => {
    const record = {
      ...data,
      updated_at: new Date().toISOString()
    };
    
    const { data: result, error } = await supabase
      .from(table)
      .update(record)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error(`Error updating ${table} record with ID ${id}:`, error);
      throw error;
    }
    
    return result?.[0];
  },
  
  // Delete a record
  delete: async <T extends keyof TableDefinitions>(
    table: T, 
    id: string
  ) => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting ${table} record with ID ${id}:`, error);
      throw error;
    }
    
    return true;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลสถิติสำหรับหน้า Dashboard
export const getDashboardStats = async () => {
  try {
    // ดึงยอดขายวันนี้
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: todaySales, error: todaySalesError } = await supabase
      .from('orders')
      .select('total_amount')
      .gte('created_at', today.toISOString())
      .eq('payment_status', 'paid');

    if (todaySalesError) throw todaySalesError;

    // ดึงยอดขายเมื่อวาน เพื่อคำนวณอัตราการเติบโต
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayEnd = new Date(today);
    yesterdayEnd.setSeconds(yesterdayEnd.getSeconds() - 1);
    
    const { data: yesterdaySales, error: yesterdaySalesError } = await supabase
      .from('orders')
      .select('total_amount')
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', yesterdayEnd.toISOString())
      .eq('payment_status', 'paid');

    if (yesterdaySalesError) throw yesterdaySalesError;

    // ดึงจำนวนคำสั่งซื้อใหม่วันนี้
    const { data: newOrders, error: newOrdersError } = await supabase
      .from('orders')
      .select('id')
      .gte('created_at', today.toISOString());

    if (newOrdersError) throw newOrdersError;

    // ดึงจำนวนคำสั่งซื้อเมื่อวาน
    const { data: yesterdayOrders, error: yesterdayOrdersError } = await supabase
      .from('orders')
      .select('id')
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', yesterdayEnd.toISOString());

    if (yesterdayOrdersError) throw yesterdayOrdersError;

    // ดึงจำนวนลูกค้าใหม่วันนี้
    const { data: newCustomers, error: newCustomersError } = await supabase
      .from('customers')
      .select('id')
      .gte('created_at', today.toISOString());

    if (newCustomersError) throw newCustomersError;

    // ดึงจำนวนลูกค้าใหม่เมื่อวาน
    const { data: yesterdayCustomers, error: yesterdayCustomersError } = await supabase
      .from('customers')
      .select('id')
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', yesterdayEnd.toISOString());

    if (yesterdayCustomersError) throw yesterdayCustomersError;

    // คำนวณอัตราการแปลง (Conversion Rate) วันนี้
    const { data: todayAllOrders, error: todayAllOrdersError } = await supabase
      .from('orders')
      .select('id, payment_status')
      .gte('created_at', today.toISOString());

    if (todayAllOrdersError) throw todayAllOrdersError;

    const todayTotalOrders = todayAllOrders.length;
    const todayPaidOrders = todayAllOrders.filter(order => order.payment_status === 'paid').length;
    const todayConversionRate = todayTotalOrders > 0 ? (todayPaidOrders / todayTotalOrders) * 100 : 0;

    // คำนวณอัตราการแปลง (Conversion Rate) เมื่อวาน
    const { data: yesterdayAllOrders, error: yesterdayAllOrdersError } = await supabase
      .from('orders')
      .select('id, payment_status')
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', yesterdayEnd.toISOString());

    if (yesterdayAllOrdersError) throw yesterdayAllOrdersError;

    const yesterdayTotalOrders = yesterdayAllOrders.length;
    const yesterdayPaidOrders = yesterdayAllOrders.filter(order => order.payment_status === 'paid').length;
    const yesterdayConversionRate = yesterdayTotalOrders > 0 ? (yesterdayPaidOrders / yesterdayTotalOrders) * 100 : 0;

    // ดึงข้อมูลยอดขายทั้งหมด
    const { data: allSales, error: allSalesError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'paid');

    if (allSalesError) throw allSalesError;

    // ดึงข้อมูลจำนวนคำสั่งซื้อทั้งหมด
    const { data: allOrders, error: allOrdersError } = await supabase
      .from('orders')
      .select('id');

    if (allOrdersError) throw allOrdersError;

    // ดึงข้อมูลจำนวนลูกค้าทั้งหมด
    const { data: allCustomers, error: allCustomersError } = await supabase
      .from('customers')
      .select('id');

    if (allCustomersError) throw allCustomersError;

    // คำนวณการเปลี่ยนแปลงเป็นเปอร์เซ็นต์
    const calculateGrowthRate = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const todaySalesTotal = todaySales.reduce((sum, order) => sum + order.total_amount, 0);
    const yesterdaySalesTotal = yesterdaySales.reduce((sum, order) => sum + order.total_amount, 0);
    const totalSalesAmount = allSales.reduce((sum, order) => sum + order.total_amount, 0);

    const salesGrowth = calculateGrowthRate(todaySalesTotal, yesterdaySalesTotal);
    const ordersGrowth = calculateGrowthRate(newOrders.length, yesterdayOrders.length);
    const customersGrowth = calculateGrowthRate(newCustomers.length, yesterdayCustomers.length);
    const conversionGrowth = calculateGrowthRate(todayConversionRate, yesterdayConversionRate);

    return {
      todaySales: todaySalesTotal,
      newOrders: newOrders.length,
      newCustomers: newCustomers.length,
      conversionRate: todayConversionRate.toFixed(2),
      totalSales: totalSalesAmount,
      totalOrders: allOrders.length,
      totalCustomers: allCustomers.length,
      growthStats: {
        salesGrowth: parseFloat(salesGrowth.toFixed(1)),
        ordersGrowth: parseFloat(ordersGrowth.toFixed(1)),
        customersGrowth: parseFloat(customersGrowth.toFixed(1)),
        conversionGrowth: parseFloat(conversionGrowth.toFixed(1))
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลรายได้ตามช่วงเวลา
export const getRevenueData = async (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
  try {
    let query = supabase
      .from('orders')
      .select('created_at, total_amount, discount_amount')
      .eq('payment_status', 'paid');

    // กำหนดช่วงเวลาตาม period
    const now = new Date();
    let startDate: Date;
    // วันในสัปดาห์เป็นภาษาไทย
    const thaiDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
    let dayOfWeek: number;

    switch (period) {
      case 'daily':
        // แสดงข้อมูล 7 วันในสัปดาห์ปัจจุบัน
        startDate = new Date(now);
        // เริ่มจากวันอาทิตย์ของสัปดาห์
        dayOfWeek = now.getDay(); // 0 = วันอาทิตย์, 1 = วันจันทร์, ...
        startDate.setDate(now.getDate() - dayOfWeek); // ย้อนกลับไปวันอาทิตย์
        break;
      case 'weekly':
        // แสดงข้อมูลเฉพาะเดือนปัจจุบัน
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // วันแรกของเดือนปัจจุบัน
        break;
      case 'monthly':
        // แสดงข้อมูล 12 เดือนย้อนหลังจากวันที่เลือก
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 12);
        break;
      case 'yearly':
        // แสดงข้อมูล 5 ปีย้อนหลังจากวันที่เลือก
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 5);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }

    query = query.gte('created_at', startDate.toISOString());

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) throw error;

    // จัดรูปแบบข้อมูลตาม period และรวมข้อมูลตามช่วงเวลา
    const aggregatedData: Record<string, { revenue: number, profit: number, count: number }> = {};
    
    // ตัวแปรสำหรับการคำนวณ
    let startOfPeriod: Date;
    let daysDiff: number;
    let firstDayOfMonth: Date;
    let dayOfMonth: number;
    
    data.forEach(order => {
      const date = new Date(order.created_at);
      let key = '';
      let weekNum = 0;
      
      switch (period) {
        case 'daily':
          // ใช้วันในสัปดาห์เป็นภาษาไทย
          key = thaiDays[date.getDay()];
          break;
        case 'weekly':
          // หาว่าเป็นสัปดาห์ที่เท่าไหร่ของเดือน
          // ตรวจสอบว่าอยู่ในเดือนปัจจุบันหรือไม่
          if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
            firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            dayOfMonth = date.getDate();
            weekNum = Math.ceil((dayOfMonth + firstDayOfMonth.getDay() - 1) / 7);
            key = `สัปดาห์ ${weekNum}`;
          } else {
            // ข้ามข้อมูลที่ไม่ได้อยู่ในเดือนปัจจุบันโดยกำหนด key เป็นค่าพิเศษ
            key = 'ignore';
          }
          break;
        case 'monthly':
          key = date.toLocaleDateString('th-TH', { month: 'short' });
          break;
        case 'yearly':
          key = date.getFullYear().toString();
          break;
      }

      // ตรวจสอบว่าควรข้ามข้อมูลหรือไม่
      if (key === 'ignore') {
        return; // ใช้ return เพื่อข้ามรายการนี้ใน forEach แทน continue
      }

      // คำนวณกำไรโดยหักส่วนลด
      const profit = order.total_amount - order.discount_amount;

      // รวมข้อมูลตามช่วงเวลา
      if (!aggregatedData[key]) {
        aggregatedData[key] = { revenue: 0, profit: 0, count: 0 };
      }
      
      aggregatedData[key].revenue += order.total_amount;
      aggregatedData[key].profit += profit;
      aggregatedData[key].count += 1;
    });

    // แปลงข้อมูลที่รวมแล้วเป็น array
    let formattedData = Object.entries(aggregatedData).map(([name, data]) => ({
      name,
      revenue: data.revenue,
      profit: data.profit
    }));

    // เพิ่มข้อมูลช่วงเวลาที่ขาดหายไป
    const now2 = new Date();
    
    if (period === 'daily') {
      // สร้างข้อมูลวันในสัปดาห์ปัจจุบัน (วันอาทิตย์ถึงวันเสาร์)
      const currentWeekDays = Array.from({ length: 7 }, (_, i) => thaiDays[i]);
      
      formattedData = ensureCompleteData(formattedData, currentWeekDays);
      
      // เรียงลำดับตามวันในสัปดาห์ อาทิตย์ - เสาร์
      formattedData.sort((a, b) => {
        return thaiDays.indexOf(a.name) - thaiDays.indexOf(b.name);
      });
    } 
    else if (period === 'weekly') {
      // ใช้วิธีคำนวณจำนวนสัปดาห์ในเดือนที่ถูกต้องกว่าเดิม
      // วันสุดท้ายของเดือน
      const lastDayOfMonth = new Date(now2.getFullYear(), now2.getMonth() + 1, 0);
      // วันแรกของเดือน
      const firstDayOfMonth = new Date(now2.getFullYear(), now2.getMonth(), 1);
      
      // คำนวณจำนวนสัปดาห์โดยใช้ตารางปฏิทิน (มองเป็นตาราง 7 วัน)
      const firstDay = firstDayOfMonth.getDay(); // 0 = อาทิตย์, 6 = เสาร์
      const totalDays = lastDayOfMonth.getDate();
      const totalWeeksInMonth = Math.ceil((totalDays + firstDay) / 7);
      
      // สร้างอาร์เรย์สำหรับทุกสัปดาห์ในเดือนปัจจุบัน
      const weeksInMonth = Array.from({ length: totalWeeksInMonth }, (_, i) => `สัปดาห์ ${i + 1}`);
      
      // ตรวจสอบว่ามีข้อมูลเกิน 4 สัปดาห์หรือไม่ ถ้ามีให้แสดงแค่ 4 สัปดาห์
      const weeksToShow = weeksInMonth.length > 4 ? weeksInMonth.slice(0, 4) : weeksInMonth;
      
      formattedData = ensureCompleteData(formattedData, weeksToShow);
      
      // เรียงตามสัปดาห์
      formattedData.sort((a, b) => {
        return parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]);
      });
      
      // จำกัดให้แสดงแค่ 4 สัปดาห์
      if (formattedData.length > 4) {
        formattedData = formattedData.slice(0, 4);
      }
    }
    else if (period === 'monthly') {
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now2.getFullYear(), i, 1);
        return date.toLocaleDateString('th-TH', { month: 'short' });
      });
      
      formattedData = ensureCompleteData(formattedData, months);
      
      // เรียงตามเดือน
      const thaiMonthOrder = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
      ];
      
      formattedData.sort((a, b) => {
        return thaiMonthOrder.indexOf(a.name) - thaiMonthOrder.indexOf(b.name);
      });
    }
    else if (period === 'yearly') {
      const years = Array.from({ length: 5 }, (_, i) => {
        return (now2.getFullYear() - 4 + i).toString();
      });
      
      formattedData = ensureCompleteData(formattedData, years);
      
      // เรียงตามปี
      formattedData.sort((a, b) => parseInt(a.name) - parseInt(b.name));
    }

    return formattedData;
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    throw error;
  }
};

// ฟังก์ชันช่วยเพิ่มข้อมูลที่หายไปในชุดข้อมูล
function ensureCompleteData(
  data: Array<{ name: string; revenue: number; profit: number }>,
  expectedLabels: string[]
): Array<{ name: string; revenue: number; profit: number }> {
  const existingNames = data.map(d => d.name);
  
  expectedLabels.forEach(label => {
    if (!existingNames.includes(label)) {
      data.push({
        name: label,
        revenue: 0,
        profit: 0
      });
    }
  });
  
  return data;
}

// ฟังก์ชันสำหรับอัพเดทที่อยู่ลูกค้า
export const updateCustomerAddress = async (
  customerId: string,
  addressData: {
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  }
) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update({
        address: addressData.address,
        city: addressData.city,
        state: addressData.state,
        postal_code: addressData.postal_code,
        country: addressData.country,
        updated_at: new Date().toISOString()
      })
      .eq('id', customerId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating customer address:', error);
    return { success: false, error };
  }
};

export const updateCustomer = async (
  customerId: string,
  customerData: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }
) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update(customerData)
      .eq('id', customerId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error updating customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัพเดทข้อมูลลูกค้า'
    };
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลยอดขายตามสินค้า
export const getProductSalesData = async () => {
  try {
    interface OrderItemWithProduct {
      quantity: number;
      total: number;
      products: {
        name: string;
        id: string;
      };
    }

    // ดึงข้อมูล order ที่มีสถานะการชำระเงินเป็น 'paid'
    const { data: paidOrders, error: paidOrdersError } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_status', 'paid');

    if (paidOrdersError) throw paidOrdersError;
    
    // ถ้าไม่มีคำสั่งซื้อที่ชำระเงินแล้ว ก็คืนค่าอาร์เรย์ว่าง
    if (!paidOrders || paidOrders.length === 0) {
      return [];
    }
    
    // ดึงเฉพาะ order_id ที่ชำระเงินแล้ว
    const paidOrderIds = paidOrders.map(order => order.id);
    
    // ดึงข้อมูล order_items ที่เกี่ยวข้องกับคำสั่งซื้อที่ชำระเงินแล้ว
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        quantity,
        total,
        products:product_id (
          name,
          id
        )
      `)
      .in('order_id', paidOrderIds) as { data: OrderItemWithProduct[] | null, error: Error | null };

    if (error) throw error;

    // รวมยอดขายตามสินค้า
    const productSales = (data || []).reduce((acc: Record<string, { name: string; value: number }>, item: OrderItemWithProduct) => {
      const productId = item.products.id;
      if (!acc[productId]) {
        acc[productId] = {
          name: item.products.name,
          value: 0
        };
      }
      acc[productId].value += item.total;
      return acc;
    }, {});

    // แปลงเป็น array และเรียงตามยอดขาย
    const salesData = Object.values(productSales)
      .sort((a, b) => b.value - a.value)
      .slice(0, 7); // เอาแค่ 7 สินค้าที่มียอดขายสูงสุด

    // คำนวณยอดขายรวม
    const totalSales = salesData.reduce((sum, item) => sum + item.value, 0);

    // แปลงเป็นเปอร์เซ็นต์
    const productData = salesData.map(item => ({
      name: item.name,
      value: Number(((item.value / totalSales) * 100).toFixed(1)),
      color: getProductColor(item.name)
    }));

    return productData;
  } catch (error) {
    console.error('Error fetching product sales data:', error);
    throw error;
  }
};

// ฟังก์ชันสำหรับกำหนดสีให้กับสินค้า
const getProductColor = (productName: string): string => {
  const colors = [
    "hsl(var(--primary))",
    "#94A3B8",
    "#64748B",
    "#475569",
    "#334155",
    "#334165",
    "#334155"
  ];
  
  // ใช้ hash ของชื่อสินค้าเพื่อกำหนดสี
  const hash = productName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

// ฟังก์ชันสำหรับดึงข้อมูลลูกค้าตามประเทศ
export const getCustomerLocationData = async () => {
  try {
    // ดึงข้อมูลลูกค้าทั้งหมดพร้อมประเทศ
    const { data: customers, error } = await supabase
      .from('customers')
      .select('country');

    if (error) throw error;

    // นับจำนวนลูกค้าแยกตามประเทศ
    const countryCount = customers.reduce((acc: Record<string, number>, customer) => {
      const country = customer.country || 'ไม่ระบุ';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});

    // คำนวณเปอร์เซ็นต์และจัดรูปแบบข้อมูล
    const totalCustomers = customers.length;
    const locationData = Object.entries(countryCount)
      .map(([country, count], index) => ({
        name: country,
        value: Number(((count / totalCustomers) * 100).toFixed(1)),
        color: getProductColor(country) // ใช้ฟังก์ชันเดิมในการกำหนดสี
      }))
      .sort((a, b) => b.value - a.value); // เรียงลำดับตามจำนวนมากไปน้อย

    return locationData;
  } catch (error) {
    console.error('Error fetching customer location data:', error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลการแบ่งกลุ่มลูกค้า
export const getCustomerSegmentsData = async () => {
  try {
    // ดึงข้อมูลลูกค้าและออเดอร์ทั้งหมด
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('id, created_at, total_orders');

    if (customersError) throw customersError;

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('customer_id, created_at, status');

    if (ordersError) throw ordersError;

    // คำนวณระยะเวลา
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(now.getDate() - 90);

    // แบ่งกลุ่มลูกค้า
    let newCustomers = 0;
    let regularCustomers = 0;
    let multiCategoryCustomers = 0;
    let inactiveCustomers = 0;

    // ลูกค้าใหม่ - ลูกค้าที่มี created_at ไม่เกิน 30 วัน
    newCustomers = customers.filter(customer => 
      new Date(customer.created_at) >= thirtyDaysAgo
    ).length;

    // ลูกค้าประจำ - ลูกค้าที่มีคำสั่งซื้อมากกว่า 1 ครั้งในช่วง 90 วัน
    const customerOrdersMap = orders.reduce((acc: Record<string, number>, order) => {
      if (new Date(order.created_at) >= ninetyDaysAgo && order.status !== 'cancelled') {
        acc[order.customer_id] = (acc[order.customer_id] || 0) + 1;
      }
      return acc;
    }, {});

    regularCustomers = Object.values(customerOrdersMap).filter(count => count > 1).length;

    // ลูกค้าหลายประเภทสินค้า - จำลองข้อมูล (เนื่องจากข้อมูลจริงต้องวิเคราะห์ประเภทสินค้าที่ลูกค้าซื้อ)
    multiCategoryCustomers = Math.floor(customers.length * 0.15); // สมมติว่า 15% ของลูกค้าซื้อหลายประเภทสินค้า

    // ลูกค้าที่ไม่ได้กลับมา - ลูกค้าที่มีคำสั่งซื้อแต่ไม่มีการซื้อในช่วง 90 วัน
    inactiveCustomers = customers.filter(customer => 
      customer.total_orders > 0 && 
      !Object.keys(customerOrdersMap).includes(customer.id)
    ).length;

    // คำนวณเป็นเปอร์เซ็นต์
    const totalCustomers = customers.length || 1; // ป้องกันการหารด้วย 0
    const segmentData = [
      { 
        name: "ลูกค้าใหม่", 
        value: Number(((newCustomers / totalCustomers) * 100).toFixed(1)),
        color: "hsl(var(--primary))" 
      },
      { 
        name: "ลูกค้าประจำ", 
        value: Number(((regularCustomers / totalCustomers) * 100).toFixed(1)),
        color: "#94A3B8" 
      },
      { 
        name: "ลูกค้าหลายประเภทสินค้า", 
        value: Number(((multiCategoryCustomers / totalCustomers) * 100).toFixed(1)),
        color: "#64748B" 
      },
      { 
        name: "ลูกค้าที่ไม่ได้กลับมา", 
        value: Number(((inactiveCustomers / totalCustomers) * 100).toFixed(1)),
        color: "#475569" 
      }
    ];

    return segmentData.sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Error fetching customer segments data:', error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลแหล่งที่มาของลูกค้า
export const getCustomerSourceData = async () => {
  try {
    // ในฐานข้อมูลจริง ควรมีฟิลด์ source_channel หรือคล้ายกันในตาราง customers
    // แต่ตอนนี้เราจะจำลองข้อมูลโดยการดึงข้อมูลลูกค้าทั้งหมดและสุ่มแหล่งที่มา
    const { data: customers, error } = await supabase
      .from('customers')
      .select('id');

    if (error) throw error;

    // จำลองแหล่งที่มาของลูกค้าตามสัดส่วนที่กำหนด
    const totalCustomers = customers.length;
    const sourceData = [
      { 
        name: "โซเชียลมีเดีย", 
        value: Math.round((totalCustomers * 0.4) / totalCustomers * 100),
        color: "hsl(var(--primary))" 
      },
      { 
        name: "การบอกต่อ", 
        value: Math.round((totalCustomers * 0.25) / totalCustomers * 100),
        color: "#94A3B8" 
      },
      { 
        name: "โฆษณาออนไลน์", 
        value: Math.round((totalCustomers * 0.2) / totalCustomers * 100),
        color: "#64748B" 
      },
      { 
        name: "ออฟไลน์", 
        value: Math.round((totalCustomers * 0.15) / totalCustomers * 100),
        color: "#475569" 
      }
    ];
    
    // ปรับแต่งให้ผลรวมเป็น 100%
    const sum = sourceData.reduce((acc, item) => acc + item.value, 0);
    if (sum !== 100) {
      // ปรับค่าสุดท้ายให้ผลรวมเป็น 100%
      sourceData[sourceData.length - 1].value += (100 - sum);
    }

    return sourceData;
  } catch (error) {
    console.error('Error fetching customer source data:', error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลลูกค้าใหม่รายเดือน
export const getNewCustomersData = async () => {
  try {
    // สร้างรายการเดือนในรูปแบบไทย
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    
    // สร้าง array เก็บข้อมูลลูกค้าใหม่แต่ละเดือน
    const newCustomersData = Array(12).fill(0).map((_, index) => ({
      name: thaiMonths[index],
      value: 0
    }));
    
    // ดึงข้อมูลลูกค้าทั้งหมดพร้อมวันที่ลงทะเบียน
    const { data: customers, error } = await supabase
      .from('customers')
      .select('created_at');
      
    if (error) throw error;
    
    // นับจำนวนลูกค้าใหม่แยกตามเดือน
    const now = new Date();
    const currentYear = now.getFullYear();
    
    customers.forEach(customer => {
      const createdAt = new Date(customer.created_at);
      // เฉพาะข้อมูลในปีปัจจุบัน
      if (createdAt.getFullYear() === currentYear) {
        const month = createdAt.getMonth();
        newCustomersData[month].value += 1;
      }
    });
    
    // ดึงข้อมูลลูกค้าใหม่เดือนก่อนหน้า
    const previousMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const currentMonth = now.getMonth();
    
    // คำนวณเปอร์เซ็นต์การเติบโต
    const growth = newCustomersData[previousMonth].value !== 0
      ? ((newCustomersData[currentMonth].value - newCustomersData[previousMonth].value) / newCustomersData[previousMonth].value) * 100
      : 0;
    
    // จำนวนลูกค้าใหม่เดือนปัจจุบัน
    const currentMonthNewCustomers = newCustomersData[currentMonth].value;
    
    return {
      chartData: newCustomersData,
      currentMonthTotal: currentMonthNewCustomers,
      growth: Number(growth.toFixed(1))
    };
  } catch (error) {
    console.error('Error fetching new customers data:', error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลอัตราการซื้อซ้ำ
export const getRepurchaseRateData = async () => {
  try {
    // สร้างรายการเดือนในรูปแบบไทย
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    
    // สร้าง array เก็บข้อมูลอัตราการซื้อซ้ำแต่ละเดือน
    const repurchaseRateData = Array(12).fill(0).map((_, index) => ({
      name: thaiMonths[index],
      value: 0
    }));
    
    // ดึงข้อมูล orders ทั้งหมด
    const { data: orders, error } = await supabase
      .from('orders')
      .select('customer_id, created_at')
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    // แยกออเดอร์ตามลูกค้าและเดือน
    const customerOrdersByMonth: Record<string, Record<number, number>> = {};
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // นับจำนวนลูกค้าที่มีการสั่งซื้อในแต่ละเดือน
    const uniqueCustomersByMonth: Record<number, Set<string>> = {};
    // นับจำนวนลูกค้าที่มีการสั่งซื้อซ้ำในแต่ละเดือน
    const repeatCustomersByMonth: Record<number, Set<string>> = {};
    
    // สร้าง Set สำหรับแต่ละเดือน
    for (let i = 0; i < 12; i++) {
      uniqueCustomersByMonth[i] = new Set();
      repeatCustomersByMonth[i] = new Set();
    }
    
    // จัดกลุ่มออเดอร์ตามลูกค้าและเดือน
    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      // เฉพาะข้อมูลในปีปัจจุบัน
      if (orderDate.getFullYear() === currentYear) {
        const month = orderDate.getMonth();
        const customerId = order.customer_id;
        
        // เพิ่มลูกค้าในเซ็ตของลูกค้าทั้งหมดในเดือนนั้น
        uniqueCustomersByMonth[month].add(customerId);
        
        // ตรวจสอบว่าลูกค้าคนนี้เคยมีการสั่งซื้อมาก่อนหรือไม่
        if (!customerOrdersByMonth[customerId]) {
          customerOrdersByMonth[customerId] = {};
        }
        
        // เพิ่มจำนวนออเดอร์ของลูกค้าในเดือนนั้น
        customerOrdersByMonth[customerId][month] = (customerOrdersByMonth[customerId][month] || 0) + 1;
        
        // ถ้าลูกค้ามีออเดอร์มากกว่า 1 ครั้งในเดือนนั้น หรือ เคยมีออเดอร์ในเดือนก่อนหน้านี้
        if (customerOrdersByMonth[customerId][month] > 1 || Object.keys(customerOrdersByMonth[customerId]).some(m => parseInt(m) < month)) {
          repeatCustomersByMonth[month].add(customerId);
        }
      }
    });
    
    // คำนวณอัตราการซื้อซ้ำสำหรับแต่ละเดือน
    for (let month = 0; month < 12; month++) {
      if (uniqueCustomersByMonth[month].size > 0) {
        repurchaseRateData[month].value = Math.round((repeatCustomersByMonth[month].size / uniqueCustomersByMonth[month].size) * 100);
      } else {
        repurchaseRateData[month].value = 0;
      }
    }
    
    // อัตราการซื้อซ้ำในเดือนปัจจุบัน
    const currentMonth = now.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    // คำนวณเปอร์เซ็นต์การเติบโต
    let growth = 0;
    if (repurchaseRateData[previousMonth].value > 0) {
      growth = ((repurchaseRateData[currentMonth].value - repurchaseRateData[previousMonth].value) / repurchaseRateData[previousMonth].value) * 100;
    } else if (repurchaseRateData[currentMonth].value > 0) {
      growth = 100; // เติบโต 100% ถ้าเดือนก่อนเป็น 0
    }
    
    return {
      chartData: repurchaseRateData,
      currentMonthRate: repurchaseRateData[currentMonth].value,
      growth: Number(growth.toFixed(1))
    };
  } catch (error) {
    console.error('Error fetching repurchase rate data:', error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลมูลค่าเฉลี่ยต่อออเดอร์
export const getAverageOrderValueData = async () => {
  try {
    // สร้างรายการเดือนในรูปแบบไทย
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    
    // สร้าง array เก็บข้อมูลมูลค่าเฉลี่ยต่อออเดอร์แต่ละเดือน
    const avgOrderValueData = Array(12).fill(0).map((_, index) => ({
      name: thaiMonths[index],
      value: 0
    }));
    
    // สร้าง array สำหรับเก็บจำนวนออเดอร์ในแต่ละเดือน
    const ordersCountByMonth = Array(12).fill(0);
    
    // สร้าง array สำหรับเก็บยอดรวมในแต่ละเดือน
    const ordersTotalByMonth = Array(12).fill(0);
    
    // ดึงข้อมูล orders ทั้งหมดที่ชำระเงินแล้ว
    const { data: orders, error } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    // รวมยอดและนับจำนวนออเดอร์แยกตามเดือน
    const now = new Date();
    const currentYear = now.getFullYear();
    
    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      // เฉพาะข้อมูลในปีปัจจุบัน
      if (orderDate.getFullYear() === currentYear) {
        const month = orderDate.getMonth();
        ordersCountByMonth[month] += 1;
        ordersTotalByMonth[month] += order.total_amount;
      }
    });
    
    // คำนวณมูลค่าเฉลี่ยต่อออเดอร์สำหรับแต่ละเดือน
    for (let month = 0; month < 12; month++) {
      if (ordersCountByMonth[month] > 0) {
        avgOrderValueData[month].value = Math.round(ordersTotalByMonth[month] / ordersCountByMonth[month]);
      }
    }
    
    // มูลค่าเฉลี่ยในเดือนปัจจุบัน
    const currentMonth = now.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    // คำนวณเปอร์เซ็นต์การเติบโต
    let growth = 0;
    if (avgOrderValueData[previousMonth].value > 0) {
      growth = ((avgOrderValueData[currentMonth].value - avgOrderValueData[previousMonth].value) / avgOrderValueData[previousMonth].value) * 100;
    } else if (avgOrderValueData[currentMonth].value > 0) {
      growth = 100; // เติบโต 100% ถ้าเดือนก่อนเป็น 0
    }
    
    return {
      chartData: avgOrderValueData,
      currentMonthAvg: avgOrderValueData[currentMonth].value,
      growth: Number(growth.toFixed(1))
    };
  } catch (error) {
    console.error('Error fetching average order value data:', error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลรายงานสินค้า
export const getProductReportData = async (
  viewType: 'bestselling' | 'worstselling' | 'returned', 
  timePeriod: 'day' | 'week' | 'month' | 'year',
  selectedDate: Date = new Date()
) => {
  try {
    // กำหนดช่วงเวลาตาม timePeriod และวันที่เลือก
    const now = new Date(selectedDate);
    let startDate: Date;
    const endDate: Date = new Date(now);
    endDate.setHours(23, 59, 59, 999); // ตั้งเวลาเป็นสิ้นสุดวัน

    switch (timePeriod) {
      case 'day':
        // แสดงข้อมูลเฉพาะวันที่เลือก
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        // แสดงข้อมูล 7 วันย้อนหลังจากวันที่เลือก
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        // แสดงข้อมูล 30 วันย้อนหลังจากวันที่เลือก
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
      case 'year':
        // แสดงข้อมูล 365 วันย้อนหลังจากวันที่เลือก
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30); // ค่าเริ่มต้น 30 วัน
    }

    console.log(`ช่วงเวลาการดึงข้อมูล: ${startDate.toISOString()} ถึง ${endDate.toISOString()}`);

    // หากเป็นการดึงข้อมูลสินค้าขายดีหรือขายไม่ดี
    if (viewType === 'bestselling' || viewType === 'worstselling') {
      // ดึงข้อมูล order ที่มีสถานะการชำระเงินเป็น 'paid' ในช่วงเวลาที่กำหนด
      const { data: paidOrders, error: paidOrdersError } = await supabase
        .from('orders')
        .select('id')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .eq('payment_status', 'paid');

      if (paidOrdersError) throw paidOrdersError;
      
      console.log(`จำนวนออเดอร์ที่พบ: ${paidOrders?.length || 0}`);
      
      // ถ้าไม่มีคำสั่งซื้อที่ชำระเงินแล้ว ก็คืนค่าอาร์เรย์ว่าง
      if (!paidOrders || paidOrders.length === 0) {
        return [];
      }
      
      // ดึงเฉพาะ order_id ที่ชำระเงินแล้ว
      const paidOrderIds = paidOrders.map(order => order.id);
      
      interface OrderItemWithProduct {
        quantity: number;
        price: number;
        total: number;
        points: number;
        products: {
          name: string;
          id: string;
        };
      }
      
      // ดึงข้อมูล order_items พร้อมกับข้อมูลสินค้า
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          quantity,
          price,
          total,
          points,
          products:product_id (
            name,
            id
          )
        `)
        .in('order_id', paidOrderIds) as { data: OrderItemWithProduct[] | null, error: Error | null };

      if (error) throw error;

      console.log(`จำนวนรายการสินค้าที่พบ: ${data?.length || 0}`);

      interface ProductSale {
        name: string;
        value: number;
        revenue: number;
        points: number;
      }

      // รวมยอดขายตามสินค้า
      const productSales = (data || []).reduce<Record<string, ProductSale>>((acc, item) => {
        const productId = item.products.id;
        const productName = item.products.name;
        if (!acc[productId]) {
          acc[productId] = {
            name: productName,
            value: 0,
            revenue: 0,
            points: 0
          };
        }
        acc[productId].value += item.quantity;
        acc[productId].revenue += item.total;
        acc[productId].points += item.points || 0;
        return acc;
      }, {});

      // แปลงเป็น array และเรียงลำดับ
      let sortedData = Object.values(productSales)
        .sort((a, b) => b.value - a.value);
      
      // สำหรับสินค้าขายไม่ดี ให้เรียงลำดับจากน้อยไปมาก
      if (viewType === 'worstselling') {
        sortedData = sortedData.sort((a, b) => a.value - b.value);
      }
      
      // เอาแค่ 5 รายการแรก
      return sortedData.slice(0, 5);
    } 
    // หากเป็นการดึงข้อมูลสินค้าคืน
    else if (viewType === 'returned') {
      // ดึงข้อมูลออเดอร์ที่มีสถานะเป็น 'refunded' ในช่วงเวลาที่กำหนด
      const { data: refundedOrders, error: refundedOrdersError } = await supabase
        .from('orders')
        .select('id')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .eq('status', 'refunded');

      if (refundedOrdersError) throw refundedOrdersError;
      
      console.log(`จำนวนออเดอร์คืนสินค้าที่พบ: ${refundedOrders?.length || 0}`);
      
      // ถ้าไม่มีคำสั่งซื้อที่คืนเงิน ก็คืนค่าอาร์เรย์ว่าง
      if (!refundedOrders || refundedOrders.length === 0) {
        return {
          products: [],
          reasons: []
        };
      }
      
      // ดึงเฉพาะ order_id ที่คืนเงิน
      const refundedOrderIds = refundedOrders.map(order => order.id);
      
      // สมมติข้อมูลสาเหตุการคืนสินค้า (ในระบบจริงควรมีตารางเก็บข้อมูลนี้)
      const returnReasons = [
        "สินค้าชำรุด", "ไม่ตรงตามคำอธิบาย", "คุณภาพต่ำกว่าที่คาดหวัง", 
        "แพ้ส่วนผสม", "ผิดสี", "ส่งผิดสินค้า", "ไม่ต้องการแล้ว"
      ];
      
      interface ReturnItemWithProduct {
        quantity: number;
        products: {
          name: string;
          id: string;
        };
      }
      
      // ดึงข้อมูล order_items ของออเดอร์ที่คืนเงิน
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          quantity,
          products:product_id (
            name,
            id
          )
        `)
        .in('order_id', refundedOrderIds) as { data: ReturnItemWithProduct[] | null, error: Error | null };

      if (error) throw error;

      console.log(`จำนวนรายการสินค้าคืนที่พบ: ${data?.length || 0}`);

      interface ReturnedProduct {
        name: string;
        value: number;
        reason: string;
      }

      // รวมจำนวนสินค้าคืนตามชนิดสินค้า
      const returnedProducts = (data || []).reduce<Record<string, ReturnedProduct>>((acc, item) => {
        const productId = item.products.id;
        const productName = item.products.name;
        if (!acc[productId]) {
          // สุ่มสาเหตุการคืน (ในระบบจริงควรดึงจากฐานข้อมูล)
          const reason = returnReasons[Math.floor(Math.random() * returnReasons.length)];
          acc[productId] = {
            name: productName,
            value: 0,
            reason
          };
        }
        acc[productId].value += item.quantity;
        return acc;
      }, {});

      // แปลงเป็น array และเรียงลำดับจากมากไปน้อย
      const sortedProducts = Object.values(returnedProducts)
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
      
      // คำนวณสาเหตุการคืนสินค้า
      const reasonCounts: Record<string, number> = {};
      sortedProducts.forEach(product => {
        if (!reasonCounts[product.reason]) {
          reasonCounts[product.reason] = 0;
        }
        reasonCounts[product.reason] += product.value;
      });
      
      // แปลงเป็น array และเรียงลำดับ
      const reasonsData = Object.entries(reasonCounts).map(([name, value]) => ({
        name,
        value: Number(value),
        color: getProductColor(name)
      })).sort((a, b) => b.value - a.value);
      
      return {
        products: sortedProducts,
        reasons: reasonsData
      };
    }
    
    // กรณีไม่ตรงกับเงื่อนไขใดๆ
    return [];
  } catch (error) {
    console.error(`Error fetching ${viewType} product report data:`, error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลคำสั่งซื้อตามช่วงเวลา
export const getOrdersData = async (period: 'daily' | 'weekly' | 'monthly' | 'yearly', selectedDate: Date = new Date()) => {
  try {
    let query = supabase
      .from('orders')
      .select('created_at, id')
      .eq('payment_status', 'paid');

    // กำหนดช่วงเวลาตาม period
    const now = new Date(selectedDate); // ใช้วันที่ที่เลือกแทนวันที่ปัจจุบัน
    let startDate: Date;
    // วันในสัปดาห์เป็นภาษาไทย
    const thaiDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
    let dayOfWeek: number;

    switch (period) {
      case 'daily':
        // แสดงข้อมูล 7 วันในสัปดาห์ที่วันที่เลือกอยู่
        startDate = new Date(now);
        dayOfWeek = now.getDay(); // 0 = วันอาทิตย์, 1 = วันจันทร์, ...
        startDate.setDate(now.getDate() - dayOfWeek); // ย้อนกลับไปวันอาทิตย์
        break;
      case 'weekly':
        // แสดงข้อมูลเฉพาะเดือนที่วันที่เลือกอยู่
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // วันแรกของเดือนที่วันที่เลือกอยู่
        break;
      case 'monthly':
        // แสดงข้อมูล 12 เดือนย้อนหลังจากวันที่เลือก
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 12);
        break;
      case 'yearly':
        // แสดงข้อมูล 5 ปีย้อนหลังจากวันที่เลือก
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 5);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }

    query = query.gte('created_at', startDate.toISOString());

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) throw error;

    // จัดรูปแบบข้อมูลตาม period และรวมข้อมูลตามช่วงเวลา
    const aggregatedData: Record<string, { orders: number }> = {};
    
    // ตัวแปรสำหรับการคำนวณ
    let startOfPeriod: Date;
    let daysDiff: number;
    let firstDayOfMonth: Date;
    let dayOfMonth: number;
    
    data.forEach(order => {
      const date = new Date(order.created_at);
      let key = '';
      let weekNum = 0;
      
      switch (period) {
        case 'daily':
          // ใช้วันในสัปดาห์เป็นภาษาไทย
          key = thaiDays[date.getDay()];
          break;
        case 'weekly':
          // หาว่าเป็นสัปดาห์ที่เท่าไหร่ของเดือน
          // ตรวจสอบว่าอยู่ในเดือนเดียวกับวันที่เลือกหรือไม่
          if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
            firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            dayOfMonth = date.getDate();
            weekNum = Math.ceil((dayOfMonth + firstDayOfMonth.getDay() - 1) / 7);
            key = `สัปดาห์ ${weekNum}`;
          } else {
            // ข้ามข้อมูลที่ไม่ได้อยู่ในเดือนของวันที่เลือกโดยกำหนด key เป็นค่าพิเศษ
            key = 'ignore';
          }
          break;
        case 'monthly':
          key = date.toLocaleDateString('th-TH', { month: 'short' });
          break;
        case 'yearly':
          key = date.getFullYear().toString();
          break;
      }

      // ตรวจสอบว่าควรข้ามข้อมูลหรือไม่
      if (key === 'ignore') {
        return; // ใช้ return เพื่อข้ามรายการนี้ใน forEach แทน continue
      }

      // รวมข้อมูลตามช่วงเวลา
      if (!aggregatedData[key]) {
        aggregatedData[key] = { orders: 0 };
      }
      
      aggregatedData[key].orders += 1;
    });

    // แปลงข้อมูลที่รวมแล้วเป็น array
    let formattedData = Object.entries(aggregatedData).map(([name, data]) => ({
      name,
      orders: data.orders
    }));

    // เพิ่มข้อมูลช่วงเวลาที่ขาดหายไป
    const now2 = new Date(selectedDate); // ใช้วันที่ที่เลือกแทนวันที่ปัจจุบัน
    
    if (period === 'daily') {
      // สร้างข้อมูลวันในสัปดาห์ของวันที่เลือก (วันอาทิตย์ถึงวันเสาร์)
      const currentWeekDays = Array.from({ length: 7 }, (_, i) => thaiDays[i]);
      
      formattedData = ensureCompleteOrdersData(formattedData, currentWeekDays);
      
      // เรียงลำดับตามวันในสัปดาห์ อาทิตย์ - เสาร์
      formattedData.sort((a, b) => {
        return thaiDays.indexOf(a.name) - thaiDays.indexOf(b.name);
      });
    } 
    else if (period === 'weekly') {
      // วันสุดท้ายของเดือนที่วันที่เลือกอยู่
      const lastDayOfMonth = new Date(now2.getFullYear(), now2.getMonth() + 1, 0);
      // วันแรกของเดือนที่วันที่เลือกอยู่
      const firstDayOfMonth = new Date(now2.getFullYear(), now2.getMonth(), 1);
      
      // คำนวณจำนวนสัปดาห์โดยใช้ตารางปฏิทิน (มองเป็นตาราง 7 วัน)
      const firstDay = firstDayOfMonth.getDay(); // 0 = อาทิตย์, 6 = เสาร์
      const totalDays = lastDayOfMonth.getDate();
      const totalWeeksInMonth = Math.ceil((totalDays + firstDay) / 7);
      
      // สร้างอาร์เรย์สำหรับทุกสัปดาห์ในเดือนของวันที่เลือก
      const weeksInMonth = Array.from({ length: totalWeeksInMonth }, (_, i) => `สัปดาห์ ${i + 1}`);
      
      // ตรวจสอบว่ามีข้อมูลเกิน 4 สัปดาห์หรือไม่ ถ้ามีให้แสดงแค่ 4 สัปดาห์
      const weeksToShow = weeksInMonth.length > 4 ? weeksInMonth.slice(0, 4) : weeksInMonth;
      
      formattedData = ensureCompleteOrdersData(formattedData, weeksToShow);
      
      // เรียงตามสัปดาห์
      formattedData.sort((a, b) => {
        return parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]);
      });
      
      // จำกัดให้แสดงแค่ 4 สัปดาห์
      if (formattedData.length > 4) {
        formattedData = formattedData.slice(0, 4);
      }
    }
    else if (period === 'monthly') {
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now2.getFullYear(), i, 1);
        return date.toLocaleDateString('th-TH', { month: 'short' });
      });
      
      formattedData = ensureCompleteOrdersData(formattedData, months);
      
      // เรียงตามเดือน
      const thaiMonthOrder = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
      ];
      
      formattedData.sort((a, b) => {
        return thaiMonthOrder.indexOf(a.name) - thaiMonthOrder.indexOf(b.name);
      });
    }
    else if (period === 'yearly') {
      const years = Array.from({ length: 5 }, (_, i) => {
        return (now2.getFullYear() - 4 + i).toString();
      });
      
      formattedData = ensureCompleteOrdersData(formattedData, years);
      
      // เรียงตามปี
      formattedData.sort((a, b) => parseInt(a.name) - parseInt(b.name));
    }

    return formattedData;
  } catch (error) {
    console.error('Error fetching orders data:', error);
    throw error;
  }
};

// ฟังก์ชันช่วยเพิ่มข้อมูลที่หายไปในชุดข้อมูลสำหรับคำสั่งซื้อ
function ensureCompleteOrdersData(
  data: Array<{ name: string; orders: number }>,
  expectedLabels: string[]
): Array<{ name: string; orders: number }> {
  const existingNames = data.map(d => d.name);
  
  expectedLabels.forEach(label => {
    if (!existingNames.includes(label)) {
      data.push({
        name: label,
        orders: 0
      });
    }
  });
  
  return data;
}

// ฟังก์ชันสำหรับดึงข้อมูลยอดขายและคำสั่งซื้อตามสินค้า
export const getProductSalesReport = async (selectedDate: Date = new Date()) => {
  try {
    interface OrderItemWithProduct {
      quantity: number;
      total: number;
      products: {
        name: string;
        id: string;
        category_id: string;
      };
    }

    // กำหนดช่วงเวลา - ใช้ข้อมูลจาก 30 วันย้อนหลังจากวันที่เลือก
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999); // สิ้นสุดของวันที่เลือก
    
    const startDate = new Date(selectedDate);
    startDate.setDate(startDate.getDate() - 30); // 30 วันก่อนวันที่เลือก
    startDate.setHours(0, 0, 0, 0); // เริ่มต้นของวัน

    // ดึงข้อมูล order ที่มีสถานะการชำระเงินเป็น 'paid' ในช่วงเวลาที่กำหนด
    const { data: paidOrders, error: paidOrdersError } = await supabase
      .from('orders')
      .select('id')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .eq('payment_status', 'paid');

    if (paidOrdersError) throw paidOrdersError;
    
    console.log(`จำนวนออเดอร์ที่พบในช่วง ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}: ${paidOrders?.length || 0}`);

    // ถ้าไม่มีคำสั่งซื้อที่ชำระเงินแล้ว ก็คืนค่าอาร์เรย์ว่าง
    if (!paidOrders || paidOrders.length === 0) {
      return [];
    }
    
    // ดึงเฉพาะ order_id ที่ชำระเงินแล้ว
    const paidOrderIds = paidOrders.map(order => order.id);
    
    // ดึงข้อมูล order_items ที่เกี่ยวข้องกับคำสั่งซื้อที่ชำระเงินแล้ว
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        quantity,
        total,
        products:product_id (
          name,
          id,
          category_id
        )
      `)
      .in('order_id', paidOrderIds) as { data: OrderItemWithProduct[] | null, error: Error | null };

    if (error) throw error;

    // รวมยอดขายและจำนวนคำสั่งซื้อตามสินค้า
    const productSales = (data || []).reduce((acc: Record<string, { name: string; revenue: number; orders: number }>, item: OrderItemWithProduct) => {
      const productId = item.products.id;
      if (!acc[productId]) {
        acc[productId] = {
          name: item.products.name,
          revenue: 0,
          orders: 0
        };
      }
      acc[productId].revenue += item.total;
      acc[productId].orders += item.quantity;
      return acc;
    }, {});

    // แปลงเป็น array และเรียงตามยอดขาย
    const productReport = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // เอาแค่ 10 สินค้าที่มียอดขายสูงสุด

    return productReport;
  } catch (error) {
    console.error('Error fetching product sales report:', error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลลูกค้าตาม ID
export const getCustomerById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return { 
      success: true, 
      customer: data 
    };
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    return { 
      success: false, 
      error: error instanceof Error 
        ? { message: error.message, details: '' } 
        : { message: 'Unknown error', details: '' } 
    };
  }
};

// ฟังก์ชันสำหรับสร้างหรืออัพเดตข้อมูลลูกค้า
export const createOrUpdateCustomer = async (customerData: {
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
}) => {
  try {
    // ตรวจสอบว่ามีลูกค้าคนนี้ในระบบหรือไม่
    const { data: existingCustomer, error: checkError } = await supabase
      .from('customers')
      .select('id')
      .eq('id', customerData.id)
      .single();
      
    let operation = '';
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = No rows found
      throw checkError;
    }
    
    if (!existingCustomer) {
      // ถ้าไม่มีลูกค้า ให้สร้างใหม่
      operation = 'create';
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          id: customerData.id,
          email: customerData.email,
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          phone: customerData.phone,
          address: customerData.address,
          city: customerData.city,
          state: customerData.state,
          postal_code: customerData.postal_code,
          country: customerData.country,
          points: 0,
          total_orders: 0,
          total_spent: 0,
          updated_at: new Date().toISOString()
        }])
        .select();
        
      if (error) throw error;
      
      return { 
        success: true, 
        operation, 
        data: data?.[0] 
      };
    } else {
      // ถ้ามีลูกค้าอยู่แล้ว ให้อัพเดต
      operation = 'update';
      const { data, error } = await supabase
        .from('customers')
        .update({
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          phone: customerData.phone,
          address: customerData.address,
          city: customerData.city,
          state: customerData.state,
          postal_code: customerData.postal_code,
          country: customerData.country,
          updated_at: new Date().toISOString()
        })
        .eq('id', customerData.id)
        .select();
        
      if (error) throw error;
      
      return { 
        success: true, 
        operation, 
        data: data?.[0] 
      };
    }
  } catch (error) {
    console.error('Error creating or updating customer:', error);
    return { 
      success: false, 
      error: error instanceof Error 
        ? { message: error.message, details: '' } 
        : { message: 'Unknown error', details: '' } 
    };
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลคำสั่งซื้อของลูกค้า
export const getCustomerOrders = async (customerId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items (
          *,
          products:product_id (
            id,
            name,
            price,
            images
          )
        )
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      orders: data || []
    };
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return {
      success: false,
      error,
      orders: []
    };
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลสินค้าที่ชอบของลูกค้า
export const getCustomerWishlist = async (customerId: string) => {
  try {
    // ตรวจสอบว่าตาราง wishlists มีหรือไม่
    const { count, error: checkError } = await supabase
      .from('wishlists')
      .select('*', { count: 'exact', head: true });

    if (checkError) {
      console.error('ตาราง wishlists อาจไม่มีอยู่:', checkError);
      return {
        success: false,
        error: checkError,
        wishlist: []
      };
    }

    // ดึงข้อมูลรายการสินค้าที่ชอบ
    const { data, error } = await supabase
      .from('wishlists')
      .select(`
        *,
        products:product_id (
          id,
          name,
          price,
          discount,
          images,
          stock
        )
      `)
      .eq('customer_id', customerId);

    if (error) throw error;

    return {
      success: true,
      wishlist: data || []
    };
  } catch (error) {
    console.error('Error fetching customer wishlist:', error);
    return {
      success: false,
      error,
      wishlist: []
    };
  }
};

// ฟังก์ชันสำหรับลบสินค้าออกจากรายการสินค้าที่ชอบ
export const removeFromWishlist = async (customerId: string, productId: string) => {
  try {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .match({ customer_id: customerId, product_id: productId });

    if (error) throw error;

    return {
      success: true
    };
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    return {
      success: false,
      error
    };
  }
};
