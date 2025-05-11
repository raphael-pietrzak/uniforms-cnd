import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { Product } from '../../types';
import AddProductModal from '../../components/admin/AddProductModal';
import { productsApi } from '../../services/api';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyOutOfStock, setShowOnlyOutOfStock] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Charger les produits au montage du composant
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
      console.error('Erreur lors du chargement des produits:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleProductStatus = async (productId: string) => {
    try {
      // Trouver le produit actuel
      const product = products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Produit non trouvé');
      }

      // Mettre à jour le statut
      const updatedProduct = {
        ...product,
        inStock: !product.inStock
      };

      // Appeler l'API pour mettre à jour
      await productsApi.update(updatedProduct);
      
      // Mettre à jour l'état local
      setProducts(products.map(p => p.id === productId ? updatedProduct : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
      console.error('Erreur lors de la mise à jour du statut:', err);
    }
  };
  
  const handleAddProduct = async (newProduct: Product) => {
    try {
      const createdProduct = await productsApi.create(newProduct);
      setProducts([...products, createdProduct]);
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
      console.error('Erreur lors de l\'ajout du produit:', err);
    }
  };

  const filteredProducts = products.filter((product) => {
    // Filter by search term
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by stock status if enabled
    const matchesStock = showOnlyOutOfStock ? !product.inStock : true;
    
    return matchesSearch && matchesStock;
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Produits</h1>
        <Button
          variant="primary"
          className="flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} className="mr-2" />
          Ajouter un Nouveau Produit
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="w-full md:w-80">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Rechercher des produits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  fullWidth
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <div className="mr-3 text-sm font-medium text-gray-700">
                  Afficher uniquement les ruptures de stock
                </div>
                <div 
                  className={`relative w-12 h-6 transition-colors duration-200 ease-in-out rounded-full ${
                    showOnlyOutOfStock ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  onClick={() => setShowOnlyOutOfStock(!showOnlyOutOfStock)}
                >
                  <div 
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                      showOnlyOutOfStock ? 'transform translate-x-6' : ''
                    }`}
                  ></div>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center p-8">
            <p className="text-gray-600">Chargement des produits...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tailles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    État
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Aucun produit trouvé
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleProductStatus(product.id)}
                          className="flex items-center text-sm"
                        >
                          {product.inStock ? (
                            <>
                              <span className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></span>
                              <span className="text-green-800">En Stock</span>
                            </>
                          ) : (
                            <>
                              <span className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></span>
                              <span className="text-red-800">Rupture de Stock</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.price.toFixed(2)}&nbsp;€
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.map((size) => (
                            <span key={size} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {size}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={product.condition === 'new' ? 'primary' : 'warning'}>
                          {product.condition === 'new' ? 'Neuf' : 'Occasion'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={18} />
                          </Link>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modal pour ajouter un produit */}
      <AddProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
      />
    </div>
  );
};

export default ProductsPage;