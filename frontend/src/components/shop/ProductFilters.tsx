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
            <Filter size={16} className="mr-2" /> Filtres
          </span>
          {isOpen ? <X size={16} /> : <span className="text-xs">Afficher</span>}
        </button>
      </div>

      {/* Filters */}
      <div className={`p-4 ${isOpen ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            name="gender"
            label="Genre"
            value={filters.gender}
            onChange={handleChange}
            options={[
              { value: '', label: 'Tous les genres' },
              { value: 'boys', label: 'Garçons' },
              { value: 'girls', label: 'Filles' },
              { value: 'unisex', label: 'Unisexe' },
            ]}
            fullWidth
          />

          <Select
            name="condition"
            label="État"
            value={filters.condition}
            onChange={handleChange}
            options={[
              { value: '', label: 'Tous les états' },
              { value: 'new', label: 'Neuf' },
              { value: 'used', label: 'Occasion' },
            ]}
            fullWidth
          />

          <Select
            name="category"
            label="Catégorie"
            value={filters.category}
            onChange={handleChange}
            options={[
              { value: '', label: 'Toutes les catégories' },
              { value: 'tops', label: 'Hauts' },
              { value: 'bottoms', label: 'Bas' },
              { value: 'outerwear', label: 'Vêtements d\'extérieur' },
              { value: 'sportswear', label: 'Vêtements de sport' },
            ]}
            fullWidth
          />

          <div className="flex space-x-2">
            <Input
              name="minPrice"
              label="Prix min"
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min&nbsp;€"
              fullWidth
            />
            <Input
              name="maxPrice"
              label="Prix max"
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max&nbsp;€"
              fullWidth
            />
          </div>

          <Select
            name="size"
            label="Taille"
            value={filters.size}
            onChange={handleChange}
            options={[
              { value: '', label: 'Toutes les tailles' },
              { value: 'S', label: 'Petit (S)' },
              { value: 'M', label: 'Moyen (M)' },
              { value: 'L', label: 'Grand (L)' },
              { value: 'XL', label: 'Très grand (XL)' },
            ]}
            fullWidth
          />

          <Input
            name="brand"
            label="Marque"
            value={filters.brand}
            onChange={handleChange}
            placeholder="Toutes les marques"
            fullWidth
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleReset}
            variant="outline"
            className="mr-2"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;