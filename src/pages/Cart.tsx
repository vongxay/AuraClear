
import { useWishlist } from '@/contexts/WishlistContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity } = useWishlist();
  
  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast.info(`${productName} removed from cart`);
  };
  
  const handleQuantityChange = (productId: string, quantity: number) => {
    updateCartItemQuantity(productId, quantity);
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };
  
  const subtotal = calculateSubtotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-serif font-medium mb-2">Your Cart</h1>
          <p className="text-muted-foreground mb-8">
            {cartItems.length > 0
              ? `You have ${cartItems.reduce((total, item) => total + item.quantity, 0)} ${
                  cartItems.reduce((total, item) => total + item.quantity, 0) === 1 ? 'item' : 'items'
                } in your cart`
              : 'Your cart is empty'}
          </p>
          
          {cartItems.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex border-b border-cosmetic-beige pb-6">
                    <div className="w-24 h-24 bg-cosmetic-beige/10 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <Link to={`/product/${item.product.id}`} className="font-medium hover:underline">
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">{item.product.category}</p>
                        </div>
                        <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-cosmetic-beige rounded-full">
                          <button 
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                          className="text-sm text-muted-foreground hover:text-rose-500 flex items-center"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-cosmetic-beige/10 rounded-xl p-6">
                <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Free shipping on orders over $50
                    </p>
                  )}
                  <div className="border-t border-cosmetic-beige pt-3 flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button className="w-full rounded-full">
                  Proceed to Checkout
                </Button>
                
                <p className="text-sm text-center text-muted-foreground mt-4">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cosmetic-beige/20 mb-4">
                <ShoppingBag className="h-8 w-8 text-cosmetic-charcoal" />
              </div>
              <h2 className="text-2xl font-medium mb-3">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet.
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

export default Cart;
