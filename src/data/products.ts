
import { Product } from '../contexts/WishlistContext';

export const products: Product[] = [
  {
    id: '1',
    name: 'Hydrating Facial Serum',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1617602269951-bad67102df61?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
    category: 'Skincare',
    description: 'Our bestselling hydrating facial serum is packed with hyaluronic acid and vitamin E to deeply moisturize and rejuvenate your skin. Perfect for all skin types, this lightweight formula absorbs quickly without leaving any greasy residue.',
    isNew: true,
    isFeatured: true
  },
  {
    id: '2',
    name: 'Nourishing Night Cream',
    price: 38.50,
    image: 'https://images.unsplash.com/photo-1571781565036-d3f759be73e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
    category: 'Skincare',
    description: 'This rich, luxurious night cream works while you sleep to repair and restore your skin. Formulated with retinol, peptides, and natural oils to reduce fine lines and improve skin texture by morning.',
    isNew: false
  },
  {
    id: '3',
    name: 'Volumizing Mascara',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
    category: 'Makeup',
    description: 'Get dramatic lashes with our volumizing mascara. The unique brush separates and coats each lash for clump-free volume that lasts all day without smudging or flaking.',
    isNew: false
  },
  {
    id: '4',
    name: 'Matte Lipstick Collection',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
    category: 'Makeup',
    description: 'Our long-lasting matte lipsticks provide rich, intense color that stays put for hours. Available in ten stunning shades, these lipsticks are formulated with moisturizing ingredients to keep your lips soft and comfortable.',
    isNew: true
  },
  {
    id: '5',
    name: 'Rose Gold Highlighter',
    price: 28.50,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
    category: 'Makeup',
    description: 'Add a radiant glow to your complexion with our rose gold highlighter. The finely milled powder applies smoothly for a natural-looking luminosity that catches the light beautifully.',
    isNew: true
  },
  {
    id: '6',
    name: 'Detoxifying Clay Mask',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1567721913486-6585f069b332?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
    category: 'Skincare',
    description: 'This powerful clay mask draws out impurities and excess oil while minimizing the appearance of pores. Enriched with charcoal and tea tree oil, it leaves your skin feeling deeply cleansed and refreshed.',
    isNew: false
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};
