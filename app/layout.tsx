import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-context';
import { WishlistProvider } from '@/context/wishlist-context';
import { AuthProvider } from '@/context/auth-context';
import { checkSupabaseConnection } from '@/lib/supabase';
import { useEffect } from 'react';

// Optimize font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'AuraClear | Premium Cosmetics',
  description: 'ค้นพบเครื่องสำอางและผลิตภัณฑ์ดูแลผิวระดับพรีเมียมที่ AuraClear',
};

// ตรวจสอบการเชื่อมต่อกับ Supabase ในช่วงการสร้างแอพ
if (process.env.NODE_ENV !== 'production') {
  checkSupabaseConnection()
    .then(isConnected => {
      if (isConnected) {
        console.log('✅ เชื่อมต่อกับ Supabase สำเร็จ!');
      } else {
        console.warn('⚠️ ไม่สามารถเชื่อมต่อกับ Supabase ได้ โปรดตรวจสอบการตั้งค่าใน .env.local');
      }
    })
    .catch(error => {
      console.error('❌ เกิดข้อผิดพลาดในการตรวจสอบการเชื่อมต่อกับ Supabase:', error);
    });
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </div>
                <Toaster />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}