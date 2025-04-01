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
  Check, Info, Loader2, AlertCircle, X, Trash2
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
import { getCustomerById, updateCustomerAddress, getCustomerOrders, getCustomerWishlist, removeFromWishlist } from '@/lib/database';

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
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
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
            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">{user.first_name} {user.last_name}</h1>
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

  // สร้างตัวแปรสำหรับแสดงข้อมูลจาก formData แทน user
  const displayData = useMemo(() => ({
    ...user,
    phone: formData.phone,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    postal_code: formData.postal_code,
    country: formData.country || 'ไทย'
  }), [user, formData]);
  
  console.log("PersonalInfoTab render with formData:", formData);

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
                <Label htmlFor="first_name">ชื่อ</Label>
                <Input 
                  id="first_name" 
                  value={formData.first_name} 
                  onChange={handleChange}
                  placeholder="ชื่อของคุณ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">นามสกุล</Label>
                <Input 
                  id="last_name" 
                  value={formData.last_name} 
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
                <div className="mt-1 text-sm font-medium">{user.first_name}</div>
              </div>
              <div>
                <Label>นามสกุล</Label>
                <div className="mt-1 text-sm font-medium">{user.last_name}</div>
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
                <div className="mt-1 text-sm font-medium">{displayData.phone || 'ไม่ได้ระบุ'}</div>
              </div>
            </>
          )}
        </div>

        <div className="border-t pt-4 mt-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-pink-500" />
            ที่อยู่
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isEditing ? (
              <>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">ที่อยู่</Label>
                  <Input 
                    id="address" 
                    value={formData.address || ''} 
                    onChange={handleChange}
                    placeholder="บ้านเลขที่ หมู่บ้าน ถนน ซอย"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">เมือง/อำเภอ</Label>
                  <Input 
                    id="city" 
                    value={formData.city || ''} 
                    onChange={handleChange}
                    placeholder="เมืองหรืออำเภอ"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">จังหวัด</Label>
                  <Input 
                    id="state" 
                    value={formData.state || ''} 
                    onChange={handleChange}
                    placeholder="จังหวัด"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">รหัสไปรษณีย์</Label>
                  <Input 
                    id="postal_code" 
                    value={formData.postal_code || ''} 
                    onChange={handleChange}
                    placeholder="รหัสไปรษณีย์"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">ประเทศ</Label>
                  <Input 
                    id="country" 
                    value={formData.country || ''} 
                    onChange={handleChange}
                    placeholder="ประเทศ"
                    defaultValue="ไทย"
                  />
                </div>
              </>
            ) : (
              <>
                {displayData.address || displayData.city || displayData.state || displayData.postal_code ? (
                  <>
                    <div className="md:col-span-2">
                      <Label>ที่อยู่</Label>
                      <div className="mt-1 text-sm font-medium">{displayData.address || 'ไม่ได้ระบุ'}</div>
                    </div>
                    <div>
                      <Label>เมือง/อำเภอ</Label>
                      <div className="mt-1 text-sm font-medium">{displayData.city || 'ไม่ได้ระบุ'}</div>
                    </div>
                    <div>
                      <Label>จังหวัด</Label>
                      <div className="mt-1 text-sm font-medium">{displayData.state || 'ไม่ได้ระบุ'}</div>
                    </div>
                    <div>
                      <Label>รหัสไปรษณีย์</Label>
                      <div className="mt-1 text-sm font-medium">{displayData.postal_code || 'ไม่ได้ระบุ'}</div>
                    </div>
                    <div>
                      <Label>ประเทศ</Label>
                      <div className="mt-1 text-sm font-medium">{displayData.country || 'ไทย'}</div>
                    </div>
                  </>
                ) : (
                  <div className="md:col-span-2 text-center p-6 border border-dashed rounded-lg bg-muted/30">
                    <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">ยังไม่ได้เพิ่มที่อยู่</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 gap-1" 
                      onClick={startEditing}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      เพิ่มที่อยู่
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PersonalInfoTab.displayName = 'PersonalInfoTab';

// แยกคอมโพเนนต์สำหรับแสดงคำสั่งซื้อ
const OrdersTab = memo(({ user }: { user: any }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ฟังก์ชันเปลี่ยนสถานะเป็นข้อความภาษาไทย
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'รอการยืนยัน',
      'processing': 'กำลังดำเนินการ',
      'shipped': 'จัดส่งแล้ว',
      'delivered': 'ส่งถึงแล้ว',
      'completed': 'เสร็จสิ้น',
      'cancelled': 'ยกเลิก',
      'refunded': 'คืนเงินแล้ว'
    };
    return statusMap[status] || status;
  };

  // ฟังก์ชันสำหรับแสดงวันที่ในรูปแบบไทย
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ดึงข้อมูลคำสั่งซื้อเมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    if (!user?.id) return;

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const { success, orders } = await getCustomerOrders(user.id);
        if (success) {
          setOrders(orders);
        } else {
          setError('ไม่สามารถดึงข้อมูลคำสั่งซื้อได้');
        }
      } catch (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ:', err);
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  // กรณีกำลังโหลดข้อมูล
  if (isLoading) {
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
            <Loader2 className="h-16 w-16 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // กรณีมีข้อผิดพลาด
  if (error) {
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
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">เกิดข้อผิดพลาด</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // กรณีไม่มีคำสั่งซื้อ
  if (orders.length === 0) {
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
  }

  // กรณีมีข้อมูลคำสั่งซื้อ
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
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm font-medium">คำสั่งซื้อ #{order.order_number}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    order.status === 'completed' || order.status === 'delivered' ? 'success' :
                    order.status === 'cancelled' || order.status === 'refunded' ? 'destructive' :
                    'outline'
                  }>
                    {getStatusText(order.status)}
                  </Badge>
                  <Badge variant={
                    order.payment_status === 'paid' ? 'success' :
                    order.payment_status === 'failed' || order.payment_status === 'refunded' ? 'destructive' :
                    'outline'
                  }>
                    {order.payment_status === 'paid' ? 'ชำระแล้ว' : 
                     order.payment_status === 'pending' ? 'รอชำระเงิน' : 
                     order.payment_status === 'failed' ? 'ชำระเงินไม่สำเร็จ' : 
                     'คืนเงินแล้ว'}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                {order.order_items && order.order_items.length > 0 ? (
                  <div className="space-y-3">
                    {order.order_items.map((item: any) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                          {item.products?.images?.[0] ? (
                            <img 
                              src={item.products.images[0]} 
                              alt={item.products.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-pink-100 dark:bg-pink-900">
                              <Package className="h-6 w-6 text-pink-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{item.products?.name || 'ไม่พบชื่อสินค้า'}</h4>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} x ฿{item.price?.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">฿{item.total?.toLocaleString()}</p>
                          {item.points > 0 && (
                            <p className="text-xs text-pink-500">+ {item.points} คะแนน</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">ไม่พบข้อมูลรายการสินค้า</p>
                )}

                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between text-sm">
                    <span>ยอดรวม</span>
                    <span>฿{order.total_amount?.toLocaleString()}</span>
                  </div>
                  {order.shipping_amount > 0 && (
                    <div className="flex justify-between text-sm mt-1">
                      <span>ค่าจัดส่ง</span>
                      <span>฿{order.shipping_amount?.toLocaleString()}</span>
                    </div>
                  )}
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-sm mt-1 text-pink-500">
                      <span>ส่วนลด</span>
                      <span>-฿{order.discount_amount?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-base mt-2">
                    <span>ยอดชำระ</span>
                    <span>฿{(order.total_amount)?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t mt-4 pt-4">
                  <p className="text-sm font-medium">ที่อยู่จัดส่ง</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.shipping_address},<br />
                    {order.shipping_city} {order.shipping_state} {order.shipping_postal_code},<br />
                    {order.shipping_country}
                  </p>
                </div>

                {order.tracking_number && (
                  <div className="border-t mt-4 pt-4">
                    <p className="text-sm font-medium">เลขพัสดุ</p>
                    <p className="text-sm font-mono mt-1">{order.tracking_number}</p>
                    {order.shipping_method && (
                      <p className="text-xs text-muted-foreground mt-1">จัดส่งโดย: {order.shipping_method}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
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
const WishlistTab = memo(({ user }: { user: any }) => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRemoving, setIsRemoving] = useState<Record<string, boolean>>({});

  // ดึงข้อมูลสินค้าที่ชอบเมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    if (!user?.id) return;

    const fetchWishlist = async () => {
      setIsLoading(true);
      try {
        const { success, wishlist } = await getCustomerWishlist(user.id);
        if (success) {
          setWishlist(wishlist);
        } else {
          setError('ไม่สามารถดึงข้อมูลสินค้าที่ชอบได้');
        }
      } catch (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้าที่ชอบ:', err);
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้าที่ชอบ');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [user?.id]);

  // ฟังก์ชันคำนวณราคาหลังส่วนลด
  const calculateDiscountPrice = (price: number, discount: number) => {
    return price - discount;
  };

  // ฟังก์ชันลบสินค้าออกจากรายการโปรด
  const handleRemoveFromWishlist = async (productId: string) => {
    if (!user?.id || isRemoving[productId]) return;
    
    setIsRemoving(prev => ({ ...prev, [productId]: true }));
    
    try {
      const { success } = await removeFromWishlist(user.id, productId);
      
      if (success) {
        // ลบสินค้าออกจาก state โดยไม่ต้องโหลดข้อมูลใหม่ทั้งหมด
        setWishlist(prev => prev.filter(item => item.product_id !== productId));
      } else {
        alert('ไม่สามารถลบสินค้าออกจากรายการโปรดได้ กรุณาลองอีกครั้ง');
      }
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการลบสินค้าออกจากรายการโปรด:', err);
      alert('เกิดข้อผิดพลาดในการลบสินค้าออกจากรายการโปรด');
    } finally {
      setIsRemoving(prev => ({ ...prev, [productId]: false }));
    }
  };

  // กรณีกำลังโหลดข้อมูล
  if (isLoading) {
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
            <Loader2 className="h-16 w-16 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">กำลังโหลดข้อมูลสินค้าที่ชอบ...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // กรณีมีข้อผิดพลาด
  if (error) {
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
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">เกิดข้อผิดพลาด</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // กรณีไม่มีสินค้าที่ชอบ
  if (wishlist.length === 0) {
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
  }

  // กรณีมีข้อมูลสินค้าที่ชอบ
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
        <div className="grid gap-4 md:grid-cols-2">
          {wishlist.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden flex flex-col">
              <div className="p-4 flex gap-4">
                <div className="w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {item.products?.images?.[0] ? (
                    <img 
                      src={item.products.images[0]} 
                      alt={item.products.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-pink-100 dark:bg-pink-900">
                      <Package className="h-8 w-8 text-pink-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Link href={`/products/${item.product_id}`}>
                    <h4 className="font-medium hover:underline line-clamp-2">{item.products?.name || 'ไม่พบชื่อสินค้า'}</h4>
                  </Link>
                  <div className="mt-1">
                    {item.products?.discount > 0 ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-pink-500">
                          ฿{calculateDiscountPrice(item.products.price, item.products.discount).toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          ฿{item.products.price.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold">
                        ฿{item.products?.price.toLocaleString() || 0}
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    {item.products?.stock > 0 ? (
                      <Badge variant="outline" className="text-xs">มีสินค้า</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-500 border-red-200 dark:bg-red-900 dark:border-red-800">สินค้าหมด</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-3 mt-auto bg-muted/50 flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-red-500" 
                  title="ลบออกจากรายการโปรด"
                  onClick={() => handleRemoveFromWishlist(item.product_id)}
                  disabled={isRemoving[item.product_id]}
                >
                  {isRemoving[item.product_id] ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="sr-only">ลบ</span>
                </Button>
                <Button asChild size="sm" className="h-8 bg-pink-500 hover:bg-pink-600">
                  <Link href={`/products/${item.product_id}`}>
                    ดูรายละเอียด
                  </Link>
                </Button>
              </div>
            </div>
          ))}
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
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  
  // รวม state ที่เกี่ยวข้องกับฟอร์มให้เป็น object เดียว
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'ไทย'
  });
  
  // ดึงข้อมูลที่อยู่ลูกค้าจากฐานข้อมูลโดยตรง
  const fetchCustomerDetails = useCallback(async () => {
    if (!user?.id) return;
    
    console.log("Fetching customer details for user ID:", user.id);
    setIsLoadingAddress(true);
    try {
      const { success, customer } = await getCustomerById(user.id);
      
      if (success && customer) {
        console.log("Customer data fetched successfully:", customer);
        // อัปเดต formData ด้วยข้อมูลที่ได้จากฐานข้อมูล
        setFormData(prev => ({
          ...prev,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: customer.phone || '',
          address: customer.address || '',
          city: customer.city || '',
          state: customer.state || '',
          postal_code: customer.postal_code || '',
          country: customer.country || 'ไทย'
        }));
      } else {
        console.error('ไม่สามารถดึงข้อมูลลูกค้าได้');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า:', error);
    } finally {
      setIsLoadingAddress(false);
    }
  }, [user]);
  
  // ตั้งค่าข้อมูลผู้ใช้เมื่อโหลดเสร็จ
  useEffect(() => {
    console.log("Initial user load effect triggered:", user);
    if (user) {
      // ตั้งค่าข้อมูลพื้นฐานจาก user
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        postal_code: user.postal_code || '',
        country: user.country || 'ไทย'
      });
    }
  }, [user]);
  
  // แยก useEffect สำหรับการดึงข้อมูลเพิ่มเติม
  useEffect(() => {
    if (user?.id && !isLoading) {
      console.log("Triggering customer details fetch");
      fetchCustomerDetails();
    }
  }, [user?.id, isLoading, fetchCustomerDetails]);
  
  // เพิ่ม useEffect สำหรับรีเฟรชข้อมูลเมื่อโหลดหน้า
  useEffect(() => {
    // ตรวจสอบว่าเราอยู่ในฝั่ง client เพื่อป้องกัน rerender loop
    const refreshData = async () => {
      if (typeof window !== 'undefined' && user?.id) {
        console.log("Running additional fetch on client side");
        await fetchCustomerDetails();
      }
    };
    
    refreshData();
  }, []);

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
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        postal_code: user.postal_code || '',
        country: user.country || 'ไทย'
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
      // อัพเดตข้อมูลที่อยู่โดยตรงผ่าน API
      const addressUpdateResult = await updateCustomerAddress(user.id, {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country
      });
      
      if (!addressUpdateResult.success) {
        throw new Error(typeof addressUpdateResult.error === 'object' ? 
          (addressUpdateResult.error as any)?.message || 'เกิดข้อผิดพลาดในการอัปเดตที่อยู่' : 
          'เกิดข้อผิดพลาดในการอัปเดตที่อยู่');
      }
      
      // อัพเดตข้อมูลผู้ใช้ผ่าน Context
      await updateUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country
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

  if (isLoading || isLoadingAddress) {
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

  if (!user) {
    return (
      <Container className="py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="mt-4 text-muted-foreground">ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบอีกครั้ง</p>
            <Button className="mt-4" onClick={() => router.push('/account')}>
              ไปยังหน้าเข้าสู่ระบบ
            </Button>
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
            <OrdersTab user={user} />
          </TabsContent>

          <TabsContent value="points">
            <PointsTab user={user} />
          </TabsContent>

          <TabsContent value="wishlist">
            <WishlistTab user={user} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
} 