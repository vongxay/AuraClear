"use client";

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();

  // Memoize calculated values to prevent unnecessary recalculations
  const { shipping, tax, total } = useMemo(() => {
    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const taxAmount = subtotal * 0.08; // 8% tax rate
    const totalAmount = subtotal + shippingCost + taxAmount;
    
    return {
      shipping: shippingCost,
      tax: taxAmount, 
      total: totalAmount
    };
  }, [subtotal]);

  const handleRemoveItem = useCallback((itemId: string) => {
    removeFromCart(itemId);
    toast({
      title: "นำสินค้าออกแล้ว",
      description: "สินค้าถูกนำออกจากตะกร้าของคุณแล้ว",
      duration: 2000,
    });
  }, [removeFromCart, toast]);

  const handleQuantityChange = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  }, [updateQuantity]);

  const handleApplyPromo = useCallback(() => {
    if (!promoCode) return;
    
    setIsApplyingPromo(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "โค้ดส่วนลดไม่ถูกต้อง",
        description: "โค้ดส่วนลดที่คุณกรอกไม่ถูกต้องหรือหมดอายุแล้ว",
        duration: 3000,
      });
      setIsApplyingPromo(false);
    }, 1000);
  }, [promoCode, toast]);

  // Render empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">ตะกร้าของคุณว่างเปล่า</h1>
          <p className="text-muted-foreground mb-8">
            ดูเหมือนว่าคุณยังไม่ได้เพิ่มสินค้าลงในตะกร้า
          </p>
          <Button size="lg" asChild>
            <Link href="/shop">เลือกซื้อสินค้าต่อ</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 mt-16">
      <h1 className="text-3xl font-bold mb-8">ตะกร้าสินค้าของคุณ</h1>
      
      {!isLoggedIn && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <UserIcon className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">กรุณาเข้าสู่ระบบก่อนชำระเงิน</AlertTitle>
          <AlertDescription className="text-amber-700">
            คุณสามารถเพิ่มสินค้าลงตะกร้าได้ แต่ต้องเข้าสู่ระบบหรือลงทะเบียนก่อนที่จะทำการชำระเงิน{' '}
            <Link href="/account" className="underline font-medium">
              เข้าสู่ระบบหรือลงทะเบียน
            </Link>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-sm p-6">
            <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-6">สินค้า</div>
              <div className="col-span-2 text-center">ราคา</div>
              <div className="col-span-2 text-center">จำนวน</div>
              <div className="col-span-2 text-right">รวม</div>
            </div>
            
            <Separator className="mb-6" />
            
            {cartItems.map((item) => (
              <div key={item.id} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 md:col-span-6">
                    <div className="flex items-center">
                      <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 80px, 80px"
                          loading="eager"
                          priority={cartItems.indexOf(item) < 2} // Priority for first two items
                        />
                      </div>
                      <div className="ml-4">
                        <Link href={`/product/${item.id}`} className="font-medium hover:text-primary transition-colors">
                          {item.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                    <span className="md:hidden text-sm text-muted-foreground">Price:</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                    <span className="md:hidden text-sm text-muted-foreground">Quantity:</span>
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8 rounded-none"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="h-8 w-8 rounded-none"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end">
                    <span className="md:hidden text-sm text-muted-foreground">Total:</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-end mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span className="text-xs">Remove</span>
                  </Button>
                </div>
                
                {cartItems.indexOf(item) < cartItems.length - 1 && (
                  <Separator className="my-6" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex space-x-2">
                <Input
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={handleApplyPromo}
                  disabled={!promoCode || isApplyingPromo}
                >
                  Apply
                </Button>
              </div>
            </div>
            
            <Button className="w-full mb-3" asChild>
              <Link href={isLoggedIn ? "/checkout" : "/account"}>
                {isLoggedIn ? "ชำระเงิน" : "เข้าสู่ระบบเพื่อชำระเงิน"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              asChild
            >
              <Link href="/product">เลือกซื้อสินค้าต่อ</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}