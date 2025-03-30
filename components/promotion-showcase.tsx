"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

type Promotion = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  badgeText?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  endDate: string;
  link: string;
};

const promotions: Promotion[] = [
  {
    id: 'summer-sale',
    title: 'Summer Beauty Sale',
    description: 'รับส่วนลดพิเศษสำหรับผลิตภัณฑ์ทำความสะอาดผิวและครีมกันแดดในช่วงซัมเมอร์นี้',
    imageSrc: '/images/promotions/summer-sale.jpg',
    badgeText: 'ลดสูงสุด 40%',
    badgeVariant: 'default',
    endDate: '30 เม.ย. 2024',
    link: '/promotion#summer-sale',
  },
  {
    id: 'skincare-bundle',
    title: 'ชุดสกินแคร์สุดคุ้ม',
    description: 'ซื้อผลิตภัณฑ์ในกลุ่มสกินแคร์ 2 ชิ้น รับฟรีมาสก์หน้าพรีเมียม 1 ชิ้น',
    imageSrc: '/images/promotions/skincare-bundle.jpg',
    badgeText: 'ซื้อ 2 แถม 1',
    badgeVariant: 'info',
    endDate: '15 พ.ค. 2024',
    link: '/promotion#skincare-bundle',
  },
  {
    id: 'free-shipping',
    title: 'ส่งฟรีทั่วประเทศ',
    description: 'สั่งซื้อครบ 1,000 บาทขึ้นไป รับสิทธิ์ส่งฟรีทั่วประเทศ ไม่มีขั้นต่ำ',
    imageSrc: '/images/promotions/free-shipping.jpg',
    badgeText: 'ส่งฟรี',
    badgeVariant: 'success',
    endDate: '31 พ.ค. 2024',
    link: '/promotion#free-shipping',
  },
];

export default function PromotionShowcase() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promotion) => (
          <Link href={promotion.link} key={promotion.id} className="group">
            <Card className="overflow-hidden h-full border-transparent transition-all duration-300 hover:border-pink-200 hover:shadow-md">
              <div className="relative h-48 w-full">
                <Image
                  src={promotion.imageSrc}
                  alt={promotion.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {promotion.badgeText && (
                  <Badge 
                    className="absolute top-3 right-3" 
                    variant={promotion.badgeVariant || 'default'}
                  >
                    {promotion.badgeText}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{promotion.title}</h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{promotion.description}</p>
                <p className="text-xs text-muted-foreground">วันหมดโปรโมชั่น: {promotion.endDate}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  ดูรายละเอียด
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 