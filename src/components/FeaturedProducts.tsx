
import { useState } from 'react';
import ProductCard from './ProductCard';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '@/data/products';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Skincare', 'Makeup', 'Fragrance', 'Bath & Body'];
  
  // Filter products based on selected category
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);
  
  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-xl">
              Our most popular products, carefully formulated for your beauty needs.
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-cosmetic-beige hover:bg-cosmetic-beige/20"
              aria-label="Previous product"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-cosmetic-beige hover:bg-cosmetic-beige/20"
              aria-label="Next product"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Categories Filter */}
        <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category}
                className={`py-2 px-4 rounded-full whitespace-nowrap text-sm transition-colors ${
                  activeCategory === category 
                    ? 'bg-cosmetic-charcoal text-white' 
                    : 'bg-cosmetic-cream hover:bg-cosmetic-beige'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/wishlist">
            <Button className="rounded-full px-8 py-6 button-hover">
              View Your Wishlist
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
