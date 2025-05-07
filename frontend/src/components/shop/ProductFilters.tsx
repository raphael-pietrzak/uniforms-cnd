import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface FiltersState {
  gender: string;
  condition: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  size: string;
  brand: string;
}

interface ProductFiltersProps {
  onFilterChange: (filters: FiltersState) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    gender: '',
    condition: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    brand: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      gender: '',
      condition: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      size: '',
      brand: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      {/* Mobile filter button */}
      <div className="md:hidden p-4 border-b">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full bg-gray-100 p-2 rounded"
        >
          <span className="font-medium flex items-center">
            <Filter size={16} className="mr-2" /> Filters
          </span>
          {isOpen ? <X size={16} /> : <span className="text-xs">Show</span>}
        </button>
      </div>

      {/* Filters */}
      <div className={`p-4 ${isOpen ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            name="gender"
            label="Gender"
            value={filters.gender}
            onChange={handleChange}
            options={[
              { value: '', label: 'All Genders' },
              { value: 'boys', label: 'Boys' },
              { value: 'girls', label: 'Girls' },
              { value: 'unisex', label: 'Unisex' },
            ]}
            fullWidth
          />

          <Select
            name="condition"
            label="Condition"
            value={filters.condition}
            onChange={handleChange}
            options={[
              { value: '', label: 'All Conditions' },
              { value: 'new', label: 'New' },
              { value: 'used', label: 'Used' },
            ]}
            fullWidth
          />

          <Select
            name="category"
            label="Category"
            value={filters.category}
            onChange={handleChange}
            options={[
              { value: '', label: 'All Categories' },
              { value: 'tops', label: 'Tops' },
              { value: 'bottoms', label: 'Bottoms' },
              { value: 'outerwear', label: 'Outerwear' },
              { value: 'sportswear', label: 'Sportswear' },
            ]}
            fullWidth
          />

          <div className="flex space-x-2">
            <Input
              name="minPrice"
              label="Min Price"
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min €"
              fullWidth
            />
            <Input
              name="maxPrice"
              label="Max Price"
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max €"
              fullWidth
            />
          </div>

          <Select
            name="size"
            label="Size"
            value={filters.size}
            onChange={handleChange}
            options={[
              { value: '', label: 'All Sizes' },
              { value: 'S', label: 'Small (S)' },
              { value: 'M', label: 'Medium (M)' },
              { value: 'L', label: 'Large (L)' },
              { value: 'XL', label: 'X-Large (XL)' },
            ]}
            fullWidth
          />

          <Input
            name="brand"
            label="Brand"
            value={filters.brand}
            onChange={handleChange}
            placeholder="All Brands"
            fullWidth
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleReset}
            variant="outline"
            className="mr-2"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;