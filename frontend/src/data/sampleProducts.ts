import { Product } from '../types';

export const sampleProducts: Product[] = [
  {
    id: 'product-1',
    name: 'School Logo Polo Shirt',
    description: 'Classic polo shirt with embroidered school logo. Made from durable cotton blend fabric.',
    price: 15.99,
    sizes: ['S', 'M', 'L', 'XL'],
    condition: 'new',
    brand: 'SchoolWear',
    gender: 'unisex',
    images: [
      'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    inStock: true,
    category: 'tops'
  },
  {
    id: 'product-2',
    name: 'Pleated Skirt',
    description: 'Navy blue pleated skirt with adjustable waist. Perfect for everyday school wear.',
    price: 24.99,
    sizes: ['S', 'M', 'L'],
    condition: 'new',
    brand: 'SchoolWear',
    gender: 'girls',
    images: [
      'https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    inStock: true,
    category: 'bottoms'
  },
  {
    id: 'product-3',
    name: 'Chino Trousers',
    description: 'Comfortable chino trousers in navy blue. Perfect for school uniform.',
    price: 29.99,
    sizes: ['S', 'M', 'L', 'XL'],
    condition: 'new',
    brand: 'SchoolWear',
    gender: 'boys',
    images: [
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    inStock: true,
    category: 'bottoms'
  },
  {
    id: 'product-4',
    name: 'School Cardigan',
    description: 'Warm navy blue cardigan with school logo. Perfect for cooler days.',
    price: 34.99,
    sizes: ['S', 'M', 'L'],
    condition: 'used',
    brand: 'SchoolWear',
    gender: 'unisex',
    images: [
      'https://images.pexels.com/photos/6501787/pexels-photo-6501787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/6501787/pexels-photo-6501787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    inStock: true,
    category: 'outerwear'
  },
  {
    id: 'product-5',
    name: 'School Blazer',
    description: 'Formal navy blue blazer with school crest. Required for formal school events.',
    price: 59.99,
    sizes: ['S', 'M', 'L', 'XL'],
    condition: 'new',
    brand: 'PremiumSchoolWear',
    gender: 'unisex',
    images: [
      'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    inStock: true,
    category: 'outerwear'
  },
  {
    id: 'product-6',
    name: 'PE T-Shirt',
    description: 'Breathable sports t-shirt with school logo. Perfect for physical education classes.',
    price: 12.99,
    sizes: ['S', 'M', 'L', 'XL'],
    condition: 'new',
    brand: 'SportWear',
    gender: 'unisex',
    images: [
      'https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    inStock: true,
    category: 'sportswear'
  }
];