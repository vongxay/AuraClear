"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/account/profile');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(email, password);
      
      if (success) {
        router.push('/account/profile');
      } else {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ โปรดลองอีกครั้ง');
      console.error('Login error:', err);
    }
  };

  if (isLoggedIn) {
    return null; // หรือแสดงข้อความกำลังนำทางไปหน้าโปรไฟล์
  }

  return (
    <Container className="py-20">
      <div className="max-w-md mx-auto">
        <Link href="/account" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปหน้าบัญชีผู้ใช้
        </Link>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">เข้าสู่ระบบ</CardTitle>
            <CardDescription>
              เข้าสู่ระบบเพื่อจัดการบัญชีและสั่งซื้อสินค้า
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="อีเมลของคุณ"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="รหัสผ่านของคุณ"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <div className="text-sm text-right">
                    <Link href="/account/forgot-password" className="text-pink-500 hover:text-pink-600">
                      ลืมรหัสผ่าน?
                    </Link>
                  </div>
                </div>
                
                {error && (
                  <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm dark:bg-red-950 dark:text-red-300">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-pink-500 hover:bg-pink-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full">
              ยังไม่มีบัญชี?{' '}
              <Link href="/account/register" className="text-pink-500 hover:text-pink-600 font-medium">
                สมัครสมาชิก
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
} 