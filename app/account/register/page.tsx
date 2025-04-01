"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { register, isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/account/profile');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      const success = await register({
        firstName,
        lastName,
        email,
        password
      });
      
      if (success) {
        setSuccess(true);
        // รอสักครู่แล้วนำทางไปหน้าเข้าสู่ระบบ
        setTimeout(() => {
          router.push('/account/login');
        }, 3000);
      } else {
        setError('ไม่สามารถลงทะเบียนได้ โปรดตรวจสอบข้อมูลของคุณและลองอีกครั้ง');
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองอีกครั้ง');
      console.error('Registration error:', err);
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
            <CardTitle className="text-2xl font-bold">สมัครสมาชิก</CardTitle>
            <CardDescription>
              สร้างบัญชีใหม่เพื่อใช้งานเว็บไซต์ของเรา
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="p-4 rounded-md bg-green-50 text-green-700 flex items-start gap-3 dark:bg-green-950 dark:text-green-300">
                <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">ลงทะเบียนสำเร็จ!</p>
                  <p className="text-sm mt-1">กรุณาเข้าสู่ระบบเพื่อใช้งานบัญชีของคุณ</p>
                  <p className="text-sm mt-3">กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">ชื่อ</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="ชื่อของคุณ"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">นามสกุล</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="นามสกุลของคุณ"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
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
                        minLength={6}
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="ยืนยันรหัสผ่านของคุณ"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="p-3 rounded-md bg-red-50 text-red-500 flex items-start gap-2 text-sm dark:bg-red-950 dark:text-red-300">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-pink-500 hover:bg-pink-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'กำลังลงทะเบียน...' : 'สมัครสมาชิก'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full">
              มีบัญชีอยู่แล้ว?{' '}
              <Link href="/account/login" className="text-pink-500 hover:text-pink-600 font-medium">
                เข้าสู่ระบบ
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
} 