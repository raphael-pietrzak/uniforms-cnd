import React, { useState } from 'react';
import { Product } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface ProductFormProps {
  initialValues?: Partial<Product>;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const defaultProduct: Omit<Product, 'id'> = {
  name: '',
  description: '',
  price: 0,
  sizes: [],
  condition: 'new',
  brand: '',
  gender: 'unisex',
  images: ['https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
  inStock: true,
  category: 'tops',
};

const ProductForm: React.FC<ProductFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    ...defaultProduct,
    ...initialValues,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else if (name === 'sizes') {
      const sizesArray = value.split(',').map((size) => size.trim());
      setFormData({
        ...formData,
        sizes: sizesArray,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (formData.sizes.length === 0) {
      newErrors.sizes = 'At least one size is required';
    }
    
    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }
    
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image URL is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          fullWidth
          required
        />
        
        <Input
          label="Brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          error={errors.brand}
          fullWidth
          required
        />
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>
        
        <Input
          label="Price (€)"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price.toString()}
          onChange={handleChange}
          error={errors.price}
          fullWidth
          required
        />
        
        <Input
          label="Sizes (comma separated)"
          name="sizes"
          value={formData.sizes.join(', ')}
          onChange={handleChange}
          placeholder="S, M, L, XL"
          error={errors.sizes}
          fullWidth
          required
        />
        
        <Select
          label="Condition"
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          options={[
            { value: 'new', label: 'New' },
            { value: 'used', label: 'Used' },
          ]}
          fullWidth
          required
        />
        
        <Select
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={[
            { value: 'boys', label: 'Boys' },
            { value: 'girls', label: 'Girls' },
            { value: 'unisex', label: 'Unisex' },
          ]}
          fullWidth
          required
        />
        
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={[
            { value: 'tops', label: 'Tops' },
            { value: 'bottoms', label: 'Bottoms' },
            { value: 'outerwear', label: 'Outerwear' },
            { value: 'sportswear', label: 'Sportswear' },
          ]}
          fullWidth
          required
        />
        
        <div className="flex items-center">
          <input
            id="inStock"
            name="inStock"
            type="checkbox"
            checked={formData.inStock}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
            In Stock
          </label>
        </div>
        
        <div className="md:col-span-2">
          <Input
            label="Image URL"
            name="imageUrl"
            value={formData.images[0] || ''}
            onChange={(e) => {
              const newImages = [...formData.images];
              newImages[0] = e.target.value;
              setFormData({ ...formData, images: newImages });
            }}
            error={errors.images}
            fullWidth
            required
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialValues.id ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;