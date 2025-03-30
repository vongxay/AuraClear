import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    id: 1,
    name: 'Skincare',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/product/skincare'
  },
  {
    id: 2,
    name: 'Makeup',
    image: 'https://images.unsplash.com/photo-1596704017254-9759879d8e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/product/makeup'
  },
  {
    id: 3,
    name: 'Haircare',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/product/haircare'
  },
  {
    id: 4,
    name: 'Fragrance',
    image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/product/fragrance'
  },
  {
    id: 5,
    name: 'Bath & Body',
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/product/bath-body'
  }
];

const Categories = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of beauty products organized by category to find exactly what you&lsquo;re looking for.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={category.link} className="block group">
              <Card className="overflow-hidden border-0 shadow-md transition-all duration-300 group-hover:shadow-lg">
                <CardContent className="relative">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Categories;