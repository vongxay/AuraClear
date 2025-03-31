-- เตรียมระบบสำหรับสร้าง UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ตรวจสอบและสร้างตาราง customers ถ้ายังไม่มี
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'customers') THEN
    CREATE TABLE customers (
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
  ELSE
    -- เพิ่มคอลัมน์ is_vip ถ้ายังไม่มี
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'is_vip') THEN
      ALTER TABLE customers ADD COLUMN is_vip BOOLEAN DEFAULT false;
    END IF;
      
    -- เพิ่มคอลัมน์ total_orders ถ้ายังไม่มี
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'total_orders') THEN
      ALTER TABLE customers ADD COLUMN total_orders INTEGER DEFAULT 0;
    END IF;
    
    -- เพิ่มคอลัมน์ total_spent ถ้ายังไม่มี
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'total_spent') THEN
      ALTER TABLE customers ADD COLUMN total_spent NUMERIC(10, 2) DEFAULT 0;
    END IF;
  END IF;
END $$;

-- ตรวจสอบและสร้างตาราง categories ถ้ายังไม่มี
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'categories') THEN
    CREATE TABLE categories (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      description TEXT,
      parent_id UUID,
      image TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- เพิ่ม Foreign Key สำหรับ parent_id หลังจากสร้างตารางเสร็จแล้ว
    ALTER TABLE categories 
    ADD CONSTRAINT categories_parent_id_fkey 
    FOREIGN KEY (parent_id) REFERENCES categories(id);
  END IF;
END $$;

-- ตรวจสอบและสร้างตาราง products ถ้ายังไม่มี
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'products') THEN
    CREATE TABLE products (
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
      category_id UUID,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  ELSE
    -- ถ้าตารางมีอยู่แล้ว ตรวจสอบคอลัมน์ที่จำเป็นและเพิ่มถ้าไม่มี
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category_id') THEN
      ALTER TABLE products ADD COLUMN category_id UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'point') THEN
      ALTER TABLE products ADD COLUMN point INTEGER DEFAULT 0;
    END IF;
  END IF;
  
  -- เพิ่ม Foreign Key สำหรับ category_id ถ้ายังไม่มี
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'products_category_id_fkey'
  ) THEN
    ALTER TABLE products
    ADD CONSTRAINT products_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES categories(id);
  END IF;
END $$;

-- ตรวจสอบและสร้างตาราง discounts ถ้ายังไม่มี
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'discounts') THEN
    CREATE TABLE discounts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      code TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL,
      value NUMERIC(10, 2) NOT NULL,
      minimum_order_amount NUMERIC(10, 2),
      product_id UUID,
      category_id UUID,
      start_date TIMESTAMP WITH TIME ZONE NOT NULL,
      end_date TIMESTAMP WITH TIME ZONE NOT NULL,
      usage_limit INTEGER,
      used_count INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- เพิ่ม constraint check สำหรับ type
    ALTER TABLE discounts
    ADD CONSTRAINT discounts_type_check
    CHECK (type IN ('percentage', 'fixed', 'free_shipping'));
    
    -- เพิ่ม Foreign Keys
    ALTER TABLE discounts
    ADD CONSTRAINT discounts_product_id_fkey
    FOREIGN KEY (product_id) REFERENCES products(id);
    
    ALTER TABLE discounts
    ADD CONSTRAINT discounts_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES categories(id);
  END IF;
END $$;

