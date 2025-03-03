
import { useWishlist } from '@/contexts/WishlistContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Wishlist = () => {
  const { wishlist, clearWishlist, addToCart } = useWishlist();
  const navigate = useNavigate();
  
  const handleAddAllToCart = () => {
    if (wishlist.length > 0) {
      wishlist.forEach(product => {
        addToCart(product, 1);
      });
      toast.success('All items added to cart');
      navigate('/cart');
    } else {
      toast.error('No items in wishlist');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-medium mb-2">Your Wishlist</h1>
              <p className="text-muted-foreground">
                {wishlist.length > 0
                  ? `You have ${wishlist.length} ${wishlist.length === 1 ? 'item' : 'items'} in your wishlist`
                  : 'Your wishlist is empty'}
              </p>
            </div>
            
            {wishlist.length > 0 && (
              <div className="flex space-x-3 mt-4 md:mt-0">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={clearWishlist}
                >
                  Clear Wishlist
                </Button>
                <Button 
                  className="rounded-full"
                  onClick={handleAddAllToCart}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" /> Add All to Cart
                </Button>
              </div>
            )}
          </div>
          
          {wishlist.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {wishlist.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cosmetic-beige/20 mb-4">
                <Heart className="h-8 w-8 text-cosmetic-charcoal" />
              </div>
              <h2 className="text-2xl font-medium mb-3">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start adding your favorite products to your wishlist while browsing our collection.
              </p>
              <Link to="/">
                <Button className="rounded-full px-6">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
