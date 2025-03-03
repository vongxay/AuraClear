
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Successfully subscribed",
        description: "Thank you for joining our newsletter!",
      });
      
      setEmail('');
      
      // Reset success state after a delay
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1000);
  };

  return (
    <section id="contact" className="relative py-20 bg-cosmetic-cream/50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-cosmetic-rose/10 mix-blend-multiply blur-3xl"></div>
      <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-cosmetic-sage/10 mix-blend-multiply blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">
            Join Our Community
          </h2>
          <p className="text-muted-foreground">
            Subscribe to receive updates, exclusive offers and beauty tips delivered to your inbox.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-full py-6 pl-6 pr-12 bg-white border-cosmetic-beige focus-visible:ring-cosmetic-charcoal"
                disabled={isSubmitting || isSuccess}
              />
              {isSuccess && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                  <Check className="h-5 w-5" />
                </span>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full rounded-full py-6 bg-cosmetic-charcoal hover:bg-black button-hover"
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
          
          <p className="mt-4 text-xs text-center text-muted-foreground">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
