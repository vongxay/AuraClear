import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import ProductDetails from '@/components/product-details';
import RelatedProducts from '@/components/related-products';
import { featuredProducts } from '@/data/products';

// ใช้ type ที่ถูกต้องสำหรับ Next.js 15
interface ProductPageParams {
  id: string;
}

export async function generateStaticParams() {
  return featuredProducts.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: ProductPageParams 
}): Promise<Metadata> {
  const product = featuredProducts.find(p => p.id === params.id);
  
  if (!product) {
    return {
      title: 'Product Not Found | Aura Clear',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.name} | Aura Clear`,
    description: product.description,
  };
}

// แก้ไข type definition ให้สอดคล้องกับ Next.js 15
export default async function ProductPage({ 
  params 
}: {
  params: { id: string }
}) {
  const product = featuredProducts.find(p => p.id === params.id);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-24 mt-16">
      <ProductDetails product={product} />
      <RelatedProducts 
        currentProductId={product.id} 
        category={product.category} 
      />
    </div>
  );
}