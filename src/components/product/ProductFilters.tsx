import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../../data/products';

export interface FilterState {
  search: string;
  categories: string[];
  purity: ('18K' | '22K' | '24K')[];
  minPrice: number;
  maxPrice: number;
  minWeight: number;
  maxWeight: number;
  sortBy: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onChange, onReset }) => {
  
  const handleCategoryToggle = (category: string) => {
    const isSelected = filters.categories.includes(category);
    const updated = isSelected
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onChange({ ...filters, categories: updated });
  };

  const handlePurityToggle = (karat: '18K' | '22K' | '24K') => {
    const isSelected = filters.purity.includes(karat);
    const updated = isSelected
      ? filters.purity.filter(p => p !== karat)
      : [...filters.purity, karat];
    
    onChange({ ...filters, purity: updated });
  };

  const handleSliderChange = (field: keyof FilterState, value: number) => {
    onChange({ ...filters, [field]: value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, sortBy: e.target.value });
  };

  const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Weight: Low to High', value: 'weight_asc' },
    { label: 'Weight: High to Low', value: 'weight_desc' },
    { label: 'Customer Rating', value: 'rating' },
    { label: 'New Arrivals', value: 'newest' }
  ];

  return (
    <div className="bg-luxury-surface border border-gold-primary/10 rounded p-5 flex flex-col gap-6 select-none text-left h-fit">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gold-primary/10 pb-4">
        <div className="flex items-center gap-2 text-sm text-gold-light uppercase tracking-wider font-semibold">
          <SlidersHorizontal className="w-4.5 h-4.5 text-gold-primary" />
          <span>Refine Selection</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[10px] text-neutral-500 hover:text-gold-primary transition uppercase tracking-widest font-body"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort Section */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={handleSortChange}
          className="w-full bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-2 text-xs text-white outline-none font-body"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Purity Filter */}
      <div className="flex flex-col gap-2.5">
        <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Gold Purity</label>
        <div className="flex flex-col gap-2">
          {(['18K', '22K', '24K'] as const).map((karat) => {
            const checked = filters.purity.includes(karat);
            return (
              <label key={karat} className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer hover:text-white transition">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handlePurityToggle(karat)}
                  className="rounded bg-luxury-bg border-gold-primary/25 text-gold-primary focus:ring-0 w-3.5 h-3.5"
                />
                <span>{karat} Hallmark Gold</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Weight range slider */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
          <span>Max Metal Weight</span>
          <span className="text-gold-primary font-bold">{filters.maxWeight}g</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={filters.maxWeight}
          onChange={(e) => handleSliderChange('maxWeight', parseFloat(e.target.value))}
          className="w-full h-1 bg-luxury-bg appearance-none rounded cursor-pointer accent-gold-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-primary"
        />
      </div>

      {/* Price range slider */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
          <span>Max Budget</span>
          <span className="text-gold-primary font-bold">${filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min="100"
          max="10000"
          step="100"
          value={filters.maxPrice}
          onChange={(e) => handleSliderChange('maxPrice', parseInt(e.target.value))}
          className="w-full h-1 bg-luxury-bg appearance-none rounded cursor-pointer accent-gold-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-primary"
        />
      </div>

      {/* Categories Filter list */}
      <div className="flex flex-col gap-2.5">
        <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Categories</label>
        <div className="flex flex-col gap-2 overflow-y-auto max-h-56 pr-2 scrollbar-thin">
          {CATEGORIES.map((cat) => {
            const checked = filters.categories.includes(cat);
            return (
              <label key={cat} className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer hover:text-white transition">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleCategoryToggle(cat)}
                  className="rounded bg-luxury-bg border-gold-primary/25 text-gold-primary focus:ring-0 w-3.5 h-3.5"
                />
                <span>{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

    </div>
  );
};
export default ProductFilters;
