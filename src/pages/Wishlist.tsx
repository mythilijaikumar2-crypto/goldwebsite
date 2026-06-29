import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingBag, Trash2, Heart, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SEO } from '../components/common/SEO';
import { useGoldRate } from '../context/GoldRateContext';

export const Wishlist: React.FC = () => {
  const { wishlistItems, removeFromWishlist, moveToCart } = useWishlist();
  const { calculatePrice, formatCurrency } = useGoldRate();

  return (
    <>
      <SEO title="My Wishlist" description="Manage your favorited luxury gold and diamond pieces. Save for later or move to your shopping cart." />

      <div className="grow max-w-7xl mx-auto px-4 w-full select-none py-6 text-left">
        <Breadcrumbs items={[{ label: 'Wishlist' }]} />

        <div className="mb-10 mt-4 border-b border-gold-primary/10 pb-4">
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-1">Saved Treasures</span>
          <h1 className="font-heading text-2xl md:text-3xl font-light text-white tracking-wide uppercase leading-tight">
            My Wishlist
          </h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-gold-primary/15 rounded bg-luxury-surface/30">
            <Heart className="w-12 h-12 text-gold-primary/45 mx-auto mb-4 animate-pulse" />
            <h3 className="font-heading text-lg text-gold-light mb-2">Your Wishlist is Empty</h3>
            <p className="text-xs text-neutral-400 font-body max-w-xs mx-auto mb-6">
              You haven't saved any treasures yet. Start exploring our collections to compile your perfect jewelry set.
            </p>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 bg-gold-primary text-black font-body text-xs font-semibold uppercase tracking-widest px-6 py-3.5 rounded hover:bg-gold-light transition"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => {
              const pricing = calculatePrice(
                product.weight,
                product.purity,
                product.makingChargesPerGram,
                product.gemstonePrice
              );

              return (
                <div 
                  key={product.id}
                  className="bg-luxury-surface border border-gold-primary/10 rounded overflow-hidden flex flex-col justify-between group hover:border-gold-primary/30 transition relative"
                >
                  {/* Image Link */}
                  <Link to={`/product/${product.id}`} className="block aspect-square bg-[#0D0D0D] p-4 relative">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain group-hover:scale-102 transition" />
                    
                    {/* Delete Badge */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-red-400 border border-red-500/10 hover:bg-red-500/20 hover:text-red-500 transition"
                      aria-label="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </Link>

                  {/* Body Info */}
                  <div className="p-4 grow flex flex-col justify-between text-left">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold block mb-1">{product.category}</span>
                      <Link to={`/product/${product.id}`} className="font-heading text-xs font-semibold text-white hover:text-gold-primary transition line-clamp-1">
                        {product.name}
                      </Link>
                      <div className="text-[10px] text-neutral-500 mt-1 font-body">
                        {product.purity} Gold • {product.weight}g
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gold-primary/5">
                      <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-body mb-0.5">Price</div>
                      <div className="font-heading text-sm text-gold-primary font-bold">{formatCurrency(pricing.total)}</div>
                      
                      <button
                        onClick={() => moveToCart(product)}
                        className="w-full mt-3 flex items-center justify-center gap-1.5 bg-neutral-900 border border-gold-primary/20 text-gold-light hover:bg-gold-primary hover:text-black font-body text-[10px] font-semibold uppercase tracking-widest py-2 rounded transition cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move To Cart</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </>
  );
};
export default Wishlist;
