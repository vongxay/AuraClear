"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Minus, Plus, Share2, ShoppingBag, Star, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { useAuth } from '@/context/auth-context';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const toggleFavorite = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "นำออกจากรายการโปรดแล้ว",
        description: "สินค้านี้ถูกนำออกจากรายการโปรดของคุณแล้ว",
        duration: 2000,
      });
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      toast({
        title: "เพิ่มในรายการโปรดแล้ว",
        description: "สินค้านี้ถูกเพิ่มในรายการโปรดของคุณแล้ว",
        duration: 2000,
      });
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
    
    if (!isLoggedIn) {
      toast({
        title: "เพิ่มในตะกร้าแล้ว",
        description: `${product.name} ถูกเพิ่มในตะกร้าของคุณแล้ว คุณต้องเข้าสู่ระบบหรือลงทะเบียนก่อนทำการชำระเงิน`,
        duration: 4000,
      });
    } else {
      toast({
        title: "เพิ่มในตะกร้าแล้ว",
        description: `${product.name} ถูกเพิ่มในตะกร้าของคุณแล้ว`,
        duration: 2000,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Product Image - ลดขนาดและปรับปรุงการแสดงผล */}
      <div className="relative">
        <div className="aspect-square relative overflow-hidden rounded-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            loading="eager"
            quality={80}
          />
        </div>
        {/* แสดง Badge เพียงอันเดียวตามลำดับความสำคัญ */}
        {product.isOnSale && (
          <Badge className="absolute top-4 left-4 bg-pink-500 hover:bg-pink-600">Sale {product.discount}% Off</Badge>
        )}
        {!product.isOnSale && product.isBestSeller && (
          <Badge className="absolute top-4 left-4 bg-amber-500 hover:bg-amber-600">Best Seller</Badge>
        )}
        {!product.isOnSale && !product.isBestSeller && product.isNew && (
          <Badge className="absolute top-4 left-4 bg-blue-500 hover:bg-blue-600">New</Badge>
        )}
      </div>

      {/* Product Info - ลดความซ้ำซ้อนและจัดระเบียบข้อมูล */}
      <div>
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
          
          {/* Rating แบบย่อ */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-amber-400 fill-amber-400'
                      : i < product.rating
                      ? 'text-amber-400 fill-amber-400 opacity-50'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              {product.rating} ({product.reviews})
            </span>
          </div>
          
          {/* Price แบบกระชับ */}
          <div className="flex items-center mb-4">
            {product.isOnSale && product.originalPrice ? (
              <>
                <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                <span className="text-muted-foreground line-through ml-2">${product.originalPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Add to Cart Section - ปรับให้กระชับ */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="flex items-center border rounded-md mr-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="h-9 w-9 rounded-none"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={increaseQuantity}
                className="h-9 w-9 rounded-none"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="ml-2"
              onClick={toggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
            </Button>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Truck className="h-3 w-3 mr-1" />
            <span>Free shipping on orders over $50</span>
          </div>
        </div>

        {/* Tabs - ปรับให้กระชับ */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
            <TabsTrigger value="ingredients" className="flex-1">Ingredients</TabsTrigger>
            <TabsTrigger value="how-to-use" className="flex-1">How to Use</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-3">
            <p className="text-sm text-muted-foreground line-clamp-4">
              {product.description} Our premium formula is designed to deliver exceptional results while being gentle on your skin.
            </p>
          </TabsContent>
          <TabsContent value="ingredients" className="pt-3">
            <p className="text-sm text-muted-foreground line-clamp-4">
              Aqua, Glycerin, Butylene Glycol, Niacinamide, Pentylene Glycol, Hyaluronic Acid, Panthenol, Allantoin, Sodium Hyaluronate.
            </p>
          </TabsContent>
          <TabsContent value="how-to-use" className="pt-3">
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Cleanse your face with a gentle cleanser and pat dry.</li>
              <li>Apply a small amount of product to your fingertips.</li>
              <li>Gently massage into your skin using upward circular motions.</li>
            </ol>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetails;