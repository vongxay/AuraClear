"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'Skincare',
    description: 'Nourish and protect your skin',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/product/skincare',
    items: 42
  },
  {
    id: 2,
    name: 'Makeup',
    description: 'Express your unique beauty',
    image: 'https://images.unsplash.com/photo-1596704017254-9759879d8e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/product/makeup',
    items: 38
  },
  {
    id: 3,
    name: 'Haircare',
    description: 'For gorgeous, healthy hair',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/product/haircare',
    items: 26
  },
  {
    id: 4,
    name: 'Fragrance',
    description: 'Scents that leave an impression',
    image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/product/fragrance',
    items: 19
  },
  {
    id: 5,
    name: 'Bath & Body',
    description: 'Luxurious self-care essentials',
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/product/bath-body',
    items: 31
  }
];

const MotionLink = motion(Link);
const MotionCard = motion(Card);

const Categories = () => {
  return (
    <section id="categories" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-pink-50/30 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-pink-100 text-pink-800 hover:bg-pink-200 transition-colors rounded-full">Collections</Badge>
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Discover Your Beauty Essentials</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explore our carefully curated collection of premium beauty products designed to enhance your natural beauty.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {categories.map((category, index) => (
            <MotionLink 
              key={category.id} 
              href={category.link} 
              className="block group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <MotionCard className="overflow-hidden rounded-xl border border-pink-100/50 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-pink-200/20 h-full"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CardContent className="relative p-0">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 z-0"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.8 }}
                    >
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                        priority
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xl font-bold">{category.name}</h3>
                      <Badge className="bg-white/20 backdrop-blur-sm text-white text-xs">{category.items} items</Badge>
                    </div>
                    <p className="text-white/80 text-sm mb-3">{category.description}</p>
                    <div className="flex items-center text-xs font-medium text-white/90 group-hover:text-white transition-colors">
                      <span>Shop now</span>
                      <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </CardContent>
              </MotionCard>
            </MotionLink>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Categories;