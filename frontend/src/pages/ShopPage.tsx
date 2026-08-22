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
    <div className="animate-rise mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold text-ink md:text-3xl">Boutique d'Uniformes Scolaires</h1>

        <div className="flex w-full items-center gap-3 md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleFilterChange({});
              }}
              placeholder="Rechercher des produits..."
              className="w-full rounded-lg border border-line bg-surface py-2.5 pl-4 pr-10 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search size={16} className="text-ink-faint" />
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink transition-colors hover:bg-canvas"
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
      <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-line bg-surface p-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-ink-muted">
            Affichage de <span className="font-medium text-ink">{filteredProducts.length}</span> produits
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-ink-muted">Trier par :</span>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none"
            >
              <option value="default">Par défaut</option>
              <option value="price-asc">Prix : Croissant</option>
              <option value="price-desc">Prix : Décroissant</option>
              <option value="name-asc">Nom : A à Z</option>
              <option value="name-desc">Nom : Z à A</option>
            </select>
          </div>

          <div className="flex overflow-hidden rounded-lg border border-line">
            <button
              onClick={() => setView('grid')}
              className={`p-2 ${
                view === 'grid' ? 'bg-accent-soft text-accent' : 'bg-surface text-ink-muted'
              }`}
              title="Vue en grille"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 ${
                view === 'list' ? 'bg-accent-soft text-accent' : 'bg-surface text-ink-muted'
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
          <p className="text-lg text-ink-muted">Aucun produit ne correspond à vos critères.</p>
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
              <div className="flex overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-ink/20">
                <div className="h-40 w-40 flex-shrink-0 bg-canvas">
                  <img
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4">
                  <h3 className="text-base font-semibold text-ink">{product.name}</h3>
                  <p className="text-sm text-ink-muted">{product.brand}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{product.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-semibold text-ink">{Number(product.price).toFixed(2)}&nbsp;€</span>
                    <div className="flex space-x-1">
                      {/* Afficher les tailles disponibles (avec stock > 0) */}
                      {product.inventory
                        .filter(item => item.quantity > 0)
                        .slice(0, 3)
                        .map((item) => (
                          <span key={item.size} className="rounded-md bg-canvas px-2 py-1 text-xs font-medium text-ink-muted">
                            {item.size}
                          </span>
                        ))}
                      {product.inventory.length > 3 && (
                        <span className="rounded-md bg-canvas px-2 py-1 text-xs font-medium text-ink-muted">+{product.inventory.length - 3}</span>
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