"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'credit-card',
    saveInfo: false,
    sameAddress: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate order processing
    setTimeout(() => {
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. You will receive a confirmation email shortly.",
        duration: 5000,
      });
      clearCart();
      router.push('/checkout/success');
      setIsSubmitting(false);
    }, 2000);
  };

  if (cartItems.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-24 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                
                <div className="mb-4">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="sameAddress"
                    checked={formData.sameAddress}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('sameAddress', checked as boolean)
                    }
                  />
                  <Label htmlFor="sameAddress" className="text-sm">
                    Billing address is the same as shipping address
                  </Label>
                </div>
              </div>
              
              <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                
                <RadioGroup 
                  value={formData.paymentMethod} 
                  onValueChange={handleRadioChange}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 border rounded-md p-3">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Credit / Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-md p-3">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-md p-3">
                    <RadioGroupItem value="apple-pay" id="apple-pay" />
                    <Label htmlFor="apple-pay">Apple Pay</Label>
                  </div>
                </RadioGroup>
                
                {formData.paymentMethod === 'credit-card' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="saveInfo"
                    checked={formData.saveInfo}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('saveInfo', checked as boolean)
                    }
                  />
                  <Label htmlFor="saveInfo" className="text-sm">
                    Save this information for next time
                  </Label>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-pink-500 hover:bg-pink-600 text-white" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Complete Order • $${total.toFixed(2)}`}
              </Button>
            </form>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex items-center">
                      <span className="bg-muted rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                        {item.quantity}
                      </span>
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3 mb-4">
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
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Free Shipping</h3>
                    <p className="text-sm text-muted-foreground">
                      On orders over $50. Delivery in 3-5 business days.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Secure Checkout</h3>
                    <p className="text-sm text-muted-foreground">
                      Your payment information is processed securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}