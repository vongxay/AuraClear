import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, UserPlus, Settings, History, Heart, Award } from 'lucide-react';

export default function AccountPage() {
  return (
    <Container className="py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">บัญชีผู้ใช้</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-pink-500" />
                <span>เข้าสู่ระบบ</span>
              </CardTitle>
              <CardDescription>สำหรับผู้ใช้ที่มีบัญชีอยู่แล้ว</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">เข้าสู่ระบบเพื่อจัดการบัญชี ติดตามคำสั่งซื้อ และรับสิทธิพิเศษ</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-pink-500 hover:bg-pink-600">
                <Link href="/account/login">เข้าสู่ระบบ</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-pink-500" />
                <span>สมัครสมาชิก</span>
              </CardTitle>
              <CardDescription>สำหรับผู้ใช้ใหม่</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">สร้างบัญชีเพื่อสั่งซื้อสินค้า บันทึกรายการโปรด และสะสมคะแนน</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full border-pink-500 text-pink-500 hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950">
                <Link href="/account/register">สมัครสมาชิก</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">สิทธิประโยชน์ของสมาชิก</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <History className="h-10 w-10 text-pink-500 mb-2" />
                <h3 className="text-lg font-medium mb-1">ประวัติการสั่งซื้อ</h3>
                <p className="text-sm text-muted-foreground">ติดตามและดูประวัติการสั่งซื้อทั้งหมดของคุณ</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <Award className="h-10 w-10 text-pink-500 mb-2" />
                <h3 className="text-lg font-medium mb-1">คะแนนสะสม</h3>
                <p className="text-sm text-muted-foreground">รับและใช้คะแนนสะสมเพื่อรับส่วนลดพิเศษ</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <Heart className="h-10 w-10 text-pink-500 mb-2" />
                <h3 className="text-lg font-medium mb-1">รายการโปรด</h3>
                <p className="text-sm text-muted-foreground">บันทึกสินค้าที่คุณชื่นชอบเพื่อซื้อในภายหลัง</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
} 