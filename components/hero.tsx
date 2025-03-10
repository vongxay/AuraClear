"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const heroSlides = [
  {
    id: 1,
    title: "Discover Your Natural Radiance",
    subtitle: "Premium skincare products for your daily routine",
    cta: "Shop Skincare",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    link: "/shop/skincare"
  },
  {
    id: 2,
    title: "Express Your Clear",
    subtitle: "Makeup essentials for every occasion",
    cta: "Shop Makeup",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    link: "/shop/makeup"
  },
  {
    id: 3,
    title: "Luxurious Fragrances",
    subtitle: "Scents that leave a lasting impression",
    cta: "Shop Fragrances",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    link: "/shop/fragrance"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setFadeIn(true);
      }, 500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          priority
          className={`object-cover transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div 
          key={slide.id}
          className={`max-w-xl text-white transition-all duration-500 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
          <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
          <Button size="lg" asChild className="bg-pink-500 hover:bg-pink-600 text-white">
            <a href={slide.link}>{slide.cta}</a>
          </Button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setFadeIn(false);
              setTimeout(() => {
                setCurrentSlide(index);
                setFadeIn(true);
              }, 500);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;