-- ตรวจสอบและสร้างตาราง orders ถ้ายังไม่มี
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'orders') THEN
    CREATE TABLE orders (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      customer_id UUID,
      order_number TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL,
      total_amount NUMERIC(10, 2) NOT NULL,
      shipping_amount NUMERIC(10, 2) DEFAULT 0,
      tax_amount NUMERIC(10, 2) DEFAULT 0,
      discount_amount NUMERIC(10, 2) DEFAULT 0,
      payment_image TEXT,
      payment_status TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      shipping_city TEXT NOT NULL,
      shipping_state TEXT NOT NULL,
      shipping_postal_code TEXT NOT NULL,
      shipping_country TEXT NOT NULL,
      notes TEXT,
      discount_id UUID,
      payment_image TEXT,
      tracking_number TEXT,
      shipping_method TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- เพิ่ม constraint check สำหรับ status
    ALTER TABLE orders
    ADD CONSTRAINT orders_status_check
    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'));
    
    -- เพิ่ม constraint check สำหรับ payment_status
    ALTER TABLE orders
    ADD CONSTRAINT orders_payment_status_check
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));
    
    -- เพิ่ม Foreign Keys
    ALTER TABLE orders
    ADD CONSTRAINT orders_customer_id_fkey
    FOREIGN KEY (customer_id) REFERENCES customers(id);
    
    ALTER TABLE orders
    ADD CONSTRAINT orders_discount_id_fkey
    FOREIGN KEY (discount_id) REFERENCES discounts(id);
  ELSE
    -- ถ้าตารางมีอยู่แล้ว ตรวจสอบคอลัมน์ที่จำเป็นและเพิ่มถ้าไม่มี
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_image') THEN
      ALTER TABLE orders ADD COLUMN payment_image TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tracking_number') THEN
      ALTER TABLE orders ADD COLUMN tracking_number TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_method') THEN
      ALTER TABLE orders ADD COLUMN shipping_method TEXT;
    END IF;
    
    -- เปลี่ยนจาก payment_method เป็น payment_image หากมีคอลัมน์ payment_method
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_method') THEN
      ALTER TABLE orders RENAME COLUMN payment_method TO payment_image;
    END IF;
  END IF;
END $$;

-- ตรวจสอบและสร้างตาราง order_items ถ้ายังไม่มี
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'order_items') THEN
    CREATE TABLE order_items (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      order_id UUID NOT NULL,
      product_id UUID NOT NULL,
      quantity INTEGER NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      discount NUMERIC(10, 2) DEFAULT 0,
      total NUMERIC(10, 2) NOT NULL,
      points INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- เพิ่ม Foreign Keys
    ALTER TABLE order_items
    ADD CONSTRAINT order_items_order_id_fkey
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
    
    ALTER TABLE order_items
    ADD CONSTRAINT order_items_product_id_fkey
    FOREIGN KEY (product_id) REFERENCES products(id);
  ELSE
    -- ถ้าตารางมีอยู่แล้ว ตรวจสอบคอลัมน์ที่จำเป็นและเพิ่มถ้าไม่มี
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'points') THEN
      ALTER TABLE order_items ADD COLUMN points INTEGER DEFAULT 0;
    END IF;
  END IF;
END $$;

-- ตรวจสอบและสร้างตาราง order_history ถ้ายังไม่มี
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'order_history') THEN
    CREATE TABLE order_history (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      order_id UUID NOT NULL,
      status TEXT NOT NULL,
      note TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- เพิ่ม Foreign Keys
    ALTER TABLE order_history
    ADD CONSTRAINT order_history_order_id_fkey
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ตรวจสอบและสร้างตาราง alerts ถ้ายังไม่มี
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'alerts') THEN
    CREATE TABLE alerts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      type TEXT NOT NULL CHECK (type IN ('warning', 'info', 'success')),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- ตรวจสอบและสร้างตาราง messages ถ้ายังไม่มี
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'messages') THEN
    CREATE TABLE messages (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      customer_id UUID NOT NULL,
      subject TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      reply TEXT,
      reply_date TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT messages_status_check CHECK (status IN ('new', 'read', 'replied')),
      CONSTRAINT messages_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );
  END IF;
END $$;
-- เพิ่มข้อมูลตัวอย่างในตาราง alerts
INSERT INTO alerts (type, title, description, icon, is_read, created_at, updated_at)
VALUES
  ('warning', 'สินค้าคงเหลือน้อย', 'มีสินค้า 5 รายการที่มีจำนวนคงเหลือน้อยและต้องเติมสต็อก', 'AlertTriangle', false, NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '5 minutes'),
  ('info', 'คำสั่งซื้อใหม่', 'มีคำสั่งซื้อใหม่ 8 รายการที่รอการประมวลผล', 'ShoppingCart', false, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
  ('success', 'รีวิวใหม่', 'มีรีวิวจากลูกค้าใหม่ 3 รายการที่รอการตรวจสอบ', 'Star', false, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours'),
  ('warning', 'การชำระเงินล้มเหลว', 'มีคำสั่งซื้อ 2 รายการที่มีการชำระเงินล้มเหลว', 'AlertTriangle', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  ('info', 'อัปเดตระบบ', 'ระบบจะมีการอัปเดตในวันพรุ่งนี้ เวลา 02:00 น.', 'AlertTriangle', true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- ล้างข้อมูลเก่าถ้ามีอยู่แล้ว (ใช้ความระมัดระวังหรือคอมเมนต์บรรทัดเหล่านี้ถ้าไม่ต้องการลบข้อมูลเดิม)
DELETE FROM order_history;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM customers;

-- เพิ่มข้อมูลตัวอย่างในตาราง customers
INSERT INTO customers (id, email, first_name, last_name, phone, address, city, state, postal_code, country, loyalty_points, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'emma.johnson@example.com', 'Emma', 'Johnson', '+1 234-567-8901', '123 Main St, Apt 4B', 'New York', 'NY', '10001', 'USA', 120, NOW(), NOW()),
  (uuid_generate_v4(), 'liam.smith@example.com', 'Liam', 'Smith', '+1 234-567-8902', '456 Maple Ave', 'Los Angeles', 'CA', '90001', 'USA', 75, NOW(), NOW()),
  (uuid_generate_v4(), 'olivia.brown@example.com', 'Olivia', 'Brown', '+1 234-567-8903', '789 Oak St', 'Chicago', 'IL', '60007', 'USA', 200, NOW(), NOW()),
  (uuid_generate_v4(), 'noah.davis@example.com', 'Noah', 'Davis', '+1 234-567-8904', '101 Pine Rd', 'Houston', 'TX', '77001', 'USA', 50, NOW(), NOW()),
  (uuid_generate_v4(), 'sophia.wilson@example.com', 'Sophia', 'Wilson', '+1 234-567-8905', '202 Cedar Ln', 'Miami', 'FL', '33101', 'USA', 150, NOW(), NOW());

-- เพิ่มข้อมูลตัวอย่างในตาราง categories
INSERT INTO categories (id, name, description, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'Skincare', 'Products for skin care and beauty', NOW(), NOW());

-- เพิ่มข้อมูลตัวอย่างในตาราง products
INSERT INTO products (id, name, code, price, stock, description, point, category_id, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'AuraClear Facial Cleanser', 'AURA-FC-001', 29.99, 100, 'Gentle facial cleanser for all skin types', 3, (SELECT id FROM categories WHERE name = 'Skincare'), NOW(), NOW()),
  (uuid_generate_v4(), 'AuraClear Hydrating Serum', 'AURA-HS-002', 49.99, 75, 'Hydrating serum for dry and normal skin', 5, (SELECT id FROM categories WHERE name = 'Skincare'), NOW(), NOW()),
  (uuid_generate_v4(), 'AuraClear Moisturizing Cream', 'AURA-MC-003', 39.99, 85, 'Rich moisturizing cream for dry skin', 4, (SELECT id FROM categories WHERE name = 'Skincare'), NOW(), NOW()),
  (uuid_generate_v4(), 'AuraClear Exfoliating Scrub', 'AURA-ES-004', 24.99, 60, 'Gentle exfoliating scrub for all skin types', 2, (SELECT id FROM categories WHERE name = 'Skincare'), NOW(), NOW()),
  (uuid_generate_v4(), 'AuraClear Eye Cream', 'AURA-EC-005', 34.99, 50, 'Nourishing eye cream for dark circles and puffiness', 3, (SELECT id FROM categories WHERE name = 'Skincare'), NOW(), NOW());

-- เพิ่มข้อมูลตัวอย่างในตาราง orders
INSERT INTO orders (
  id, customer_id, order_number, status, total_amount, shipping_amount, tax_amount, 
  discount_amount, payment_image, payment_status, shipping_address, 
  shipping_city, shipping_state, shipping_postal_code, shipping_country, 
  notes, tracking_number, shipping_method, created_at, updated_at
)
VALUES
  (
    uuid_generate_v4(),
    (SELECT id FROM customers WHERE email = 'emma.johnson@example.com'),
    'ORD-9385', 'pending', 149.97, 10.00, 10.00, 0.00, '/payment.jpg', 'pending',
    '123 Main St, Apt 4B', 'New York', 'NY', '10001', 'USA',
    'Please leave the package at the door', NULL, 'Standard Shipping', 
    NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
  ),
  (
    uuid_generate_v4(),
    (SELECT id FROM customers WHERE email = 'liam.smith@example.com'),
    'ORD-9384', 'processing', 79.99, 10.00, 5.00, 0.00, '/payment.jpg', 'paid',
    '456 Maple Ave', 'Los Angeles', 'CA', '90001', 'USA',
    NULL, NULL, 'Express Shipping', 
    NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
  ),
  (
    uuid_generate_v4(),
    (SELECT id FROM customers WHERE email = 'olivia.brown@example.com'),
    'ORD-9383', 'shipped', 224.95, 0.00, 15.00, 10.00, '/payment.jpg', 'paid',
    '789 Oak St', 'Chicago', 'IL', '60007', 'USA',
    NULL, 'TRK12345678', 'Express Shipping', 
    NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'
  ),
  (
    uuid_generate_v4(),
    (SELECT id FROM customers WHERE email = 'noah.davis@example.com'),
    'ORD-9382', 'delivered', 39.99, 10.00, 3.00, 0.00, '/payment.jpg', 'paid',
    '101 Pine Rd', 'Houston', 'TX', '77001', 'USA',
    'Call before delivery', 'TRK87654321', 'Standard Shipping', 
    NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'
  ),
  (
    uuid_generate_v4(),
    (SELECT id FROM customers WHERE email = 'sophia.wilson@example.com'),
    'ORD-9381', 'cancelled', 129.98, 10.00, 8.00, 0.00, '/payment.jpg', 'refunded',
    '202 Cedar Ln', 'Miami', 'FL', '33101', 'USA',
    'Customer requested cancellation', NULL, 'Standard Shipping', 
    NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'
  );

-- เพิ่มข้อมูลตัวอย่างในตาราง order_items
INSERT INTO order_items (order_id, product_id, quantity, price, discount, total, points, created_at)
VALUES
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9385'),
    (SELECT id FROM products WHERE code = 'AURA-FC-001'),
    1, 29.99, 0.00, 29.99, 3, NOW() - INTERVAL '1 day'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9385'),
    (SELECT id FROM products WHERE code = 'AURA-HS-002'),
    2, 49.99, 0.00, 99.98, 10, NOW() - INTERVAL '1 day'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9384'),
    (SELECT id FROM products WHERE code = 'AURA-MC-003'),
    2, 39.99, 0.00, 79.98, 8, NOW() - INTERVAL '2 days'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9383'),
    (SELECT id FROM products WHERE code = 'AURA-HS-002'),
    3, 49.99, 0.00, 149.97, 15, NOW() - INTERVAL '5 days'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9383'),
    (SELECT id FROM products WHERE code = 'AURA-ES-004'),
    3, 24.99, 0.00, 74.97, 6, NOW() - INTERVAL '5 days'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9382'),
    (SELECT id FROM products WHERE code = 'AURA-FC-001'),
    1, 29.99, 0.00, 29.99, 3, NOW() - INTERVAL '10 days'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9381'),
    (SELECT id FROM products WHERE code = 'AURA-EC-005'),
    2, 34.99, 0.00, 69.98, 6, NOW() - INTERVAL '7 days'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9381'),
    (SELECT id FROM products WHERE code = 'AURA-ES-004'),
    1, 24.99, 0.00, 24.99, 2, NOW() - INTERVAL '7 days'
  );

-- เพิ่มข้อมูลประวัติการอัปเดตสถานะ
INSERT INTO order_history (order_id, status, note, created_at)
VALUES
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9385'),
    'pending', 'Order placed', NOW() - INTERVAL '1 day'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9384'),
    'pending', 'Order placed', NOW() - INTERVAL '2 days 2 hours'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9384'),
    'processing', 'Payment confirmed', NOW() - INTERVAL '2 days'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9383'),
    'pending', 'Order placed', NOW() - INTERVAL '5 days 4 hours'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9383'),
    'processing', 'Payment confirmed', NOW() - INTERVAL '5 days 2 hours'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9383'),
    'shipped', 'Package sent with tracking number TRK12345678', NOW() - INTERVAL '5 days'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9382'),
    'pending', 'Order placed', NOW() - INTERVAL '10 days 8 hours'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9382'),
    'processing', 'Payment confirmed', NOW() - INTERVAL '10 days 6 hours'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9382'),
    'shipped', 'Package sent with tracking number TRK87654321', NOW() - INTERVAL '10 days 2 hours'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9382'),
    'delivered', 'Package delivered', NOW() - INTERVAL '10 days'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9381'),
    'pending', 'Order placed', NOW() - INTERVAL '7 days 4 hours'
  ),
  (
    (SELECT id FROM orders WHERE order_number = 'ORD-9381'),
    'cancelled', 'Customer requested cancellation', NOW() - INTERVAL '7 days'
  );

-- เพิ่มข้อมูลตัวอย่างในตาราง customers เพิ่มเติม
INSERT INTO customers (id, email, first_name, last_name, phone, address, city, state, postal_code, country, loyalty_points, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'james.wilson@example.com', 'James', 'Wilson', '+1 234-567-8906', '303 Elm St', 'Seattle', 'WA', '98101', 'USA', 180, NOW(), NOW()),
  (uuid_generate_v4(), 'ava.martinez@example.com', 'Ava', 'Martinez', '+1 234-567-8907', '404 Birch Rd', 'Phoenix', 'AZ', '85001', 'USA', 90, NOW(), NOW()),
  (uuid_generate_v4(), 'william.taylor@example.com', 'William', 'Taylor', '+1 234-567-8908', '505 Walnut Ave', 'Denver', 'CO', '80201', 'USA', 220, NOW(), NOW()),
  (uuid_generate_v4(), 'isabella.thomas@example.com', 'Isabella', 'Thomas', '+1 234-567-8909', '606 Cherry Ln', 'Boston', 'MA', '02101', 'USA', 160, NOW(), NOW()),
  (uuid_generate_v4(), 'mason.anderson@example.com', 'Mason', 'Anderson', '+1 234-567-8910', '707 Spruce St', 'Portland', 'OR', '97201', 'USA', 130, NOW(), NOW()),
  (uuid_generate_v4(), 'charlotte.lee@example.com', 'Charlotte', 'Lee', '+1 234-567-8911', '808 Maple Dr', 'San Diego', 'CA', '92101', 'USA', 170, NOW(), NOW()),
  (uuid_generate_v4(), 'ethan.garcia@example.com', 'Ethan', 'Garcia', '+1 234-567-8912', '909 Oak Ct', 'Austin', 'TX', '73301', 'USA', 140, NOW(), NOW()),
  (uuid_generate_v4(), 'amelia.rodriguez@example.com', 'Amelia', 'Rodriguez', '+1 234-567-8913', '1010 Pine St', 'Nashville', 'TN', '37201', 'USA', 110, NOW(), NOW()),
  (uuid_generate_v4(), 'alexander.lopez@example.com', 'Alexander', 'Lopez', '+1 234-567-8914', '1111 Cedar Ave', 'Atlanta', 'GA', '30301', 'USA', 200, NOW(), NOW()),
  (uuid_generate_v4(), 'mia.gonzalez@example.com', 'Mia', 'Gonzalez', '+1 234-567-8915', '1212 Birch St', 'Las Vegas', 'NV', '89101', 'USA', 190, NOW(), NOW());

-- เพิ่มข้อมูลตัวอย่างในตาราง orders เพิ่มเติม
INSERT INTO orders (
  id, customer_id, order_number, status, total_amount, shipping_amount, tax_amount, 
  discount_amount, payment_image, payment_status, shipping_address, 
  shipping_city, shipping_state, shipping_postal_code, shipping_country, 
  notes, tracking_number, shipping_method, created_at, updated_at
)
SELECT
  uuid_generate_v4(),
  c.id,
  'ORD-' || (9380 - (ROW_NUMBER() OVER (ORDER BY c.id))),
  CASE floor(random() * 5)
    WHEN 0 THEN 'pending'
    WHEN 1 THEN 'processing'
    WHEN 2 THEN 'shipped'
    WHEN 3 THEN 'delivered'
    ELSE 'completed'
  END,
  (random() * 2000 + 100)::numeric(10,2), -- สุ่มยอดสั่งซื้อระหว่าง 100-2100 บาท
  10.00,
  ((random() * 2000 + 100)::numeric(10,2) * 0.07)::numeric(10,2),
  0.00,
  '/payment.jpg',
  'paid',
  c.address,
  c.city,
  c.state,
  c.postal_code,
  c.country,
  NULL,
  CASE WHEN random() > 0.5 THEN 'TRK' || floor(random() * 100000000)::text ELSE NULL END,
  CASE WHEN random() > 0.5 THEN 'Express Shipping' ELSE 'Standard Shipping' END,
  NOW() - (interval '1 day' * floor(random() * 30)),
  NOW() - (interval '1 day' * floor(random() * 30))
FROM customers c
CROSS JOIN generate_series(1, 3) -- สร้าง 3 ออเดอร์ต่อลูกค้า
ORDER BY random()
LIMIT 30;

-- อัพเดทสถานะ VIP สำหรับลูกค้าที่มียอดสั่งซื้อรวมมากกว่า 1,000 บาท
UPDATE customers c
SET is_vip = true
WHERE EXISTS (
  SELECT 1
  FROM (
    SELECT customer_id, SUM(total_amount) as total_spent
    FROM orders
    GROUP BY customer_id
    HAVING SUM(total_amount) > 1000
  ) high_value_customers
  WHERE high_value_customers.customer_id = c.id
);

-- เพิ่มข้อมูล order_items สำหรับออเดอร์ใหม่
INSERT INTO order_items (order_id, product_id, quantity, price, discount, total, points, created_at)
SELECT 
  o.id,
  p.id,
  floor(random() * 3 + 1)::integer as quantity,
  p.price,
  0.00,
  (floor(random() * 3 + 1)::integer * p.price)::numeric(10,2) as total,
  (floor(random() * 3 + 1)::integer * p.point)::integer as points,
  o.created_at
FROM orders o
CROSS JOIN products p
WHERE o.order_number < 'ORD-9380'
ORDER BY random()
LIMIT 60;

-- เพิ่มประวัติการอัพเดทสถานะสำหรับออเดอร์ใหม่
INSERT INTO order_history (order_id, status, note, created_at)
SELECT
  o.id,
  o.status,
  CASE o.status
    WHEN 'pending' THEN 'Order placed'
    WHEN 'processing' THEN 'Payment confirmed'
    WHEN 'shipped' THEN 'Package sent'
    WHEN 'delivered' THEN 'Package delivered'
    ELSE 'Order completed'
  END,
  o.created_at
FROM orders o
WHERE o.order_number < 'ORD-9380';

-- อัพเดทข้อมูล total_orders และ total_spent ในตาราง customers
UPDATE customers c
SET 
  total_orders = (
    SELECT COUNT(*)
    FROM orders o
    WHERE o.customer_id = c.id
    AND o.payment_status = 'paid'
  ),
  total_spent = (
    SELECT COALESCE(SUM(total_amount), 0)
    FROM orders o
    WHERE o.customer_id = c.id
    AND o.payment_status = 'paid'
  )
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.id
);

-- แสดงข้อมูลที่เพิ่มแล้ว
SELECT 'customers' as table_name, COUNT(*) as row_count FROM customers
UNION ALL
SELECT 'categories' as table_name, COUNT(*) as row_count FROM categories
UNION ALL
SELECT 'products' as table_name, COUNT(*) as row_count FROM products
UNION ALL
SELECT 'orders' as table_name, COUNT(*) as row_count FROM orders
UNION ALL
SELECT 'order_items' as table_name, COUNT(*) as row_count FROM order_items
UNION ALL
SELECT 'order_history' as table_name, COUNT(*) as row_count FROM order_history
UNION ALL
SELECT 'alerts' as table_name, COUNT(*) as row_count FROM alerts;