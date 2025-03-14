"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingBag, Star, SlidersHorizontal } from 'lucide-react';
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

// Import the same products from featured-products for now
// In a real app, this would come from an API or database
import { featuredProducts } from '@/data/products';

const ProductGrid = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("featured");
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <p className="text-muted-foreground mb-4 sm:mb-0">
          Showing <span className="font-medium text-foreground">{products.length}</span> products
        </p>
        
        <div className="flex items-center w-full sm:w-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="mr-2 lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetTitle>Filters</SheetTitle>
              <div className="py-6">
                <h3 className="text-lg font-semibold mb-5">Filters</h3>
                <ProductFilters />
              </div>
            </SheetContent>
          </Sheet>
          
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="relative">
              <Link href={`/product/${product.id}`}>
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-foreground rounded-full"
                onClick={() => toggleFavorite(product.id)}
              >
                <Heart 
                  className={`h-5 w-5 ${favorites.includes(product.id) ? 'fill-pink-500 text-pink-500' : ''}`} 
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
    </div>
  );
};

export default ProductGrid;