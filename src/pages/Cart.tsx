import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useGoldRate } from '../context/GoldRateContext';
import { Trash2, Plus, Minus, Ticket, ShoppingBag, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SEO } from '../components/common/SEO';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, coupon, applyCoupon, removeCoupon, getCartTotals } = useCart();
  const { calculatePrice, formatCurrency } = useGoldRate();

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);

  const totals = getCartTotals();

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess(false);

    if (!promoCode.trim()) return;

    const success = await applyCoupon(promoCode);
    if (success) {
      setPromoSuccess(true);
      setPromoCode('');
    } else {
      setPromoError('Invalid coupon code or minimum purchase amount not met.');
    }
  };

  return (
    <>
      <SEO title="Shopping Cart" description="Review your treasures, apply promotional vouchers, and calculate dynamic luxury taxes before final billing." />

      <div className="grow max-w-7xl mx-auto px-4 w-full select-none py-6 text-left">
        <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

        <div className="mb-10 mt-4 border-b border-gold-primary/10 pb-4">
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-1">Your Selection</span>
          <h1 className="font-heading text-2xl md:text-3xl font-light text-white tracking-wide uppercase leading-tight">
            Treasure Cart
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-gold-primary/15 rounded bg-luxury-surface/30">
            <ShoppingBag className="w-12 h-12 text-gold-primary/45 mx-auto mb-4 animate-pulse" />
            <h3 className="font-heading text-lg text-gold-light mb-2">Your Cart is Empty</h3>
            <p className="text-xs text-neutral-400 font-body max-w-xs mx-auto mb-6">
              You haven't added any luxury pieces to your cart yet. Explore our selections.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-gold-primary text-black font-body text-xs font-semibold uppercase tracking-widest px-6 py-3.5 rounded hover:bg-gold-light transition"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Items List */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {cartItems.map((item) => {
                const product = item.product;
                const pricing = calculatePrice(
                  product.weight,
                  product.purity,
                  product.makingChargesPerGram,
                  product.gemstonePrice
                );

                return (
                  <div 
                    key={product.id}
                    className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-luxury-surface border border-gold-primary/10 rounded group hover:border-gold-primary/20 transition text-left"
                  >
                    {/* Image */}
                    <Link to={`/product/${product.id}`} className="w-24 h-24 bg-[#0D0D0D] p-2 rounded shrink-0 flex items-center justify-center">
                      <img src={product.images[0]} alt={product.name} className="max-h-full max-w-full object-contain" />
                    </Link>

                    {/* Meta Info */}
                    <div className="grow">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold block mb-0.5">{product.category}</span>
                      <Link to={`/product/${product.id}`} className="font-heading text-sm text-white hover:text-gold-primary transition line-clamp-1">
                        {product.name}
                      </Link>
                      <div className="text-[10px] text-neutral-500 mt-1 font-body">
                        {product.purity} Gold • {product.weight}g
                      </div>
                    </div>

                    {/* Adjust Quantity Controls */}
                    <div className="flex items-center border border-gold-primary/15 rounded bg-luxury-bg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product.id, item.quantity - 1)}
                        className="px-2.5 py-1.5 hover:bg-gold-primary hover:text-black transition text-neutral-400"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-4 text-xs font-semibold font-body text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, item.quantity + 1)}
                        className="px-2.5 py-1.5 hover:bg-gold-primary hover:text-black transition text-neutral-400"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price and delete */}
                    <div className="flex flex-col items-end gap-2 pr-2">
                      <span className="font-heading text-sm font-semibold text-gold-primary">
                        {formatCurrency(pricing.total * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-neutral-500 hover:text-red-400 transition"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Billing Summary Box */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              {/* Order Summary panel */}
              <div className="bg-luxury-surface border border-gold-primary/10 rounded p-6">
                <h3 className="font-heading text-sm text-gold-light uppercase tracking-wider mb-6 pb-2 border-b border-gold-primary/10">
                  Order Summary
                </h3>

                <div className="flex flex-col gap-3 text-xs text-neutral-400 font-body mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">{formatCurrency(totals.subtotal)}</span>
                  </div>

                  {totals.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span className="flex items-center gap-1">
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Discount Applied</span>
                      </span>
                      <span>-{formatCurrency(totals.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Luxury GST/Tax (3%)</span>
                    <span className="text-white font-medium">{formatCurrency(totals.tax)}</span>
                  </div>

                  <div className="h-px bg-gold-primary/10 my-2" />

                  <div className="flex justify-between items-center text-sm font-semibold font-heading text-white">
                    <span>Grand Total</span>
                    <span className="text-gold-primary text-lg">{formatCurrency(totals.total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-gold-primary text-black font-body text-xs font-semibold uppercase tracking-widest py-3.5 rounded hover:bg-gold-light transition shadow-[0_4px_12px_rgba(212,175,55,0.15)] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Promo Code Input panel */}
              <div className="bg-luxury-surface border border-gold-primary/10 rounded p-6">
                <h4 className="font-heading text-xs text-gold-light uppercase tracking-wider mb-4">
                  Apply Promotion Code
                </h4>
                <form onSubmit={handleApplyPromo} className="flex gap-2 font-body text-xs">
                  <input
                    type="text"
                    placeholder="Enter Code (e.g. GOLD10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="grow bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded px-3 py-2 text-white outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-transparent border border-gold-primary/30 text-gold-light hover:bg-gold-primary hover:text-black font-semibold px-4 rounded transition cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {promoError && <p className="text-[10px] text-red-400 mt-2 font-body">{promoError}</p>}
                {promoSuccess && <p className="text-[10px] text-green-400 mt-2 font-body">Promo code applied successfully.</p>}

                {coupon && (
                  <div className="mt-4 bg-luxury-bg border border-green-500/10 p-3 rounded flex items-center justify-between text-xs font-body text-green-400">
                    <div>Active Code: <span className="font-bold">{coupon.code}</span></div>
                    <button onClick={removeCoupon} className="text-neutral-500 hover:text-red-400 font-bold ml-2">Remove</button>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </>
  );
};
export default Cart;
