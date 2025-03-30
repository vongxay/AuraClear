import { Metadata } from 'next';
import Hero from '@/components/hero';
import FeaturedProducts from '@/components/featured-products';
import Categories from '@/components/categories';
import Testimonials from '@/components/testimonials';
import Newsletter from '@/components/newsletter';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PromotionShowcase from '@/components/promotion-showcase';

export const metadata: Metadata = {
  title: 'AuraClear - Premium Cosmetics',
  description: 'ค้นพบเครื่องสำอางและผลิตภัณฑ์ดูแลผิวระดับพรีเมียมที่ AuraClear',
};

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <Testimonials />
      <Newsletter />
    </div>
  );
}