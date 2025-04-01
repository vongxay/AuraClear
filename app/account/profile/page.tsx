"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
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
  Check, Info, Loader2, AlertCircle
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

// กำหนด interface สำหรับแต่ละคอมโพเนนต์
interface ProfileHeaderProps {
  user: any;
  handleLogout: () => void;
}

interface PersonalInfoTabProps {
  user: any;
  isEditing: boolean;
  startEditing: () => void;
  cancelEditing: () => void;
  saveUserInfo: () => void;
  formData: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isUpdating: boolean;
  updateSuccess: boolean;
  updateError: string;
}

interface PointsTabProps {
  user: any;
}

// แยกคอมโพเนนต์สำหรับ Profile Header ออกมา
const ProfileHeader = memo(({ user, handleLogout }: ProfileHeaderProps) => {
  return (
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
  );
});

ProfileHeader.displayName = 'ProfileHeader';

// แยกคอมโพเนนต์สำหรับแสดงข้อมูลส่วนตัว
const PersonalInfoTab = memo(({ 
  user, 
  isEditing, 
  startEditing, 
  cancelEditing, 
  saveUserInfo,
  formData,
  setFormData,
  isUpdating,
  updateSuccess,
  updateError
}: PersonalInfoTabProps) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev: typeof formData) => ({ ...prev, [id]: value }));
  }, [setFormData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>ข้อมูลส่วนตัว</span>
          {!isEditing ? (
            <Button variant="outline" size="sm" className="gap-1 h-8" onClick={startEditing}>
              <Edit className="h-3.5 w-3.5" />
              แก้ไข
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8" onClick={cancelEditing}>
                ยกเลิก
              </Button>
              <Button size="sm" className="h-8 bg-pink-500 hover:bg-pink-600" 
                onClick={saveUserInfo} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                    กำลังบันทึก
                  </>
                ) : 'บันทึก'}
              </Button>
            </div>
          )}
        </CardTitle>
        <CardDescription>ข้อมูลส่วนตัวและการติดต่อของคุณ</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {updateSuccess && (
          <div className="p-3 rounded-md bg-green-50 text-green-700 flex items-start gap-2 dark:bg-green-900 dark:text-green-100">
            <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>อัปเดตข้อมูลเรียบร้อยแล้ว</span>
          </div>
        )}
        
        {updateError && (
          <div className="p-3 rounded-md bg-red-50 text-red-500 flex items-start gap-2 dark:bg-red-900 dark:text-red-100">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>{updateError}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="firstName">ชื่อ</Label>
                <Input 
                  id="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange}
                  placeholder="ชื่อของคุณ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">นามสกุล</Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange}
                  placeholder="นามสกุลของคุณ"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1" htmlFor="email">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  อีเมล
                </Label>
                <Input 
                  id="email" 
                  value={user.email} 
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  อีเมลไม่สามารถเปลี่ยนแปลงได้
                </p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1" htmlFor="phone">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  เบอร์โทรศัพท์
                </Label>
                <Input 
                  id="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  placeholder="เบอร์โทรศัพท์ของคุณ"
                />
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

PersonalInfoTab.displayName = 'PersonalInfoTab';

// แยกคอมโพเนนต์สำหรับแสดงคำสั่งซื้อ
const OrdersTab = memo(() => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-pink-500" />
          ประวัติคำสั่งซื้อ
        </CardTitle>
        <CardDescription>ดูรายละเอียดและสถานะของคำสั่งซื้อของคุณ</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">ยังไม่มีประวัติการสั่งซื้อ</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            เมื่อคุณสั่งซื้อสินค้า ประวัติการสั่งซื้อจะปรากฏที่นี่
          </p>
          <Button asChild className="bg-pink-500 hover:bg-pink-600">
            <Link href="/#featured-products">เลือกซื้อสินค้าเลย</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

OrdersTab.displayName = 'OrdersTab';

// แยกคอมโพเนนต์สำหรับแสดงคะแนนสะสม
const PointsTab = memo(({ user }: PointsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-pink-500" />
          แต้มสะสมของคุณ
        </CardTitle>
        <CardDescription>สะสมแต้มจากการสั่งซื้อเพื่อรับส่วนลดและสิทธิพิเศษ</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg p-6 mb-6 text-white">
          <h3 className="text-lg font-semibold mb-1">คะแนนสะสมทั้งหมด</h3>
          <p className="text-4xl font-bold mb-4">{user.points} แต้ม</p>
          <p className="text-sm opacity-80">ทุกการสั่งซื้อ 100 บาท = 1 แต้ม</p>
        </div>
        
        <div className="grid gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">วิธีรับแต้ม</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-xs font-semibold flex-shrink-0 dark:bg-pink-900">1</span>
                <span>ทุกการสั่งซื้อสินค้า 100 บาท จะได้รับ 1 แต้มสะสม</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-xs font-semibold flex-shrink-0 dark:bg-pink-900">2</span>
                <span>รีวิวสินค้าหลังการซื้อ รับเพิ่ม 5 แต้ม</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-xs font-semibold flex-shrink-0 dark:bg-pink-900">3</span>
                <span>แนะนำเพื่อน เมื่อเพื่อนสั่งซื้อสินค้าครั้งแรก รับ 20 แต้ม</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">วิธีใช้แต้ม</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-xs font-semibold flex-shrink-0 dark:bg-pink-900">1</span>
                <span>ใช้ 100 แต้ม = ส่วนลด 50 บาท</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-xs font-semibold flex-shrink-0 dark:bg-pink-900">2</span>
                <span>ใช้ 300 แต้ม = ส่วนลด 200 บาท</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-xs font-semibold flex-shrink-0 dark:bg-pink-900">3</span>
                <span>ใช้ 500 แต้ม = ส่วนลด 400 บาท</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PointsTab.displayName = 'PointsTab';

// แยกคอมโพเนนต์สำหรับแสดงสินค้าที่ชอบ
const WishlistTab = memo(() => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          สินค้าที่ชอบ
        </CardTitle>
        <CardDescription>รายการสินค้าที่คุณบันทึกไว้เพื่อซื้อในภายหลัง</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">รายการสินค้าที่ชอบของคุณว่างเปล่า</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            บันทึกสินค้าที่คุณสนใจเพื่อดูภายหลังหรือรับการแจ้งเตือนเมื่อมีส่วนลด
          </p>
          <Button asChild className="bg-pink-500 hover:bg-pink-600">
            <Link href="/#featured-products">สำรวจสินค้า</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

WishlistTab.displayName = 'WishlistTab';

// แยกคอมโพเนนต์สำหรับแสดงการตั้งค่า
const SettingsTab = memo(() => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-pink-500" />
          การแจ้งเตือน
        </CardTitle>
        <CardDescription>จัดการการแจ้งเตือนที่คุณต้องการได้รับ</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">โปรโมชันและส่วนลด</Label>
              <p className="text-sm text-muted-foreground">
                รับข้อมูลเกี่ยวกับโปรโมชัน ส่วนลดและข้อเสนอพิเศษ
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">สถานะคำสั่งซื้อ</Label>
              <p className="text-sm text-muted-foreground">
                รับการแจ้งเตือนเมื่อสถานะคำสั่งซื้อของคุณมีการเปลี่ยนแปลง
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">สินค้าที่ชอบ</Label>
              <p className="text-sm text-muted-foreground">
                รับการแจ้งเตือนเมื่อสินค้าที่คุณชอบมีการลดราคา
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

SettingsTab.displayName = 'SettingsTab';

// คอมโพเนนต์หลัก
export default function ProfilePage() {
  const { user, isLoggedIn, isLoading, logout, updateUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  
  // รวม state ที่เกี่ยวข้องกับฟอร์มให้เป็น object เดียว
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });
  
  // ตั้งค่าข้อมูลผู้ใช้เมื่อโหลดเสร็จ
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || ''
      });
    }
  }, [user]);

  // ตรวจสอบสถานะการล็อกอิน
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/account');
    }
  }, [isLoading, isLoggedIn, router]);

  // ฟังก์ชันออกจากระบบ - ใช้ useCallback เพื่อป้องกันการสร้างฟังก์ชันใหม่ทุกครั้ง
  const handleLogout = useCallback(() => {
    logout();
    router.push('/account');
  }, [logout, router]);

  // ฟังก์ชันเริ่มการแก้ไขข้อมูล
  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  // ฟังก์ชันยกเลิกการแก้ไข
  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || ''
      });
    }
    setUpdateError('');
  }, [user]);

  // ฟังก์ชันบันทึกข้อมูลที่แก้ไข
  const saveUserInfo = useCallback(async () => {
    if (!user) return;
    
    setIsUpdating(true);
    setUpdateError('');
    setUpdateSuccess(false);
    
    try {
      await updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      });
      
      setUpdateSuccess(true);
      setIsEditing(false);
      
      // ซ่อนข้อความสำเร็จหลังจาก 3 วินาที
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error: any) {
      setUpdateError(error.message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    } finally {
      setIsUpdating(false);
    }
  }, [user, updateUser, formData]);

  // ใช้ useMemo เพื่อป้องกันการสร้าง Object ใหม่ทุกครั้งที่ re-render
  const personalInfoProps = useMemo(() => ({
    user,
    isEditing,
    startEditing,
    cancelEditing,
    saveUserInfo,
    formData,
    setFormData,
    isUpdating,
    updateSuccess,
    updateError
  }), [user, isEditing, startEditing, cancelEditing, saveUserInfo, formData, setFormData, isUpdating, updateSuccess, updateError]);

  if (isLoading || !user) {
    return (
      <Container className="py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
            <p className="mt-4 text-muted-foreground">กำลังโหลดข้อมูลผู้ใช้...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-20">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader user={user} handleLogout={handleLogout} />
        
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 w-full flex justify-start overflow-x-auto">
            <TabsTrigger value="info" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              ข้อมูลส่วนตัว
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-1">
              <ShoppingBag className="h-4 w-4" />
              คำสั่งซื้อ
            </TabsTrigger>
            <TabsTrigger value="points" className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              คะแนนสะสม
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              สินค้าที่ชอบ
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              ตั้งค่า
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-6">
            <PersonalInfoTab {...personalInfoProps} />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="points">
            <PointsTab user={user} />
          </TabsContent>

          <TabsContent value="wishlist">
            <WishlistTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
} 