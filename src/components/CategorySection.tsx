
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'skincare',
    name: 'Skincare',
    description: 'Nourish your skin with our gentle, effective formulas',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
    color: 'bg-cosmetic-sage/20',
    hoverColor: 'group-hover:bg-cosmetic-sage/30'
  },
  {
    id: 'makeup',
    name: 'Makeup',
    description: 'Express yourself with our range of clean beauty products',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
    color: 'bg-cosmetic-rose/20',
    hoverColor: 'group-hover:bg-cosmetic-rose/30'
  },
  {
    id: 'fragrance',
    name: 'Fragrance',
    description: 'Discover scents that complement your unique personality',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
    color: 'bg-cosmetic-beige/30',
    hoverColor: 'group-hover:bg-cosmetic-beige/40'
  }
];

const CategorySection = () => {
  return (
    <section id="categories" className="py-20 bg-cosmetic-cream/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">
            Shop By Category
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore our consciously crafted collections for all your beauty needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`group relative rounded-2xl overflow-hidden transition-all duration-400 hover:shadow-xl ${
                index === 0 ? 'animate-fade-in' : 
                index === 1 ? 'animate-fade-in' : 
                'animate-fade-in'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`absolute inset-0 ${category.color} ${category.hoverColor} transition-colors duration-400`}></div>
              
              <div className="relative z-10 p-8 h-full flex flex-col">
                <h3 className="text-2xl font-serif font-medium mb-2">{category.name}</h3>
                <p className="text-muted-foreground mb-6">{category.description}</p>
                
                <div className="rounded-xl overflow-hidden mb-6 mt-auto">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                <a 
                  href={`#${category.id}`} 
                  className="inline-flex items-center text-sm font-medium transition-all duration-300 group-hover:translate-x-1"
                >
                  Explore Collection
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
