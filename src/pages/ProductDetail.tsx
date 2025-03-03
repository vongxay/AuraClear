import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getProductById } from '@/data/products';
import { useWishlist } from '@/contexts/WishlistContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const [quantity, setQuantity] = useState(1);
  const { addToWishlist, removeFromWishlist, isInWishlist, addToCart } = useWishlist();
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium mb-4">Product Not Found</h1>
            <p className="mb-6">Sorry, we couldn't find the product you were looking for.</p>
            <Link to="/">
              <Button className="rounded-full px-6">Return to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} ${product.name} added to cart`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <Link to="/" className="inline-flex items-center text-sm mb-8 hover:text-cosmetic-charcoal transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to shopping
          </Link>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="rounded-xl overflow-hidden bg-cosmetic-beige/10 aspect-square">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">{product.category}</span>
              <h1 className="text-3xl md:text-4xl font-serif font-medium mt-2 mb-3">{product.name}</h1>
              <p className="text-xl font-medium mb-6">${product.price.toFixed(2)}</p>
              
              <div className="prose prose-sm mb-8">
                <p>{product.description}</p>
              </div>
              
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center border border-cosmetic-beige rounded-full">
                  <button 
                    onClick={decrementQuantity}
                    className="w-8 h-8 flex items-center justify-center"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-10 text-center">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    className="w-8 h-8 flex items-center justify-center"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-8">
                <Button 
                  className="flex-1 rounded-full py-6"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" /> Add to Bag
                </Button>
                <Button 
                  variant="outline" 
                  className={cn(
                    "rounded-full py-6",
                    isInWishlist(product.id) ? "bg-rose-50 border-rose-200 text-rose-500" : ""
                  )}
                  onClick={toggleWishlist}
                >
                  <Heart className={cn("h-4 w-4 mr-2", isInWishlist(product.id) ? "fill-rose-500" : "")} /> 
                  {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
              
              <div className="border-t border-b border-cosmetic-beige py-4 mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Details</h3>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Free of parabens, sulfates, and phthalates. Cruelty-free and vegan.
                  </p>
                </div>
              </div>
              
              <div className="border-b border-cosmetic-beige py-4 mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Shipping & Returns</h3>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Free shipping on orders over $50. Returns accepted within 30 days of purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
