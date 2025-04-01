-- ตรวจสอบและสร้างตาราง wishlists ถ้ายังไม่มี
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'wishlists') THEN
    CREATE TABLE wishlists (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      items JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT wishlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
    );
    
    -- สร้าง index สำหรับค้นหาด้วย user_id
    CREATE INDEX wishlists_user_id_idx ON wishlists(user_id);
    
    -- ทำให้แต่ละ user_id มีเพียงรายการโปรดเดียวเท่านั้น
    CREATE UNIQUE INDEX wishlists_user_id_unique_idx ON wishlists(user_id);
  END IF;
END $$; 