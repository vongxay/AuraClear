"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import ProductCard from '@/components/products/product-card';
import { motion } from 'framer-motion';

// Import the same products from featured-products for now
// In a real app, this would come from an API or database
import { featuredProducts } from '@/data/products';

const ProductGrid = () => {
  const [sortOption, setSortOption] = useState("featured");
  const [hoveringProductId, setHoveringProductId] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  // In a real app, we would apply actual sorting logic
  // For now, we'll just use the same products
  const products = [...featuredProducts];

  const toggleFavorite = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    
    toast({
      title: isInWishlist(productId) 
        ? "นำออกจากรายการโปรด" 
        : "เพิ่มในรายการโปรด",
      description: isInWishlist(productId)
        ? "สินค้านี้ถูกนำออกจากรายการโปรดของคุณแล้ว"
        : "สินค้านี้ถูกเพิ่มในรายการโปรดของคุณแล้ว",
      duration: 2000,
    });
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    
    toast({
      title: "เพิ่มลงตะกร้าแล้ว",
      description: `${product.name} ได้ถูกเพิ่มลงในตะกร้าของคุณแล้ว`,
      duration: 2000,
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <motion.p 
          className="text-muted-foreground mb-4 sm:mb-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          กำลังแสดง <span className="font-medium text-foreground">{products.length}</span> รายการสินค้า
        </motion.p>
        
        <motion.div 
          className="flex items-center w-full sm:w-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >          
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full sm:w-[180px] border-primary/20 focus:ring-primary/20">
              <SelectValue placeholder="เรียงโดย" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">สินค้าแนะนำ</SelectItem>
              <SelectItem value="newest">สินค้าใหม่ล่าสุด</SelectItem>
              <SelectItem value="price-low">ราคา: ต่ำ-สูง</SelectItem>
              <SelectItem value="price-high">ราคา: สูง-ต่ำ</SelectItem>
              <SelectItem value="rating">คะแนนสูงสุด</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            isInWishlist={isInWishlist(product.id)}
            onToggleFavorite={toggleFavorite}
            onAddToCart={handleAddToCart}
            isHovering={hoveringProductId === product.id}
            onHoverChange={(isHovering) => setHoveringProductId(isHovering ? product.id : null)}
            variant="grid"
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;