-- ตรวจสอบและสร้างตาราง wishlists ถ้ายังไม่มี
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'wishlists') THEN
    CREATE TABLE wishlists (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      customer_id UUID NOT NULL,
      product_id UUID NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT wishlists_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
      CONSTRAINT wishlists_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
    
    -- สร้าง index สำหรับค้นหาด้วย customer_id
    CREATE INDEX wishlists_customer_id_idx ON wishlists(customer_id);
    
    -- ทำให้แต่ละคู่ customer_id และ product_id มีเพียงรายการเดียวเท่านั้น
    CREATE UNIQUE INDEX wishlists_customer_product_unique_idx ON wishlists(customer_id, product_id);
  END IF;
END $$; 