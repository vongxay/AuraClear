"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingBag, Star, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/cart-context';
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
import ProductFilters from '@/components/product-filters';
import { motion, AnimatePresence } from 'framer-motion';

// Import the same products from featured-products for now
// In a real app, this would come from an API or database
import { featuredProducts } from '@/data/products';

const ProductGrid = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("featured");
  const [hoveringProductId, setHoveringProductId] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { toast } = useToast();

  // In a real app, we would apply actual sorting logic
  // For now, we'll just use the same products
  const products = [...featuredProducts];

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
    
    toast({
      title: favorites.includes(productId) 
        ? "นำออกจากรายการโปรด" 
        : "เพิ่มในรายการโปรด",
      description: favorites.includes(productId)
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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="mr-2 lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                ตัวกรอง
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetTitle>ตัวกรอง</SheetTitle>
              <div className="py-6">
                <h3 className="text-lg font-semibold mb-5">ตัวกรอง</h3>
                <ProductFilters />
              </div>
            </SheetContent>
          </Sheet>
          
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

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            onHoverStart={() => setHoveringProductId(product.id)}
            onHoverEnd={() => setHoveringProductId(null)}
          >
            <Card className="overflow-hidden border-0 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
              <div className="relative">
                <Link href={`/product/${product.id}`}>
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 ${hoveringProductId === product.id ? 'opacity-100' : ''}`} />
                    
                    {/* Quick view button on hover */}
                    <div className={`absolute bottom-4 left-0 right-0 flex justify-center opacity-0 transform translate-y-4 transition-all duration-300 ${hoveringProductId === product.id ? 'opacity-100 translate-y-0' : ''}`}>
                      <Button variant="secondary" size="sm" className="bg-white/90 text-primary hover:bg-white">
                        ดูเร็วๆ <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Link>
                <motion.button
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white text-foreground rounded-full p-2 shadow-md"
                  onClick={() => toggleFavorite(product.id)}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart 
                    className={`h-5 w-5 transition-colors duration-300 ${favorites.includes(product.id) ? 'fill-primary text-primary' : ''}`} 
                  />
                </motion.button>
                
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-blue-500 hover:bg-blue-600 px-3 py-1 text-xs shadow-md">ใหม่</Badge>
                  )}
                  {product.isBestSeller && (
                    <Badge className="bg-amber-500 hover:bg-amber-600 px-3 py-1 text-xs shadow-md">ขายดี</Badge>
                  )}
                  {product.isOnSale && (
                    <Badge className="bg-primary hover:bg-primary/90 px-3 py-1 text-xs shadow-md">ลด {product.discount}%</Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-5">
                <Link href={`/product/${product.id}`} className="block">
                  <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                </Link>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
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
                            : 'text-muted-foreground/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({product.reviews})
                  </span>
                </div>
                <div className="flex items-baseline">
                  {product.isOnSale && product.originalPrice ? (
                    <>
                      <span className="font-bold text-xl text-primary">{product.price.toFixed(2)} ฿</span>
                      <span className="text-muted-foreground line-through ml-2 text-sm">{product.originalPrice.toFixed(2)} ฿</span>
                      <span className="ml-2 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">-{product.discount}%</span>
                    </>
                  ) : (
                    <span className="font-bold text-xl text-primary">{product.price.toFixed(2)} ฿</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  เพิ่มลงตะกร้า
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;