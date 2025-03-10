import Hero from '@/components/hero';
import FeaturedProducts from '@/components/featured-products';
import Categories from '@/components/categories';
import Testimonials from '@/components/testimonials';
import Newsletter from '@/components/newsletter';

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Testimonials />
      <Newsletter />
    </div>
  );
}