import React, { useState, useRef } from 'react';
import { X, Camera, Upload, PlusCircle, MinusCircle, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Product } from '../../types';
import { uploadApi } from '../../services/api';

interface ProductFormProps {
  initialValues?: Product;
  onSubmit: (productData: Product) => void;
  onCancel: () => void;
}

interface InventoryItem {
  size: string;
  quantity: number;
}

const defaultValues = {
  id: '',
  name: 'test',
  description: 'description',
  price: 10,
  brand: 'M&S',
  category: 'tops',
  sizes: ['M', 'L'] as string[],
  condition: 'new' as 'new' | 'used',
  gender: 'unisex' as 'unisex' | 'boys' | 'girls',
  images: [] as string[],
  inventory: [] as InventoryItem[]
};

const ProductForm: React.FC<ProductFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    ...defaultValues,
    ...initialValues,
    inventory: initialValues?.inventory || []
  });
  const [sizesInput, setSizesInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialValues?.images || []
  );
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    initialValues?.images?.filter(url => url.startsWith('/uploads/')) || []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let serverImagePaths: string[] = [...uploadedImages];
      
      if (imageFiles.length > 0) {
        const uploadedImageUrls = await uploadApi.uploadImages(imageFiles);
        serverImagePaths = [...serverImagePaths, ...uploadedImageUrls];
      }
      
      const productData = {
        ...formData,
        images: serverImagePaths.length > 0 ? serverImagePaths : ['https://placehold.co/600x400?text=Image+placeholder']
      };

      onSubmit(productData);
    } catch (error) {
      console.error('Erreur lors de la soumission du produit:', error);
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
        // Ajouter la taille à la liste des tailles
        setFormData({ 
          ...formData, 
          sizes: [...formData.sizes, newSize],
          // Ajouter également dans l'inventaire avec quantité 0 par défaut
          inventory: [...formData.inventory, { size: newSize, quantity: 0 }]
        });
        setSizesInput('');
      }
    }
  };

  const removeSize = (size: string) => {
    setFormData({ 
      ...formData, 
      sizes: formData.sizes.filter(s => s !== size),
      // Supprimer également de l'inventaire
      inventory: formData.inventory.filter(item => item.size !== size)
    });
  };

  const updateInventoryQuantity = (size: string, quantity: number) => {
    // Mettre à jour la quantité pour une taille spécifique
    const updatedInventory = formData.inventory.map(item => 
      item.size === size ? { ...item, quantity } : item
    );
    
    setFormData({ ...formData, inventory: updatedInventory });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setImageFiles(prevFiles => [...prevFiles, ...selectedFiles]);
      
      selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const isServerImage = index < uploadedImages.length;
    
    if (isServerImage) {
      setUploadedImages(images => images.filter((_, i) => i !== index));
    } else {
      const localIndex = index - uploadedImages.length;
      setImageFiles(files => files.filter((_, i) => i !== localIndex));
    }
    
    setImagePreviews(previews => previews.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
      
      setImageFiles(prevFiles => [...prevFiles, ...imageFiles]);
      
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Images du produit</label>
          
          <div 
            className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={40} className="text-gray-400 mb-4" />
            <p className="text-sm text-gray-600">Déposez vos images ici, ou <span className="text-blue-500">parcourez</span></p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP jusqu'à 5MB</p>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden" 
            />
          </div>
          
          <button
            type="button"
            className="mt-3 flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera size={20} className="mr-2" />
            Prendre une photo
            
            <input 
              type="file" 
              ref={cameraInputRef}
              onChange={handleFileChange}
              accept="image/*"
              capture="environment"
              className="hidden" 
            />
          </button>
          
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={preview} 
                    alt={`Aperçu ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-white text-gray-500 hover:text-gray-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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
            <option value="unisex">Mixte</option>
            <option value="boys">Garçons</option>
            <option value="girls">Filles</option>
          </select>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tailles et inventaire</label>
          <div className="flex mb-4">
            <Input
              value={sizesInput}
              onChange={(e) => setSizesInput(e.target.value)}
              onKeyDown={handleSizesChange}
              placeholder="Ajouter une taille (ex: S, M, L, XL...)"
              fullWidth
            />
            <Button 
              type="button" 
              variant="secondary"
              className="ml-2 flex items-center"
              onClick={() => {
                if (sizesInput.trim() && !formData.sizes.includes(sizesInput.trim())) {
                  setFormData({ 
                    ...formData, 
                    sizes: [...formData.sizes, sizesInput.trim()],
                    inventory: [...formData.inventory, { size: sizesInput.trim(), quantity: 0 }]
                  });
                  setSizesInput('');
                }
              }}
            >
              <PlusCircle size={18} className="mr-1" /> Ajouter
            </Button>
          </div>
          
          {formData.sizes.length > 0 && (
            <div className="border rounded-md overflow-hidden mt-2">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité en stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.sizes.map((size) => {
                    // Trouver l'entrée d'inventaire correspondante
                    const inventoryItem = formData.inventory.find(item => item.size === size) || { size, quantity: 0 };
                    
                    return (
                      <tr key={size}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{size}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <button
                              type="button"
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => updateInventoryQuantity(size, Math.max(0, inventoryItem.quantity - 1))}
                              disabled={inventoryItem.quantity <= 0}
                            >
                              <MinusCircle size={18} />
                            </button>
                            <Input
                              type="number"
                              min="0"
                              value={inventoryItem.quantity}
                              onChange={(e) => updateInventoryQuantity(size, parseInt(e.target.value) || 0)}
                              className="mx-2 w-16 text-center"
                            />
                            <button
                              type="button"
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => updateInventoryQuantity(size, inventoryItem.quantity + 1)}
                            >
                              <PlusCircle size={18} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                            type="button"
                            onClick={() => removeSize(size)}
                            className="text-gray-500 hover:text-gray-700"
                            >
                            <Trash2 size={18} />
                            </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Chargement...' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}
export default ProductForm;