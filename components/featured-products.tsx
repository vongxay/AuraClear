"use client";

import { useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { featuredProducts } from '@/data/products';
import ProductCard from '@/components/products/product-card';

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const toggleFavorite = useCallback((productId: string) => {
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;
    
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
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
  }, [addToWishlist, isInWishlist, removeFromWishlist, toast]);

  const handleAddToCart = useCallback((product: Product) => {
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
  }, [addToCart, toast]);

  const sectionTitle = useMemo(() => (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Discover our most popular and trending clear products, carefully selected for exceptional quality and results.
      </p>
    </div>
  ), []);

  // Only mark the first few products as priority for faster loading
  const productItems = useMemo(() => 
    featuredProducts.map((product, index) => (
      <ProductCard
        key={product.id}
        product={product}
        isInWishlist={isInWishlist(product.id)}
        onToggleFavorite={toggleFavorite}
        onAddToCart={handleAddToCart}
        variant="featured"
        index={index}
      />
    )), 
    [isInWishlist, toggleFavorite, handleAddToCart]
  );

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {sectionTitle}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {productItems}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/product">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default memo(FeaturedProducts);