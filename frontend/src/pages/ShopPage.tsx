import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/shop/ProductCard';
import ProductFilters from '../components/shop/ProductFilters';
import { Product } from '../types';
import { Grid, List, ArrowUpDown, SlidersHorizontal, X } from 'lucide-react';

const ShopPage: React.FC = () => {
  const { products } = useShop();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>('default');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const handleFilterChange = (filters: any) => {
    let filtered = [...products];

    // Filter by gender
    if (filters.gender) {
      filtered = filtered.filter(product => product.gender === filters.gender);
    }

    // Filter by condition
    if (filters.condition) {
      filtered = filtered.filter(product => product.condition === filters.condition);
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Filter by price range
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice));
    }

    // Filter by size
    if (filters.size) {
      filtered = filtered.filter(product => product.sizes.includes(filters.size));
    }

    // Filter by brand
    if (filters.brand) {
      const brandLower = filters.brand.toLowerCase();
      filtered = filtered.filter(product => 
        product.brand.toLowerCase().includes(brandLower)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    let sorted = [...filteredProducts];

    switch (option) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // No sorting (default order)
        sorted = [...products];
        break;
    }

    setFilteredProducts(sorted);
  };

  // Initialize filtered products
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Boutique d'Uniformes Scolaires</h1>

        {/* Filters Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
        >
          {showFilters ? (
            <>
              <X size={18} />
              <span>Masquer les filtres</span>
            </>
          ) : (
            <>
              <SlidersHorizontal size={18} />
              <span>Afficher les filtres</span>
            </>
          )}
        </button>
      </div>

      {/* Filters - Conditionally rendered */}
      <div className={`mb-6`}>
      {showFilters && <ProductFilters onFilterChange={handleFilterChange} 
      />}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <p className="text-gray-600">
            Affichage de <span className="font-medium">{filteredProducts.length}</span> produits
          </p>
        </div>

        <div className="flex space-x-4 items-center">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm">Trier par :</span>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border rounded-md p-1 text-sm outline-none"
            >
              <option value="default">Par défaut</option>
              <option value="price-asc">Prix : Croissant</option>
              <option value="price-desc">Prix : Décroissant</option>
              <option value="name-asc">Nom : A à Z</option>
              <option value="name-desc">Nom : Z à A</option>
            </select>
          </div>

          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-2 ${
                view === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'
              }`}
              title="Vue en grille"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 ${
                view === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'
              }`}
              title="Vue en liste"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid or List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun produit ne correspond à vos critères.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="flex border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="w-40 h-40 flex-shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-4">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-500 text-sm">{product.brand}</p>
                <p className="mt-2 text-gray-600 line-clamp-2">{product.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-blue-900 font-bold">{Number(product.price).toFixed(2)}&nbsp;€</span>
                  <div className="flex space-x-1">
                    {product.sizes.slice(0, 3).map((size) => (
                      <span key={size} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {size}
                      </span>
                    ))}
                    {product.sizes.length > 3 && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">+{product.sizes.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;