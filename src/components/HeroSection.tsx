
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background circles - decorative elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-cosmetic-rose/20 mix-blend-multiply blur-3xl animate-subtle-float" />
      <div className="absolute -bottom-60 -right-40 w-[30rem] h-[30rem] rounded-full bg-cosmetic-sage/20 mix-blend-multiply blur-3xl animate-subtle-float" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 animate-fade-in">
            <span className="inline-block py-1 px-3 rounded-full bg-cosmetic-cream border border-cosmetic-beige text-sm mb-6">
              Introducing Our New Collection
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-6">
              Natural Beauty <br/>Redefined
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Discover skincare and cosmetics formulated with pure, natural ingredients that enhance your beauty while caring for your skin.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button className="rounded-full px-8 py-6 bg-cosmetic-charcoal hover:bg-black button-hover">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="rounded-full px-8 py-6 hover:bg-cosmetic-beige/20">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="order-1 md:order-2 relative animate-fade-in-delay">
            <div className="relative rounded-[30%_70%_70%_30%/30%_39%_51%_70%] overflow-hidden h-[450px] md:h-[550px] bg-cosmetic-beige">
              <img 
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80" 
                alt="Natural cosmetic products with botanical elements" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-lg p-4 shadow-lg md:max-w-[200px] animate-scale-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center mb-2">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs font-medium">100% Vegan</span>
              </div>
              <p className="text-xs text-muted-foreground">All our products are cruelty-free and made with sustainable ingredients</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
