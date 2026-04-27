import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/shop/ProductCard';
import ProductFilters from '../components/shop/ProductFilters';
import { Product } from '../types';
import { Grid, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShopPage: React.FC = () => {
  const { products } = useShop();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>('default');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleFilterChange = (filters: any) => {
    let filtered = [...products];

    // Apply search query filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      );
    }

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

    // Filter by size - maintenant utilise l'inventaire
    if (filters.size) {
      filtered = filtered.filter(product => 
        product.inventory.some(item => item.size === filters.size)
      );
    }

    // Filter by brand
    if (filters.brand) {
      const brandLower = filters.brand.toLowerCase();
      filtered = filtered.filter(product => 
        product.brand.toLowerCase().includes(brandLower)
      );
    }

    // Filter by stock status
    if (filters.inStock === true) {
      filtered = filtered.filter(product => 
        product.inventory.some(item => item.quantity > 0)
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
    // Ne garder que les produits qui ont au moins une taille disponible en stock
    const productsInStock = products.filter(product => 
      product.inventory.some(item => item.quantity > 0)
    );
    setFilteredProducts(productsInStock);
  }, [products]);

  return (
    <div className="animate-rise max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <h1 className="mb-4 text-4xl font-bold text-[#1b2430]">Boutique d'Uniformes Scolaires</h1>

        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          {/* Search Bar - Integrated before filters */}
          <div className="mb-4 md:mb-0">
            <div className="relative max-w-md mx-auto md:mx-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleFilterChange({});
                }}
                placeholder="Rechercher des produits..."
                className="w-full rounded-xl border border-[#133b63]/15 bg-white/80 py-2.5 pl-4 pr-10 text-sm text-slate-700 shadow-sm focus:border-[#133b63]/40 focus:outline-none focus:ring-2 focus:ring-[#133b63]/20"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Search size={16} className="text-slate-400" />
              </div>
            </div>
          </div>


          {/* Filters Toggle Button - Redesigned to be more discreet */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-1 rounded-xl border border-[#133b63]/15 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors hover:bg-white"
          >
            {showFilters ? (
              <>
                <X size={16} />
                <span>Masquer</span>
              </>
            ) : (
              <>
                <SlidersHorizontal size={16} />
                <span>Filtres</span>
              </>
            )}
          </button>
        </div>

      </div>


      {/* Filters - Conditionally rendered */}
      <div className={`mb-6 ${showFilters ? 'block' : 'hidden'}`}>
        <ProductFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Toolbar */}
      <div className="surface-panel mb-6 flex flex-col items-start justify-between space-y-4 p-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <p className="text-slate-600">
            Affichage de <span className="font-medium">{filteredProducts.length}</span> produits
          </p>
        </div>

        <div className="flex space-x-4 items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Trier par :</span>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-xl border border-[#133b63]/15 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
            >
              <option value="default">Par défaut</option>
              <option value="price-asc">Prix : Croissant</option>
              <option value="price-desc">Prix : Décroissant</option>
              <option value="name-asc">Nom : A à Z</option>
              <option value="name-desc">Nom : Z à A</option>
            </select>
          </div>

          <div className="flex overflow-hidden rounded-xl border border-[#133b63]/15">
            <button
              onClick={() => setView('grid')}
              className={`p-2 ${
                view === 'grid' ? 'bg-[#133b63]/10 text-[#133b63]' : 'bg-white text-slate-600'
              }`}
              title="Vue en grille"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 ${
                view === 'list' ? 'bg-[#133b63]/10 text-[#133b63]' : 'bg-white text-slate-600'
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
          <p className="text-lg text-slate-500">Aucun produit ne correspond à vos critères.</p>
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
            <Link key={product.id} to={`/product/${product.id}`} className="block">
              <div className="surface-panel flex overflow-hidden rounded-2xl transition-shadow hover:shadow-lg">
                <div className="w-40 h-40 flex-shrink-0">
                  <img
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4">
                  <h3 className="text-lg font-semibold text-slate-800">{product.name}</h3>
                  <p className="text-sm text-slate-500">{product.brand}</p>
                  <p className="mt-2 line-clamp-2 text-slate-600">{product.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-bold text-[#133b63]">{Number(product.price).toFixed(2)}&nbsp;€</span>
                    <div className="flex space-x-1">
                      {/* Afficher les tailles disponibles (avec stock > 0) */}
                      {product.inventory
                        .filter(item => item.quantity > 0)
                        .slice(0, 3)
                        .map((item) => (
                          <span key={item.size} className="rounded-full bg-[#1d7a72]/12 px-2 py-1 text-xs font-semibold text-[#16645d]">
                            {item.size}
                          </span>
                        ))}
                      {product.inventory.length > 3 && (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">+{product.inventory.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;