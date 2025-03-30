"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, Settings, Package, CreditCard, LogOut, ShoppingBag, 
  Heart, Award, Bell, MapPin, Home, Phone, Mail, Edit, Plus,
  Check, Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '@/context/auth-context';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout, updateUser } = useAuth();

  // ประวัติการสั่งซื้อจำลอง
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2023-001',
      date: '12 มีนาคม 2024',
      total: 1250,
      status: 'delivered',
      items: 3,
    },
    {
      id: 'ORD-2023-002',
      date: '25 กุมภาพันธ์ 2024',
      total: 890,
      status: 'delivered',
      items: 2,
    },
    {
      id: 'ORD-2023-003',
      date: '10 มกราคม 2024',
      total: 2450,
      status: 'delivered',
      items: 5,
    },
  ]);

  // ที่อยู่จำลอง
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-001',
      name: 'ที่บ้าน',
      recipient: user?.firstName + ' ' + user?.lastName || 'ผู้ใช้งาน',
      address: '123/456 หมู่บ้านศุภาลัย ถนนพหลโยธิน',
      district: 'จตุจักร',
      province: 'กรุงเทพมหานคร',
      postalCode: '10900',
      phone: user?.phone || '081-234-5678',
      isDefault: true,
    },
    {
      id: 'addr-002',
      name: 'ที่ทำงาน',
      recipient: user?.firstName + ' ' + user?.lastName || 'ผู้ใช้งาน',
      address: '98 อาคารสาทร สแควร์ ชั้น 10 ถนนสาทรเหนือ',
      district: 'สีลม',
      province: 'กรุงเทพมหานคร',
      postalCode: '10500',
      phone: user?.phone || '081-234-5678',
      isDefault: false,
    }
  ]);

  // การตั้งค่าการแจ้งเตือน
  const [notifications, setNotifications] = useState({
    promotions: true,
    orderUpdates: true,
    newProducts: false,
    newsletter: true,
  });

  // ตรวจสอบสถานะการล็อกอิน
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/account');
    }
  }, [isLoading, user, router]);

  // ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    logout();
  };

  // ฟังก์ชันอัพเดตการตั้งค่าแจ้งเตือน
  const updateNotification = (type: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [type]: value
    }));
  };

  if (isLoading || !user) {
    return (
      <Container className="py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">กำลังโหลดข้อมูลผู้ใช้...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <div className="w-full md:w-auto">
            <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="text-2xl bg-pink-100 text-pink-500 dark:bg-pink-900">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-1">{user.firstName} {user.lastName}</h1>
                <p className="text-muted-foreground mb-2">สมาชิกตั้งแต่: {user.memberSince}</p>
                <div className="flex items-center gap-1">
                  <Award className="h-5 w-5 text-pink-500" />
                  <span className="font-medium">{user.points} คะแนน</span>
                </div>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">ข้อมูลส่วนตัว</span>
              <span className="sm:hidden">ข้อมูล</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">ประวัติการสั่งซื้อ</span>
              <span className="sm:hidden">สั่งซื้อ</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">ที่อยู่จัดส่ง</span>
              <span className="sm:hidden">ที่อยู่</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">การตั้งค่า</span>
              <span className="sm:hidden">ตั้งค่า</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>ข้อมูลส่วนตัว</span>
                  <Button variant="outline" size="sm" className="gap-1 h-8">
                    <Edit className="h-3.5 w-3.5" />
                    แก้ไข
                  </Button>
                </CardTitle>
                <CardDescription>ข้อมูลส่วนตัวและการติดต่อของคุณ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>ชื่อ</Label>
                    <div className="mt-1 text-sm font-medium">{user.firstName}</div>
                  </div>
                  <div>
                    <Label>นามสกุล</Label>
                    <div className="mt-1 text-sm font-medium">{user.lastName}</div>
                  </div>
                  <div>
                    <Label className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      อีเมล
                    </Label>
                    <div className="mt-1 text-sm font-medium">{user.email}</div>
                  </div>
                  <div>
                    <Label className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      เบอร์โทรศัพท์
                    </Label>
                    <div className="mt-1 text-sm font-medium">{user.phone || 'ไม่ได้ระบุ'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-pink-500" />
                  คะแนนสะสม
                </CardTitle>
                <CardDescription>คะแนนสะสมและสิทธิประโยชน์</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-pink-500 mb-1">{user.points} คะแนน</div>
                  <p className="text-sm text-muted-foreground">
                    ทุก 100 คะแนนสามารถแลกเป็นส่วนลด 10 บาท
                  </p>
                </div>
                <div className="flex gap-2 mb-4">
                  <Button asChild variant="outline" className="gap-1 flex-1 justify-center">
                    <Link href="/points/history">
                      <Info className="h-4 w-4" />
                      ประวัติคะแนน
                    </Link>
                  </Button>
                  <Button asChild className="gap-1 flex-1 justify-center bg-pink-500 hover:bg-pink-600">
                    <Link href="/points/rewards">
                      <Award className="h-4 w-4" />
                      แลกของรางวัล
                    </Link>
                  </Button>
                </div>
                <div className="rounded-lg border p-4 bg-pink-50 dark:bg-pink-950">
                  <div className="font-medium mb-1 flex items-center gap-1">
                    <Award className="h-4 w-4 text-pink-500" />
                    สถานะสมาชิก: ระดับปกติ
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ซื้อสินค้าเพิ่มอีก 5,000 บาท เพื่ออัพเกรดเป็นสมาชิก VIP
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ประวัติการสั่งซื้อ</CardTitle>
                <CardDescription>รายการสั่งซื้อล่าสุดของคุณ</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="overflow-hidden">
                        <div className="bg-muted p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{order.id}</span>
                              <Badge variant={
                                (order.status === 'delivered' ? 'success' : 
                                order.status === 'processing' ? 'default' : 
                                'secondary') as 'default' | 'destructive' | 'outline' | 'secondary' | 'success'
                              }>
                                {order.status === 'delivered' ? 'จัดส่งแล้ว' : 
                                 order.status === 'processing' ? 'กำลังดำเนินการ' : 
                                 'รอการชำระเงิน'}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              วันที่สั่ง: {order.date}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-medium">{order.total.toLocaleString()} บาท</div>
                              <div className="text-xs text-muted-foreground">
                                {order.items} รายการ
                              </div>
                            </div>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/account/orders/${order.id}`}>
                                ดูรายละเอียด
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    <div className="flex justify-center">
                      <Button asChild variant="outline">
                        <Link href="/account/orders">
                          ดูทั้งหมด
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">ยังไม่มีประวัติการสั่งซื้อ</h3>
                    <p className="text-muted-foreground mb-4">
                      คุณยังไม่เคยสั่งซื้อสินค้าจากเรา เริ่มช้อปปิ้งกันเลย!
                    </p>
                    <Button asChild className="bg-pink-500 hover:bg-pink-600">
                      <Link href="/#featured-products">
                        เลือกชมสินค้า
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="addresses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">ที่อยู่จัดส่ง</h3>
              <Button className="gap-1 bg-pink-500 hover:bg-pink-600">
                <Plus className="h-4 w-4" />
                เพิ่มที่อยู่ใหม่
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <Card key={address.id} className="relative">
                  {address.isDefault && (
                    <Badge variant="secondary" className="absolute right-4 top-4">
                      ค่าเริ่มต้น
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Home className="h-5 w-5 text-pink-500" />
                      {address.name}
                    </CardTitle>
                    <CardDescription>{address.recipient}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <p>{address.address}</p>
                      <p>แขวง/ตำบล {address.district}</p>
                      <p>{address.province} {address.postalCode}</p>
                      <p className="flex items-center gap-1 mt-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {address.phone}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {!address.isDefault && (
                      <Button variant="outline" size="sm" className="text-xs gap-1">
                        <Check className="h-3.5 w-3.5" />
                        ตั้งเป็นค่าเริ่มต้น
                      </Button>
                    )}
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-xs">
                        แก้ไข
                      </Button>
                      {!address.isDefault && (
                        <Button variant="ghost" size="sm" className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                          ลบ
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-pink-500" />
                  การแจ้งเตือน
                </CardTitle>
                <CardDescription>ปรับแต่งการแจ้งเตือนและการสื่อสารจากเรา</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="promotions" className="flex flex-col">
                      <span>โปรโมชั่นและส่วนลด</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        รับการแจ้งเตือนเกี่ยวกับโปรโมชั่นและส่วนลดพิเศษ
                      </span>
                    </Label>
                    <Switch
                      id="promotions"
                      checked={notifications.promotions}
                      onCheckedChange={(value) => updateNotification('promotions', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="orderUpdates" className="flex flex-col">
                      <span>อัพเดทคำสั่งซื้อ</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        รับการแจ้งเตือนเมื่อสถานะคำสั่งซื้อของคุณมีการเปลี่ยนแปลง
                      </span>
                    </Label>
                    <Switch
                      id="orderUpdates"
                      checked={notifications.orderUpdates}
                      onCheckedChange={(value) => updateNotification('orderUpdates', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="newProducts" className="flex flex-col">
                      <span>สินค้าใหม่</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        รับการแจ้งเตือนเมื่อมีสินค้าใหม่ที่อาจตรงกับความสนใจของคุณ
                      </span>
                    </Label>
                    <Switch
                      id="newProducts"
                      checked={notifications.newProducts}
                      onCheckedChange={(value) => updateNotification('newProducts', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="newsletter" className="flex flex-col">
                      <span>จดหมายข่าว</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        รับจดหมายข่าวรายเดือนเกี่ยวกับเทรนด์และคำแนะนำ
                      </span>
                    </Label>
                    <Switch
                      id="newsletter"
                      checked={notifications.newsletter}
                      onCheckedChange={(value) => updateNotification('newsletter', value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-pink-500" />
                  ตั้งค่าความเป็นส่วนตัว
                </CardTitle>
                <CardDescription>จัดการการตั้งค่าความเป็นส่วนตัวของบัญชีคุณ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dataSharing">การแชร์ข้อมูล</Label>
                    <Select defaultValue="minimal">
                      <SelectTrigger id="dataSharing" className="mt-2">
                        <SelectValue placeholder="เลือกระดับการแชร์ข้อมูล" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">แชร์ข้อมูลขั้นต่ำ</SelectItem>
                        <SelectItem value="recommended">แชร์ข้อมูลตามคำแนะนำ</SelectItem>
                        <SelectItem value="all">แชร์ข้อมูลทั้งหมด</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-2">
                      เลือกจำนวนข้อมูลที่คุณต้องการแชร์เพื่อรับประสบการณ์ส่วนตัว
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-pink-500 hover:bg-pink-600">บันทึกการตั้งค่า</Button>
              </CardFooter>
            </Card>
            
            <Card className="border-red-200 dark:border-red-900">
              <CardHeader>
                <CardTitle className="text-red-500">จัดการบัญชี</CardTitle>
                <CardDescription>ตัวเลือกสำหรับจัดการบัญชีของคุณ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">เปลี่ยนรหัสผ่าน</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      เปลี่ยนรหัสผ่านเพื่อความปลอดภัยของบัญชีคุณ
                    </p>
                    <Button variant="outline">เปลี่ยนรหัสผ่าน</Button>
                  </div>
                  <div className="pt-2 border-t">
                    <h4 className="font-medium mb-1 text-red-500">ลบบัญชี</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      การลบบัญชีเป็นการดำเนินการที่ไม่สามารถเรียกคืนได้ ข้อมูลทั้งหมดของคุณจะถูกลบออกจากระบบ
                    </p>
                    <Button variant="destructive">ลบบัญชี</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
} 