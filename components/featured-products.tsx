"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { featuredProducts } from '@/data/products';

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const toggleFavorite = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: "This product has been removed from your wishlist.",
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
        title: "Added to wishlist",
        description: "This product has been added to your wishlist.",
        duration: 2000,
      });
    }
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

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular and trending clear products, carefully selected for exceptional quality and results.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="relative">
                <Link href={`/product/${product.id}`}>
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-foreground rounded-full"
                  onClick={() => toggleFavorite(product)}
                >
                  <Heart 
                    className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-pink-500 text-pink-500' : ''}`} 
                  />
                </Button>
                {product.isNew && (
                  <Badge className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600">New</Badge>
                )}
                {product.isBestSeller && (
                  <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">Best Seller</Badge>
                )}
                {product.isOnSale && (
                  <Badge className="absolute top-2 left-2 bg-pink-500 hover:bg-pink-600">Sale {product.discount}% Off</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <Link href={`/product/${product.id}`} className="block">
                  <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">{product.name}</h3>
                </Link>
                <p className="text-muted-foreground text-sm mb-2">{product.description}</p>
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
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({product.reviews})
                  </span>
                </div>
                <div className="flex items-center">
                  {product.isOnSale && product.originalPrice ? (
                    <>
                      <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
                      <span className="text-muted-foreground line-through ml-2">${product.originalPrice.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;