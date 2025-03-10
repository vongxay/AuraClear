import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-2xl font-bold mb-4 inline-block">
              Aura<span className="text-pink-500">Clear</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Premium cosmetics for the modern woman. Discover clear products that enhance your natural radiance.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop/skincare" className="text-muted-foreground hover:text-foreground transition-colors">
                  Skincare
                </Link>
              </li>
              <li>
                <Link href="/shop/makeup" className="text-muted-foreground hover:text-foreground transition-colors">
                  Makeup
                </Link>
              </li>
              <li>
                <Link href="/shop/haircare" className="text-muted-foreground hover:text-foreground transition-colors">
                  Haircare
                </Link>
              </li>
              <li>
                <Link href="/shop/fragrance" className="text-muted-foreground hover:text-foreground transition-colors">
                  Fragrance
                </Link>
              </li>
              <li>
                <Link href="/shop/bath-body" className="text-muted-foreground hover:text-foreground transition-colors">
                  Bath & Body
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-muted-foreground hover:text-foreground transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">
                  123 Clear Lane, Cosmetic City, 90210
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">hello@auraclear.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Aura Clear. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/shipping-returns" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Shipping & Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;