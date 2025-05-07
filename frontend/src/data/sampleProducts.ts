import { Product } from '../types';

export const sampleProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Polo avec Logo de l\'École',
    description: 'Polo classique avec logo de l\'école brodé. Fabriqué à partir de tissu durable en mélange de coton.',
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
    name: 'Jupe Plissée',
    description: 'Jupe plissée bleu marine avec taille ajustable. Parfaite pour l\'usage quotidien à l\'école.',
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
    name: 'Pantalon Chino',
    description: 'Pantalon chino confortable en bleu marine. Parfait pour l\'uniforme scolaire.',
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
    name: 'Cardigan Scolaire',
    description: 'Cardigan chaud bleu marine avec logo de l\'école. Parfait pour les journées fraîches.',
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
    name: 'Blazer Scolaire',
    description: 'Blazer formel bleu marine avec écusson de l\'école. Obligatoire pour les événements scolaires formels.',
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
    name: 'T-shirt d\'EPS',
    description: 'T-shirt respirant de sport avec logo de l\'école. Parfait pour les cours d\'éducation physique.',
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