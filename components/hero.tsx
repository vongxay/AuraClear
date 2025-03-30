"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const heroSlides = [
  {
    id: 1,
    title: "Discover Your Natural Radiance",
    subtitle: "Premium skincare products for your daily routine",
    cta: "Shop Skincare",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    link: "/product/skincare"
  },
  {
    id: 2,
    title: "Express Your Clear",
    subtitle: "Makeup essentials for every occasion",
    cta: "Shop Makeup",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    link: "/product/makeup"
  },
  {
    id: 3,
    title: "Luxurious Fragrances",
    subtitle: "Scents that leave a lasting impression",
    cta: "Shop Fragrances",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    link: "/product/fragrance"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const [showPromotion, setShowPromotion] = useState(true);
  const [showBottomBanner, setShowBottomBanner] = useState(true);

  useEffect(() => {
    const mainInterval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setFadeIn(true);
        setProgress(0);
      }, 500);
    }, 6000);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + (100 / 60), 100));
    }, 60);

    return () => {
      clearInterval(mainInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <>
      <div className="relative h-[50vh] md:h-screen w-full overflow-hidden">
        {/* Floating Promotion */}
        {showPromotion && (
          <div className="fixed top-24 right-4 md:right-8 z-50 max-w-xs bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-xl p-4 text-white animate-bounce-slow">
            <button 
              onClick={() => setShowPromotion(false)}
              className="absolute top-2 right-2 text-white/80 hover:text-white"
              aria-label="Close promotion"
            >
              <X size={18} />
            </button>
            <div className="mb-2">
              <span className="bg-white text-purple-600 text-xs font-bold px-2 py-1 rounded-full">โปรโมชั่นพิเศษ</span>
            </div>
            <h3 className="font-bold text-lg mb-1">ลด 30% สำหรับลูกค้าใหม่</h3>
            <p className="text-sm mb-3">ใช้โค้ด NEWCLEAR30 เมื่อสั่งซื้อครั้งแรก</p>
            <Button 
              size="sm" 
              className="w-full bg-white text-purple-600 hover:bg-white/90"
              asChild
            >
              <a href="/promotion">รับสิทธิ์เลย</a>
            </Button>
          </div>
        )}

        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className={`object-cover transition-all duration-1000 ${fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-105'} ${isSwiping ? 'transition-none' : ''}`}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.4))]" />
        </div>

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <div 
            key={slide.id}
            className={`max-w-xl text-white transition-all duration-500 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{slide.title}</h1>
            <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
            <Button 
                size="lg" 
                asChild 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 transition-all hover:scale-105 text-white"
              >
              <a href={slide.link}>{slide.cta}</a>
            </Button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onPointerDown={(e) => {
                setIsSwiping(true);
                setStartX(e.clientX);
              }}
              onPointerUp={(e) => {
                const deltaX = e.clientX - startX;
                if (Math.abs(deltaX) > 50) {
                  setFadeIn(false);
                  setTimeout(() => {
                    setCurrentSlide(prev => deltaX > 0 ? (prev - 1 + heroSlides.length) % heroSlides.length : (prev + 1) % heroSlides.length);
                    setFadeIn(true);
                  }, 200);
                }
                setIsSwiping(false);
              }}
              className="relative group flex-1 h-1 mx-1 rounded-full overflow-hidden bg-white/20"
              aria-label={`Slide ${index + 1}`}
            >
              <div
                className={`absolute left-0 top-0 h-full bg-white transition-all duration-500 ease-out ${currentSlide === index ? 'w-full' : 'w-0'}`}
                style={currentSlide === index ? { width: `${progress}%` } : {}}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Sticky Banner */}
      {showBottomBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-pink-600 to-purple-700 p-3 z-50 flex items-center justify-between hidden md:flex">
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <span className="animate-pulse inline-block bg-white p-2 rounded-full">
                <span className="block h-6 w-6 bg-pink-500 rounded-full"></span>
              </span>
            </div>
            <div className="text-white">
              <p className="font-bold text-sm md:text-base">พิเศษ! ส่วนลด 50% สำหรับสินค้า Premium เมื่อซื้อครบ 2,000 บาท</p>
              <p className="text-xs md:text-sm text-white/80">เฉพาะวันนี้ - วันอาทิตย์นี้เท่านั้น</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              className="bg-white text-purple-600 hover:bg-white/90"
              asChild
            >
              <a href="/special-sale">ซื้อเลย</a>
            </Button>
            <button 
              onClick={() => setShowBottomBanner(false)}
              className="p-1 text-white/80 hover:text-white rounded"
              aria-label="Close banner"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;