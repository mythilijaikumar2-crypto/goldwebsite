import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Share2, Shield, ArrowLeftRight, Check, Award, CheckCircle } from 'lucide-react';
import { productsDatabase } from '../data/products';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useGoldRate } from '../context/GoldRateContext';
import { ZoomViewer } from '../components/common/ZoomViewer';
import { Image360 } from '../components/common/Image360';
import { VideoPlayer } from '../components/common/VideoPlayer';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StarRating } from '../components/common/StarRating';
import { SEO } from '../components/common/SEO';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { calculatePrice, formatCurrency } = useGoldRate();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'reviews'>('details');
  const [viewMode, setViewMode] = useState<'standard' | '360' | 'video'>('standard');
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Review submission state
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [localReviews, setLocalReviews] = useState<any[]>([]);

  useEffect(() => {
    const found = productsDatabase.find(p => p.id === id);
    if (found) {
      setProduct(found);
      setActiveImageIndex(0);
      setViewMode('standard');
      setLocalReviews(found.reviews);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="grow flex flex-col items-center justify-center py-32">
        <h2 className="font-heading text-xl text-gold-light mb-4">Piece Not Found</h2>
        <Link to="/products" className="text-xs uppercase tracking-widest text-white border border-gold-primary/20 px-4 py-2 hover:bg-gold-primary hover:text-black transition">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  // Calculate pricing based on current gold rates
  const pricing = calculatePrice(
    product.weight,
    product.purity,
    product.makingChargesPerGram,
    product.gemstonePrice
  );

  const isFav = isInWishlist(product.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
    setSuccessMsg('Successfully added to your treasure cart.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const toggleWishlist = () => {
    if (isFav) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) return;

    const newRev = {
      id: `rev-local-${Date.now()}`,
      name: revName,
      rating: revRating,
      comment: revComment,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    setLocalReviews([newRev, ...localReviews]);
    setRevName('');
    setRevComment('');
  };

  // Schema data
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images[0],
    "description": product.description,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "USD",
      "price": pricing.total,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount || 1
    }
  };

  const relatedProducts = productsDatabase
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <SEO 
        title={product.name} 
        description={`${product.name} - ${product.purity} Hallmark Gold jewellery weighing ${product.weight}g. Order online with secured transit insurance.`}
        ogImage={product.images[0]}
        ogType="product"
        schema={productSchema}
      />

      <div className="grow max-w-7xl mx-auto px-4 w-full select-none py-6 text-left">
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: product.category, url: `/products?category=${encodeURIComponent(product.category)}` },
          { label: product.name }
        ]} />

        {/* Success Banner */}
        {successMsg && (
          <div className="mb-6 bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-xs font-semibold py-3 px-4 rounded flex items-center gap-2">
            <CheckCircle className="w-4.5 h-4.5 text-gold-primary animate-pulse" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Master Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Gallery Column */}
          <div className="flex flex-col gap-4">
            
            {/* View Mode Toggles */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setViewMode('standard')}
                className={`text-[10px] uppercase font-body tracking-wider px-3.5 py-1.5 rounded transition ${
                  viewMode === 'standard' ? 'bg-gold-primary text-black font-semibold' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                }`}
              >
                Standard Gallery
              </button>
              <button
                onClick={() => setViewMode('360')}
                className={`text-[10px] uppercase font-body tracking-wider px-3.5 py-1.5 rounded transition ${
                  viewMode === '360' ? 'bg-gold-primary text-black font-semibold' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                }`}
              >
                Interactive 360°
              </button>
              <button
                onClick={() => setViewMode('video')}
                className={`text-[10px] uppercase font-body tracking-wider px-3.5 py-1.5 rounded transition ${
                  viewMode === 'video' ? 'bg-gold-primary text-black font-semibold' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                }`}
              >
                Cinematic Showcase
              </button>
            </div>

            {/* Main Viewer Box */}
            <div className="w-full">
              {viewMode === 'standard' && (
                <ZoomViewer src={product.images[activeImageIndex]} alt={product.name} />
              )}
              {viewMode === '360' && (
                <Image360 images={product.images} />
              )}
              {viewMode === 'video' && (
                <VideoPlayer videoUrl={product.video} posterUrl={product.images[0]} />
              )}
            </div>

            {/* View thumbnails (Standard Mode only) */}
            {viewMode === 'standard' && (
              <div className="grid grid-cols-8 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square rounded border overflow-hidden bg-[#0D0D0D] p-1 transition ${
                      idx === activeImageIndex ? 'border-gold-primary' : 'border-neutral-800 hover:border-gold-primary/30'
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-start">
            
            {/* Header info */}
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-1">
                {product.category}
              </span>
              <h1 className="font-heading text-2xl md:text-3xl font-light text-white tracking-wide uppercase leading-tight mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3.5 text-xs text-neutral-400 mb-6">
                <StarRating rating={product.rating} />
                <span>({product.reviewCount} client reviews)</span>
                <span className="opacity-40">|</span>
                <span className="text-gold-primary font-bold">{product.purity} Gold</span>
              </div>
            </div>

            {/* Dynamic Calculated Pricing Summary */}
            <div className="bg-luxury-surface border border-gold-primary/10 p-5 rounded mb-8">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-body">Dynamic Price Breakdown</span>
              <div className="font-heading text-3xl font-light text-gold-primary mt-1 mb-4">
                {formatCurrency(pricing.total)}
              </div>
              
              <div className="flex flex-col gap-2 bg-luxury-bg p-3.5 rounded border border-neutral-900 text-xs text-neutral-400 font-body">
                <div className="flex justify-between">
                  <span>Metal Weight Purity ({product.purity} @ {product.weight}g)</span>
                  <span className="text-white font-medium">{formatCurrency(pricing.metalCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Making Charges (@ ${product.makingChargesPerGram}/g)</span>
                  <span className="text-white font-medium">{formatCurrency(pricing.makingCost)}</span>
                </div>
                {product.gemstonePrice > 0 && (
                  <div className="flex justify-between">
                    <span>{product.gemstoneType} Weight ({product.gemstoneWeight} Carats)</span>
                    <span className="text-white font-medium">{formatCurrency(pricing.gemstoneCost)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Luxury Tax / VAT (3%)</span>
                  <span className="text-white font-medium">{formatCurrency(pricing.tax)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="grow flex items-center justify-center gap-2 bg-gold-primary text-black font-body text-xs font-semibold uppercase tracking-widest py-4 rounded hover:bg-gold-light hover:scale-[1.02] transition cursor-pointer shadow-[0_4px_16px_rgba(212,175,55,0.15)]"
              >
                <ShoppingBag className="w-4 h-4 fill-black" />
                <span>Add To Cart</span>
              </button>

              <button
                onClick={toggleWishlist}
                className={`py-4 px-6 rounded border transition-all duration-300 flex items-center justify-center ${
                  isFav 
                    ? 'bg-gold-primary border-gold-primary text-black' 
                    : 'bg-transparent border-gold-primary/20 text-gold-light hover:border-gold-primary'
                }`}
                aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-4.5 h-4.5 ${isFav ? 'fill-black' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="py-4 px-6 rounded border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-500 transition flex items-center justify-center"
                aria-label="Share product"
              >
                {copied ? <Check className="w-4.5 h-4.5 text-gold-primary" /> : <Share2 className="w-4.5 h-4.5" />}
              </button>
            </div>

            {/* Guarantees Box */}
            <div className="grid grid-cols-3 gap-3 border-t border-gold-primary/10 pt-6">
              <div className="flex flex-col items-center text-center p-2">
                <Award className="w-5 h-5 text-gold-primary mb-1.5" />
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">Hallmark Certified</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 border-x border-gold-primary/10">
                <Shield className="w-5 h-5 text-gold-primary mb-1.5" />
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">100% Insured</span>
              </div>
              <div className="flex flex-col items-center text-center p-2">
                <ArrowLeftRight className="w-5 h-5 text-gold-primary mb-1.5" />
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">Lifetime Buyback</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tab panels (Details, Shipping, Reviews) */}
        <div className="border-t border-gold-primary/10 pt-8 mb-16">
          <div className="flex gap-8 border-b border-gold-primary/5 pb-3 mb-6 text-xs uppercase tracking-widest font-body">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'details' ? 'border-gold-primary text-gold-primary font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Artisanal Details
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'shipping' ? 'border-gold-primary text-gold-primary font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Secured Shipping
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'reviews' ? 'border-gold-primary text-gold-primary font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Client Reviews ({localReviews.length})
            </button>
          </div>

          <div className="min-h-48 text-xs leading-relaxed text-neutral-400">
            {activeTab === 'details' && (
              <div className="flex flex-col gap-4">
                <p>{product.description}</p>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-white mb-2 uppercase tracking-wider text-[10px]">Specifications</h5>
                    <ul className="flex flex-col gap-1.5 list-disc pl-4 font-body">
                      <li>Metal Purity: {product.purity} Solid Gold</li>
                      <li>Metal Weight: {product.weight} grams</li>
                      {product.gemstonePrice > 0 && (
                        <li>Stones: {product.gemstoneWeight}ct Hand-cut {product.gemstoneType}</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-white mb-2 uppercase tracking-wider text-[10px]">Certifications</h5>
                    <ul className="flex flex-col gap-1.5 list-disc pl-4 font-body">
                      {product.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="flex flex-col gap-3 font-body">
                <p>
                  To secure your high-value assets, JKS Jewels coordinates transport with specialized security carriers. 
                  Every delivery strictly requires:
                </p>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>In-transit secure container vaulting covered by full Lloyd's insurance.</li>
                  <li>Signature upon arrival by the designated account holder only.</li>
                  <li>Direct SMS OTP check conducted by the courier supervisor at your doorstep.</li>
                  <li>Complimentary delivery on all orders containing registered jewellery.</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Review List */}
                <div className="flex flex-col gap-6 max-h-96 overflow-y-auto pr-4 scrollbar-thin">
                  {localReviews.length === 0 ? (
                    <p className="italic">Be the first to share your experience with this design.</p>
                  ) : (
                    localReviews.map((rev) => (
                      <div key={rev.id} className="border-b border-gold-primary/5 pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-heading text-white font-semibold">{rev.name}</span>
                          <span className="text-[10px] text-neutral-500 font-body">{rev.date}</span>
                        </div>
                        <div className="mb-2">
                          <StarRating rating={rev.rating} size={12} />
                        </div>
                        <p className="font-body italic text-neutral-400">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Submission Form */}
                <div className="bg-luxury-bg border border-gold-primary/10 p-5 rounded h-fit">
                  <h4 className="font-heading text-xs text-gold-light uppercase tracking-wider mb-4 pb-2 border-b border-gold-primary/10">
                    Write a Review
                  </h4>
                  <form onSubmit={handleAddReview} className="flex flex-col gap-4 font-body text-xs">
                    <div className="flex flex-col gap-1">
                      <label className="text-neutral-500">Name</label>
                      <input 
                        type="text" 
                        required 
                        value={revName} 
                        onChange={(e) => setRevName(e.target.value)} 
                        className="bg-luxury-surface border border-gold-primary/15 rounded p-2.5 outline-none text-white focus:border-gold-primary" 
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-neutral-500">Rating</label>
                      <select 
                        value={revRating} 
                        onChange={(e) => setRevRating(parseInt(e.target.value))} 
                        className="bg-luxury-surface border border-gold-primary/15 rounded p-2.5 outline-none text-white focus:border-gold-primary"
                      >
                        {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-neutral-500">Comments</label>
                      <textarea 
                        required 
                        rows={3} 
                        value={revComment} 
                        onChange={(e) => setRevComment(e.target.value)} 
                        className="bg-luxury-surface border border-gold-primary/15 rounded p-2.5 outline-none text-white focus:border-gold-primary" 
                      />
                    </div>
                    <button type="submit" className="bg-gold-primary text-black font-semibold font-body py-2.5 rounded hover:bg-gold-light transition uppercase tracking-widest text-[10px]">
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gold-primary/10 pt-10">
            <h3 className="font-heading text-lg text-white uppercase tracking-wider mb-8">Related Masterpieces</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <div key={p.id} className="bg-luxury-surface border border-gold-primary/10 rounded overflow-hidden p-3 flex flex-col group hover:border-gold-primary/30 transition">
                  <Link to={`/product/${p.id}`} className="aspect-square bg-[#0D0D0D] rounded overflow-hidden block">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-500" />
                  </Link>
                  <div className="mt-3 flex flex-col text-left">
                    <Link to={`/product/${p.id}`} className="text-xs text-white hover:text-gold-primary font-semibold line-clamp-1">{p.name}</Link>
                    <span className="text-[10px] text-gold-primary font-heading font-medium mt-1">
                      {formatCurrency(calculatePrice(p.weight, p.purity, p.makingChargesPerGram, p.gemstonePrice).total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
};
export default ProductDetails;
