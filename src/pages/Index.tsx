
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategorySection from "@/components/CategorySection";
import AboutSection from "@/components/AboutSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <CategorySection />
        <AboutSection />
        <Newsletter />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
