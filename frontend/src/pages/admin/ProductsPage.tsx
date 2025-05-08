import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, ToggleLeft, ToggleRight, Search, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { productsApi } from '../../services/api';
import { Product } from '../../types';

// Composant Modal pour l'ajout de produit
const AddProductModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (product: Product) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    brand: '',
    category: '',
    sizes: [] as string[],
    condition: 'new',
    gender: 'unisex',
    images: ['https://placehold.co/600x400?text=Ajouter+une+image'],
    inStock: true
  });
  const [sizesInput, setSizesInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newProduct = await productsApi.create(formData);
      onAdd(newProduct);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSizesChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newSize = sizesInput.trim();
      if (newSize && !formData.sizes.includes(newSize)) {
        setFormData({ ...formData, sizes: [...formData.sizes, newSize] });
        setSizesInput('');
      }
    }
  };

  const removeSize = (size: string) => {
    setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Ajouter un nouveau produit</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <Input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
              <Input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price || ''}
                onChange={handleChange}
                required
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="tops">Hauts</option>
                <option value="bottoms">Bas</option>
                <option value="outerwear">Vêtements d'extérieur</option>
                <option value="sportswear">Vêtements de sport</option>
                <option value="accessories">Accessoires</option>
                <option value="shoes">Chaussures</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="new">Neuf</option>
                <option value="used">Occasion</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="unisex">Unisexe</option>
                <option value="boys">Garçons</option>
                <option value="girls">Filles</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={() => setFormData({ ...formData, inStock: !formData.inStock })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="inStock" className="ml-2 block text-sm text-gray-900">
                  Produit en stock
                </label>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tailles (appuyez sur Entrée ou virgule pour ajouter)</label>
              <Input
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
                onKeyDown={handleSizesChange}
                placeholder="ex: S, M, L, XL..."
                fullWidth
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.sizes.map((size) => (
                  <div key={size} className="bg-gray-100 rounded px-2 py-1 flex items-center">
                    {size}
                    <button
                      type="button"
                      onClick={() => removeSize(size)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
              <Input
                type="url"
                name="imageUrl"
                placeholder="https://..."
                value={formData.images[0]}
                onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                fullWidth
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : 'Ajouter le produit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductsPage: React.FC = () => {
  const { products, toggleProductStatus, addProduct } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyOutOfStock, setShowOnlyOutOfStock] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  const handleAddProduct = (newProduct: Product) => {
    addProduct(newProduct);
  };
  
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
                        onClick={() => toggleProductStatus(product.id)}
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
                      €{product.price.toFixed(2)}
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