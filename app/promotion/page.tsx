"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, Gift, Tag, Percent, Calendar } from 'lucide-react';

export default function PromotionPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">โปรโมชั่นพิเศษ</h1>
          <p className="text-muted-foreground">
            รับส่วนลดและข้อเสนอพิเศษสำหรับผลิตภัณฑ์ความงามของคุณ
          </p>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="current">โปรโมชั่นปัจจุบัน</TabsTrigger>
            <TabsTrigger value="upcoming">โปรโมชั่นที่กำลังจะมา</TabsTrigger>
            <TabsTrigger value="ended">โปรโมชั่นที่สิ้นสุดแล้ว</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* โปรโมชั่นที่ 1 */}
              <Card className="overflow-hidden" id="summer-sale">
                <div className="relative h-48 w-full">
                  <Image 
                    src="/images/promotions/summer-sale.jpg" 
                    alt="ซัมเมอร์เซลล์" 
                    fill 
                    style={{objectFit: 'cover'}}
                    className="transition-transform hover:scale-105"
                  />
                  <Badge className="absolute top-3 right-3 bg-pink-500">ลดสูงสุด 40%</Badge>
                </div>
                <CardHeader>
                  <CardTitle>Summer Beauty Sale</CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    1 เม.ย. - 30 เม.ย. 2024
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>รับส่วนลดพิเศษสำหรับผลิตภัณฑ์ทำความสะอาดผิวและครีมกันแดดในช่วงซัมเมอร์นี้</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">ช้อปเลย</Button>
                </CardFooter>
              </Card>

              {/* โปรโมชั่นที่ 2 */}
              <Card className="overflow-hidden" id="skincare-bundle">
                <div className="relative h-48 w-full">
                  <Image 
                    src="/images/promotions/skincare-bundle.jpg" 
                    alt="ชุดบำรุงผิว" 
                    fill 
                    style={{objectFit: 'cover'}}
                    className="transition-transform hover:scale-105"
                  />
                  <Badge className="absolute top-3 right-3 bg-pink-500">ซื้อ 2 แถม 1</Badge>
                </div>
                <CardHeader>
                  <CardTitle>ชุดสกินแคร์สุดคุ้ม</CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    15 เม.ย. - 15 พ.ค. 2024
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>ซื้อผลิตภัณฑ์ในกลุ่มสกินแคร์ 2 ชิ้น รับฟรีมาสก์หน้าพรีเมียม 1 ชิ้น</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">ช้อปเลย</Button>
                </CardFooter>
              </Card>

              {/* โปรโมชั่นที่ 3 */}
              <Card className="overflow-hidden" id="free-shipping">
                <div className="relative h-48 w-full">
                  <Image 
                    src="/images/promotions/free-shipping.jpg" 
                    alt="ส่งฟรี" 
                    fill 
                    style={{objectFit: 'cover'}}
                    className="transition-transform hover:scale-105"
                  />
                  <Badge className="absolute top-3 right-3 bg-green-500">ส่งฟรี</Badge>
                </div>
                <CardHeader>
                  <CardTitle>ส่งฟรีทั่วประเทศ</CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    1 เม.ย. - 31 พ.ค. 2024
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>สั่งซื้อครบ 1,000 บาทขึ้นไป รับสิทธิ์ส่งฟรีทั่วประเทศ ไม่มีขั้นต่ำ</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">ช้อปเลย</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* โปรโมชั่นที่กำลังจะมา */}
              <Card className="overflow-hidden">
                <div className="relative h-48 w-full bg-muted">
                  <Image 
                    src="/images/promotions/coming-soon.jpg" 
                    alt="เร็วๆ นี้" 
                    fill 
                    style={{objectFit: 'cover'}}
                    className="transition-transform hover:scale-105 opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Badge className="bg-blue-500 text-lg py-2">เร็วๆ นี้</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>เทศกาลลดราคากลางปี</CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    1 มิ.ย. - 30 มิ.ย. 2024
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>เตรียมพบกับมหกรรมลดราคากลางปี สินค้าลดสูงสุด 50%</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">รับการแจ้งเตือน</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="ended" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-70">
              {/* โปรโมชั่นที่สิ้นสุดแล้ว */}
              <Card className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image 
                    src="/images/promotions/past-promotion.jpg" 
                    alt="โปรโมชั่นที่ผ่านมา" 
                    fill 
                    style={{objectFit: 'cover'}}
                    className="grayscale"
                  />
                  <Badge className="absolute top-3 right-3 bg-gray-500">สิ้นสุดแล้ว</Badge>
                </div>
                <CardHeader>
                  <CardTitle>Flash Sale มีนาคม</CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    15 มี.ค. - 20 มี.ค. 2024
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>แฟลชเซลล์ 5 วันเท่านั้น! ลดราคาสูงสุด 30% สำหรับผลิตภัณฑ์ยอดนิยม</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" disabled className="w-full">สิ้นสุดแล้ว</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 py-8 border-t border-border">
          <h2 className="text-2xl font-bold mb-6 text-center">สิทธิประโยชน์สำหรับสมาชิก</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center mb-4">
                  <Tag className="h-6 w-6 text-pink-500" />
                </div>
                <CardTitle>ส่วนลดพิเศษ</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>รับส่วนลด 10% สำหรับสมาชิกใหม่และการสั่งซื้อครั้งแรก</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center mb-4">
                  <Gift className="h-6 w-6 text-pink-500" />
                </div>
                <CardTitle>ของขวัญฟรี</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>รับของขวัญพิเศษในวันเกิดของคุณ</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center mb-4">
                  <Percent className="h-6 w-6 text-pink-500" />
                </div>
                <CardTitle>โปรโมชั่นเฉพาะสมาชิก</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>เข้าถึงโปรโมชั่นพิเศษเฉพาะสมาชิกก่อนใคร</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-pink-500" />
                </div>
                <CardTitle>อัพเดทล่าสุด</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>รับข่าวสารและการแจ้งเตือนเกี่ยวกับโปรโมชั่นใหม่ก่อนใคร</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">ไม่อยากพลาดโปรโมชั่นพิเศษ?</h2>
          <p className="text-muted-foreground mb-6">สมัครสมาชิกวันนี้เพื่อรับสิทธิประโยชน์และโปรโมชั่นพิเศษมากมาย</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/account/register">สมัครสมาชิก</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/account/login">เข้าสู่ระบบ</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 