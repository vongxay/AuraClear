
const benefits = [
  {
    title: 'Natural Ingredients',
    description: 'We source the highest quality natural ingredients to create products that work in harmony with your skin.'
  },
  {
    title: 'Cruelty-Free',
    description: 'We never test on animals and are proud to be certified cruelty-free by international organizations.'
  },
  {
    title: 'Sustainable Packaging',
    description: 'Our packaging is made from recycled materials and designed to be fully recyclable or biodegradable.'
  }
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80" 
                alt="Our natural ingredients" 
                className="w-full h-[500px] object-cover"
              />
            </div>
            
            <div className="absolute bottom-8 right-8 max-w-[180px] rounded-xl bg-white p-4 shadow-lg">
              <p className="text-sm font-serif italic">
                "Our mission is to create beauty products that honor nature while delivering exceptional results."
              </p>
            </div>
            
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-cosmetic-sage/20 -z-10"></div>
          </div>
          
          <div>
            <span className="inline-block py-1 px-3 rounded-full bg-cosmetic-cream border border-cosmetic-beige text-sm mb-6">
              Our Philosophy
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
              Beauty that respects you and the planet
            </h2>
            <p className="text-muted-foreground mb-8">
              Founded in 2023, Lumière was born from a simple belief: beauty should never compromise your health or the environment. 
              We create luxurious, effective cosmetics using only clean, sustainable ingredients that honor the natural world.
            </p>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-cosmetic-sage/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="h-2 w-2 rounded-full bg-cosmetic-charcoal"></div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
