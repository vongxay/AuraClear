"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { featuredProducts } from '@/data/products';

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

const RelatedProducts = ({ currentProductId, category }: RelatedProductsProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Filter products by category and exclude current product
  const relatedProducts = featuredProducts
    .filter(product => product.category === category && product.id !== currentProductId)
    .slice(0, 3); // ลดจำนวนจาก 4 เป็น 3 ผลิตภัณฑ์

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
    
    toast({
      title: favorites.includes(productId) 
        ? "Removed from favorites" 
        : "Added to favorites",
      description: favorites.includes(productId)
        ? "This product has been removed from your favorites."
        : "This product has been added to your favorites.",
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
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {relatedProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative">
              <Link href={`/product/${product.id}`}>
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    loading="lazy"
                    quality={75}
                  />
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-foreground rounded-full h-7 w-7"
                onClick={() => toggleFavorite(product.id)}
              >
                <Heart 
                  className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-pink-500 text-pink-500' : ''}`} 
                />
              </Button>
              {/* แสดง Badge เพียงอันเดียวตามลำดับความสำคัญ */}
              {product.isOnSale && (
                <Badge className="absolute top-2 left-2 bg-pink-500 hover:bg-pink-600 text-xs px-2 py-0.5">Sale</Badge>
              )}
              {!product.isOnSale && product.isBestSeller && (
                <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600 text-xs px-2 py-0.5">Best Seller</Badge>
              )}
              {!product.isOnSale && !product.isBestSeller && product.isNew && (
                <Badge className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600 text-xs px-2 py-0.5">New</Badge>
              )}
            </div>
            <CardContent className="p-3">
              <Link href={`/product/${product.id}`} className="block">
                <h3 className="font-medium text-base mb-1 hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
              </Link>
              <div className="flex items-center mb-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-1">
                  ({product.reviews})
                </span>
              </div>
              <div className="flex items-center">
                {product.isOnSale && product.originalPrice ? (
                  <>
                    <span className="font-medium">${product.price.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground line-through ml-2">${product.originalPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="font-medium">${product.price.toFixed(2)}</span>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 h-8 text-xs"
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingBag className="h-3 w-3 mr-1" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;