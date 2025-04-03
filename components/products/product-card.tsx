"use client";

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingBag, Star, ChevronDown } from 'lucide-react';
import { Product } from '@/types/product';
import { motion } from 'framer-motion';

type ProductCardProps = {
  product: Product;
  isInWishlist: boolean;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  isHovering?: boolean;
  onHoverChange?: (isHovering: boolean) => void;
  variant?: 'grid' | 'featured';
  index?: number;
};

const ProductCard = memo(({ 
  product, 
  isInWishlist, 
  onToggleFavorite, 
  onAddToCart,
  isHovering,
  onHoverChange,
  variant = 'grid',
  index = 0
}: ProductCardProps) => {
  const isFeatured = variant === 'featured';
  
  const baseCardClass = isFeatured
    ? "overflow-hidden border-0 shadow-sm transition-all duration-300 hover:shadow-md"
    : "overflow-hidden border-0 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-primary/10";

  const cardContent = (
    <>
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <div className={`${isFeatured ? 'aspect-[1/1]' : 'aspect-[1/1]'} relative overflow-hidden`}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              loading={index < 8 ? "eager" : "lazy"}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEHQIxKAoH2AAAAABJRU5ErkJggg=="
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 25vw"
            />
            
            {/* Gradient overlay on hover - only for grid variant */}
            {!isFeatured && (
              <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 ${isHovering ? 'opacity-100' : ''}`} />
            )}
            
            {/* Quick view button on hover - only for grid variant */}
            {!isFeatured && (
              <div className={`absolute bottom-4 left-0 right-0 flex justify-center opacity-0 transform translate-y-4 transition-all duration-300 ${isHovering ? 'opacity-100 translate-y-0' : ''}`}>
                <Button variant="secondary" size="sm" className="bg-white/90 text-primary hover:bg-white">
                  ดูเร็วๆ <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </Link>
        <Button
          variant={isFeatured ? "ghost" : "default"}
          size={isFeatured ? "icon" : "sm"}
          className={isFeatured 
            ? "absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-foreground rounded-full h-7 w-7"
            : "absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white text-foreground rounded-full p-2 shadow-md"
          }
          onClick={() => onToggleFavorite(product.id)}
        >
          <Heart 
            className={`${isFeatured ? 'h-4 w-4' : 'h-5 w-5'} transition-colors duration-300 ${isInWishlist ? (isFeatured ? 'fill-pink-500 text-pink-500' : 'fill-primary text-primary') : ''}`} 
          />
        </Button>
        
        <div className={`absolute top-3 left-3 flex flex-col gap-2`}>
          {product.isNew && (
            <Badge className="bg-blue-500 hover:bg-blue-600 px-3 py-1 text-xs shadow-md">
              {isFeatured ? 'New' : 'ใหม่'}
            </Badge>
          )}
          {product.isBestSeller && (
            <Badge className="bg-amber-500 hover:bg-amber-600 px-3 py-1 text-xs shadow-md">
              {isFeatured ? 'Best Seller' : 'ขายดี'}
            </Badge>
          )}
          {product.isOnSale && (
            <Badge className="bg-primary hover:bg-primary/90 px-3 py-1 text-xs shadow-md">
              {isFeatured ? `Sale ${product.discount}% Off` : `ลด ${product.discount}%`}
            </Badge>
          )}
        </div>
      </div>
      <CardContent className={isFeatured ? "p-2" : "p-3"}>
        <Link href={`/product/${product.id}`} className="block">
          <h3 className={`${isFeatured ? 'font-medium text-sm' : 'font-semibold text-base'} mb-1 hover:text-primary transition-colors line-clamp-1`}>
            {product.name}
          </h3>
        </Link>
        <p className="text-muted-foreground text-xs mb-2 line-clamp-1">{product.description}</p>
        {!isFeatured && (
          <div className="flex items-center mb-2">
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
        )}
        <div className="flex items-baseline">
          {product.isOnSale && product.originalPrice ? (
            <>
              <span className={`${isFeatured ? 'font-semibold text-base' : 'font-bold text-lg text-primary'}`}>
                {isFeatured ? '$' : ''}{product.price.toFixed(2)}{isFeatured ? '' : ' ฿'}
              </span>
              <span className="text-muted-foreground line-through ml-2 text-sm">
                {isFeatured ? '$' : ''}{product.originalPrice.toFixed(2)}{isFeatured ? '' : ' ฿'}
              </span>
              {!isFeatured && (
                <span className="ml-2 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  -{product.discount}%
                </span>
              )}
            </>
          ) : (
            <span className={`${isFeatured ? 'font-semibold text-base' : 'font-bold text-lg text-primary'}`}>
              {isFeatured ? '$' : ''}{product.price.toFixed(2)}{isFeatured ? '' : ' ฿'}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className={isFeatured ? "p-2 pt-0" : "p-3 pt-0"}>
        <Button 
          className={`w-full bg-primary hover:bg-primary/90 ${isFeatured ? 'text-sm py-1' : 'text-sm py-1 transition-all duration-300'}`}
          size={isFeatured ? "sm" : "sm"}
          onClick={() => onAddToCart(product)}
        >
          <ShoppingBag className={`${isFeatured ? 'h-3 w-3 mr-1' : 'h-3 w-3 mr-1'}`} />
          {isFeatured ? 'Add to Cart' : 'เพิ่มลงตะกร้า'}
        </Button>
      </CardFooter>
    </>
  );

  return (
    <Card className={baseCardClass}>
      {cardContent}
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;