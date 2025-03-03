
import { useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useWishlist, Product } from '@/contexts/WishlistContext';
import { toast } from 'sonner';

interface ProductCardProps extends Product {
  showQuickAdd?: boolean;
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  image, 
  category, 
  isNew = false,
  isFeatured = false,
  showQuickAdd = true,
  ...rest
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const product: Product = { id, name, price, image, category, isNew, isFeatured, ...rest };
  
  const toggleWishlist = () => {
    if (isInWishlist(id)) {
      removeFromWishlist(id);
      toast.info(`${name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${name} added to wishlist`);
    }
  };
  
  return (
    <div 
      className={cn(
        "group relative rounded-xl overflow-hidden transition-all duration-400",
        isFeatured ? "sm:col-span-2 md:col-span-1" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-cosmetic-beige/20">
          <img 
            src={image} 
            alt={name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-600",
              isHovered ? "scale-105" : "scale-100"
            )}
          />
          
          {/* Badges */}
          {isNew && (
            <span className="absolute top-3 left-3 py-1 px-3 bg-cosmetic-charcoal text-white text-xs rounded-full">
              New
            </span>
          )}
          
          {/* Quick Actions */}
          {showQuickAdd && (
            <div 
              className={cn(
                "absolute inset-0 bg-black/10 transition-opacity duration-300 flex items-center justify-center",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="p-2 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="bg-white hover:bg-cosmetic-beige text-cosmetic-charcoal rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toast.success(`${name} added to cart`);
                  }}
                >
                  <ShoppingBag className="h-4 w-4 mr-1" /> Quick Add
                </Button>
              </div>
            </div>
          )}
        </div>
      </Link>
      
      {/* Favorite Button */}
      <button 
        className={cn(
          "absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300",
          isInWishlist(id) ? "bg-rose-100 text-rose-500" : "bg-white/70 backdrop-blur-sm text-cosmetic-charcoal hover:bg-white"
        )}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist();
        }}
      >
        <Heart className={cn("h-4 w-4", isInWishlist(id) ? "fill-rose-500" : "")} />
      </button>
      
      {/* Product Info */}
      <div className="mt-4 space-y-1">
        <span className="text-xs text-muted-foreground">{category}</span>
        <Link to={`/product/${id}`}>
          <h3 className="font-medium hover:text-cosmetic-charcoal transition-colors">{name}</h3>
        </Link>
        <p className="font-medium">${price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
