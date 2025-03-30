"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ในอนาคตตรงนี้จะเป็นการเรียกใช้ API สำหรับการส่งอีเมลรีเซ็ตรหัสผ่าน
      console.log('Reset password for:', email);
      
      // จำลองการดีเลย์ของการส่งข้อมูลไปยังเซิร์ฟเวอร์
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการส่งอีเมล โปรดลองอีกครั้ง');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container className="py-20">
        <div className="max-w-md mx-auto">
          <Link href="/account/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
          
          <Card className="shadow-md">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">ส่งอีเมลแล้ว!</h2>
              <p className="text-muted-foreground mb-6">
                เราได้ส่งอีเมลพร้อมคำแนะนำในการรีเซ็ตรหัสผ่านไปยังอีเมล {email} แล้ว กรุณาตรวจสอบอีเมลของคุณ
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                หากคุณไม่ได้รับอีเมล โปรดตรวจสอบโฟลเดอร์สแปมหรือขยะ
              </p>
              <Button 
                onClick={() => setSuccess(false)}
                variant="outline"
              >
                ลองอีเมลอื่น
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-20">
      <div className="max-w-md mx-auto">
        <Link href="/account/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">ลืมรหัสผ่าน?</CardTitle>
            <CardDescription>
              กรอกอีเมลของคุณเพื่อรีเซ็ตรหัสผ่าน
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      placeholder="กรอกอีเมลที่ใช้ลงทะเบียน"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
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
                  disabled={loading}
                >
                  {loading ? 'กำลังส่งอีเมล...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full">
              จำรหัสผ่านได้แล้ว?{' '}
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