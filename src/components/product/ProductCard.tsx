import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scale } from 'lucide-react';
import type { Product } from '../../data/products';
import { useWishlist } from '../../context/WishlistContext';
import { useGoldRate } from '../../context/GoldRateContext';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { calculatePrice, formatCurrency } = useGoldRate();

  const isFav = isInWishlist(product.id);

  // Recalculate price dynamically based on live rate
  const pricing = calculatePrice(
    product.weight,
    product.purity,
    product.makingChargesPerGram,
    product.gemstonePrice
  );

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-luxury-surface border border-gold-primary/10 rounded overflow-hidden flex flex-col h-full group gold-glow-hover select-none relative"
    >
      {/* Product Image Viewer link */}
      <Link to={`/product/${product.id}`} className="relative block aspect-square bg-[#0D0D0D] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist quick action */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border border-gold-primary/15 transition-all duration-300 ${
            isFav 
              ? 'bg-gold-primary text-black' 
              : 'bg-black/60 text-white hover:text-gold-primary hover:bg-black/85'
          }`}
          aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-black' : ''}`} />
        </button>

        {/* Dynamic spec indicators overlay */}
        <div className="absolute bottom-2.5 left-2.5 flex gap-1.5 pointer-events-none">
          <span className="bg-black/75 border border-gold-primary/20 text-[9px] font-semibold text-gold-light px-2 py-0.5 rounded backdrop-blur-sm uppercase">
            {product.purity} Gold
          </span>
          <span className="bg-black/75 border border-gold-primary/20 text-[9px] font-semibold text-gold-light px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
            <Scale className="w-2.5 h-2.5 text-gold-primary" />
            {product.weight}g
          </span>
        </div>
      </Link>

      {/* Product content info */}
      <div className="p-4 grow flex flex-col justify-between text-left">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">
            {product.category}
          </span>
          <Link 
            to={`/product/${product.id}`} 
            className="font-heading text-sm text-white group-hover:text-gold-primary transition duration-300 line-clamp-1 block"
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-3.5 pt-3 border-t border-gold-primary/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-body">Computed Live Price</span>
            <span className="font-heading text-base font-semibold text-gold-primary">
              {formatCurrency(pricing.total)}
            </span>
          </div>
          
          <Link 
            to={`/product/${product.id}`}
            className="text-[9px] uppercase tracking-widest font-body font-semibold text-gold-light border-b border-gold-primary/20 hover:border-gold-primary pb-0.5 transition duration-200"
          >
            Explore
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
export default ProductCard;
