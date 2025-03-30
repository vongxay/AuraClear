"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useWishlist } from '@/context/wishlist-context';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleRemoveItem = (itemId: string) => {
    removeFromWishlist(itemId);
    toast({
      title: "Item removed",
      description: "The item has been removed from your wishlist.",
      duration: 2000,
    });
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any products to your wishlist yet.
          </p>
          <Button size="lg" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 mt-16">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
      
      <div className="bg-card rounded-lg shadow-sm p-6">
        <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-muted-foreground">
          <div className="col-span-6">Product</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-4 text-right">Actions</div>
        </div>
        
        <Separator className="mb-6" />
        
        {wishlistItems.map((item) => (
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
                      sizes="80px"
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
              
              <div className="col-span-1 md:col-span-4 flex items-center justify-between md:justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            
            {wishlistItems.indexOf(item) < wishlistItems.length - 1 && (
              <Separator className="my-6" />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" asChild>
          <Link href="/product">Continue Shopping</Link>
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => {
            clearWishlist();
            toast({
              title: "Wishlist cleared",
              description: "All items have been removed from your wishlist.",
              duration: 2000,
            });
          }}
        >
          Clear Wishlist
        </Button>
      </div>
    </div>
  );
}