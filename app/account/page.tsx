"use client";

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import { useAuth } from '@/context/auth-context';

// ลดขนาด bundle ด้วย dynamic imports สำหรับไอคอน
const History = dynamic(() => import('lucide-react').then(mod => mod.History));
const Heart = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const Award = dynamic(() => import('lucide-react').then(mod => mod.Award));
const User = dynamic(() => import('lucide-react').then(mod => mod.User));
const UserPlus = dynamic(() => import('lucide-react').then(mod => mod.UserPlus));

// กำหนด interface สำหรับ props ของ BenefitCard
interface BenefitCardProps {
  icon: ComponentType<any>;
  title: string;
  description: string;
}

// แยกส่วนประกอบบัตรสิทธิประโยชน์เป็น component แยกและใช้ React.memo เพื่อป้องกันการ render ที่ไม่จำเป็น
const BenefitCard = React.memo(({ icon: Icon, title, description }: BenefitCardProps) => (
  <Card className="shadow-sm">
    <CardContent className="pt-6">
      <Icon className="h-10 w-10 text-pink-500 mb-2" />
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
));
BenefitCard.displayName = 'BenefitCard';

export default function AccountPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  // ใช้ useMemo สำหรับข้อมูลสิทธิประโยชน์เพื่อให้ไม่ต้องสร้างใหม่ทุกครั้งที่ render
  const benefits = useMemo(() => [
    {
      icon: History,
      title: "ประวัติการสั่งซื้อ",
      description: "ติดตามและดูประวัติการสั่งซื้อทั้งหมดของคุณ"
    },
    {
      icon: Award,
      title: "คะแนนสะสม",
      description: "รับและใช้คะแนนสะสมเพื่อรับส่วนลดพิเศษ"
    },
    {
      icon: Heart,
      title: "รายการโปรด",
      description: "บันทึกสินค้าที่คุณชื่นชอบเพื่อซื้อในภายหลัง"
    }
  ], []);

  // Prefetch the profile page
  useEffect(() => {
    router.prefetch('/account/profile');
    router.prefetch('/account/login');
    router.prefetch('/account/register');
  }, [router]);

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace('/account/profile');
    }
  }, [isLoggedIn, isLoading, router]);

  // ป้องกันการแสดงเนื้อหาเมื่อกำลังตรวจสอบสถานะการล็อกอินหรือกำลังจะ redirect
  if (isLoading || isLoggedIn) {
    return (
      <Container className="py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p>กำลังโหลด...</p>
        </div>
      </Container>
    );
  }

  // แสดงเฉพาะเมื่อไม่ได้ล็อกอินเท่านั้น
  return (
    <Container className="py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">บัญชีผู้ใช้</h1>
        
        <div className="text-center mb-10">
          <p className="text-lg mb-6">เข้าสู่ระบบหรือสมัครสมาชิกเพื่อใช้งานทุกฟีเจอร์และรับสิทธิประโยชน์พิเศษมากมาย</p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <Button asChild className="bg-pink-500 hover:bg-pink-600 px-8 py-6 text-lg">
              <Link href="/account/login">
                <User className="h-5 w-5 mr-2 inline-block" />
                เข้าสู่ระบบ
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950 px-8 py-6 text-lg">
              <Link href="/account/register">
                <UserPlus className="h-5 w-5 mr-2 inline-block" />
                สมัครสมาชิก
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">สิทธิประโยชน์ของสมาชิก</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <BenefitCard 
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
} 