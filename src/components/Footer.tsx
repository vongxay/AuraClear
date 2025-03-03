
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-cosmetic-beige">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-serif mb-6">AuraClear</h3>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Clean, natural cosmetics for conscious beauty lovers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-cosmetic-cream flex items-center justify-center hover:bg-cosmetic-beige transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-cosmetic-cream flex items-center justify-center hover:bg-cosmetic-beige transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-cosmetic-cream flex items-center justify-center hover:bg-cosmetic-beige transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover-lift">All Products</a></li>
              <li><a href="#" className="text-muted-foreground hover-lift">Skincare</a></li>
              <li><a href="#" className="text-muted-foreground hover-lift">Makeup</a></li>
              <li><a href="#" className="text-muted-foreground hover-lift">Fragrance</a></li>
              <li><a href="#" className="text-muted-foreground hover-lift">Gift Sets</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">About</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover-lift">Our Story</a></li>
              <li><a href="#" className="text-muted-foreground hover-lift">Ingredients</a></li>
              <li><a href="#" className="text-muted-foreground hover-lift">Sustainability</a></li>
              <li><a href="#" className="text-muted-foreground hover-lift">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover-lift">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Help</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover-lift">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover-lift">FAQs</a></li>
              <li><a href="#" className="text-muted-foreground hover-lift">Shipping & Returns</a></li>
              <li><a href="#" className="text-muted-foreground hover-lift">Track Order</a></li>
              <li><a href="#" className="text-muted-foreground hover-lift">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-cosmetic-beige text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Lumière Beauty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
