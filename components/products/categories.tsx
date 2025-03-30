import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from "framer-motion";

const categories = [
  {
    id: 1,
    name: 'Skincare',
    description: 'Nourish and protect your skin',
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/product/skincare'
  },
  {
    id: 2,
    name: 'Makeup',
    description: 'Express your beauty',
    icon: '💄',
    image: 'https://images.unsplash.com/photo-1596704017254-9759879d8e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/product/makeup'
  },
  {
    id: 3,
    name: 'Haircare',
    description: 'Styles that shine',
    icon: '💇‍♀️',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/product/haircare'
  },
  {
    id: 4,
    name: 'Fragrance',
    description: 'Scents that linger',
    icon: '🌸',
    image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/product/fragrance'
  },
  {
    id: 5,
    name: 'Bath & Body',
    description: 'Pamper yourself',
    icon: '🛁',
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/product/bath-body'
  }
];

const Categories = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-primary font-medium mb-2">ค้นพบผลิตภัณฑ์ของเรา</span>
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-600">ช้อปตามหมวดหมู่</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            สำรวจผลิตภัณฑ์ความงามที่หลากหลายของเราซึ่งจัดเรียงตามหมวดหมู่เพื่อให้คุณค้นหาสิ่งที่ต้องการได้อย่างง่ายดาย
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={category.link} className="block group">
                <Card className="overflow-hidden border-0 rounded-xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/20">
                  <CardContent className="p-0 relative">
                    <div className="aspect-[3/4] relative overflow-hidden rounded-t-xl">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-3xl mb-1 inline-block">{category.icon}</span>
                      <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                      <p className="text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">{category.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Categories;