import React from 'react';
import type { Product } from '../../data/products';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading = false }) => {
  // Skeleton count helper
  const skeletonArray = Array.from({ length: 8 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 select-none">
        {skeletonArray.map((_, idx) => (
          <div 
            key={idx} 
            className="bg-luxury-surface border border-gold-primary/10 rounded overflow-hidden aspect-3/4 flex flex-col p-4 animate-pulse"
          >
            <div className="grow bg-neutral-900 rounded aspect-square w-full mb-4" />
            <div className="h-3.5 bg-neutral-800 rounded w-1/3 mb-2" />
            <div className="h-4 bg-neutral-800 rounded w-3/4 mb-4" />
            <div className="h-px bg-neutral-800 w-full mb-3" />
            <div className="flex justify-between items-center mt-auto">
              <div className="flex flex-col gap-1 w-1/2">
                <div className="h-2.5 bg-neutral-800 rounded w-2/3" />
                <div className="h-4 bg-neutral-800 rounded w-3/4" />
              </div>
              <div className="h-3 bg-neutral-800 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-gold-primary/15 rounded bg-luxury-surface/50">
        <h3 className="font-heading text-lg text-gold-light mb-2">No Jewellery Found</h3>
        <p className="text-xs text-neutral-400 font-body max-w-sm mx-auto">
          We could not find matching pieces matching your current filters. Please adjust your refinement settings.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
export default ProductGrid;
