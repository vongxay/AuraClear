"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/cart-context';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { cartItems } = useCart();
  
  // Redirect to home if accessed directly without checkout
  useEffect(() => {
    if (cartItems.length > 0) {
      router.push('/checkout');
    }
  }, [cartItems, router]);

  const orderNumber = `LB${Math.floor(100000 + Math.random() * 900000)}`;
  
  return (
    <div className="container mx-auto px-4 py-24 mt-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-2">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <p className="text-muted-foreground mb-8">
          Order number: <span className="font-semibold text-foreground">{orderNumber}</span>
        </p>
        
        <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">What&apos;s Next?</h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start">
              <div className="bg-muted rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-medium">Order Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                  You will receive an email confirmation with your order details shortly.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-muted rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-medium">Order Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Your order will be processed and prepared for shipping within 1-2 business days.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-muted rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-medium">Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  Once shipped, you will receive a tracking number to monitor your delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild>
            <Link href="/">
              Return to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/shop">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}