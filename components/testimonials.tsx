"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Emma Johnson',
    role: 'Skincare Enthusiast',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    quote: 'The Hydrating Facial Serum completely transformed my skincare routine. My skin has never felt so nourished and radiant!',
    rating: 5
  },
  {
    id: 2,
    name: 'Sophia Chen',
    role: 'Makeup Artist',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    quote: 'As a professional makeup artist, I\'m very particular about the products I use. The Matte Lipstick Collection exceeds all my expectations with its long-lasting formula and stunning color payoff.',
    rating: 5
  },
  {
    id: 3,
    name: 'Michael Rodriguez',
    role: 'Regular Customer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    quote: 'I bought the Rose & Vanilla Perfume for my wife\'s birthday, and she absolutely loves it. The scent is elegant and lasts all day. Will definitely be shopping here again!',
    rating: 4
  },
  {
    id: 4,
    name: 'Olivia Taylor',
    role: 'Clear Blogger',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    quote: 'I\'ve reviewed countless clear products on my blog, and Aura Clear consistently delivers premium quality. The Vitamin C Brightening Cream has become a staple in my morning routine.',
    rating: 5
  },
  {
    id: 5,
    name: 'James Wilson',
    role: 'First-time Customer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    quote: 'The Exfoliating Body Scrub was my first purchase from Aura Clear, and I\'m impressed by the quality. My skin feels incredibly smooth after just one use.',
    rating: 4
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      changeTestimonial((activeIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay, activeIndex]);

  const changeTestimonial = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  const handleDotClick = (index: number) => {
    changeTestimonial(index);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Read testimonials from our satisfied customers who have experienced the quality and effectiveness of our products.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div
            className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="shrink-0">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden">
                      <Image
                        src={testimonials[activeIndex].image}
                        alt={testimonials[activeIndex].name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex justify-center md:justify-start mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonials[activeIndex].rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <blockquote className="text-xl italic mb-4">
                      &quot;{testimonials[activeIndex].quote}&quot;
                    </blockquote>
                    <div>
                      <p className="font-semibold text-lg">{testimonials[activeIndex].name}</p>
                      <p className="text-muted-foreground">{testimonials[activeIndex].role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeIndex === index
                    ? 'bg-primary scale-125'
                    : 'bg-muted-foreground/30'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;