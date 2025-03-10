import { Suspense } from 'react';
import ProductGrid from '@/components/product-grid';
import ProductFilters from '@/components/product-filters';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'Shop | Aura Clear',
  description: 'Browse our collection of premium cosmetics and clear products',
};

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-24 mt-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Shop All Products</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our complete collection of premium clear products, from skincare essentials to makeup must-haves.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <ProductFilters />
        </div>
        <Separator orientation="vertical" className="hidden lg:block" />
        <div className="lg:w-3/4">
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductGrid />
          </Suspense>
        </div>
      </div>
    </div>
  );
}