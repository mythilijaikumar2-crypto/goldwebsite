import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuth } from '../context/AuthContext';
import type { Address } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useGoldRate } from '../context/GoldRateContext';
import { CreditCard, Truck, ShieldAlert, ChevronRight, Check } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SEO } from '../components/common/SEO';

const checkoutSchema = zod.object({
  name: zod.string().min(3, 'Full name is required'),
  email: zod.string().email('Valid email is required'),
  phone: zod.string().min(8, 'Phone number is required'),
  line1: zod.string().min(5, 'Shipping address is required'),
  city: zod.string().min(2, 'City is required'),
  state: zod.string().min(2, 'State is required'),
  zip: zod.string().min(4, 'ZIP/Postal code is required')
});

type CheckoutForm = zod.infer<typeof checkoutSchema>;

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user, placeOrder, isAuthenticated } = useAuth();
  const { cartItems, clearCart, getCartTotals } = useCart();
  const { calculatePrice, formatCurrency } = useGoldRate();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'cod'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totals = getCartTotals();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      line1: user?.addresses.find(a => a.isDefault)?.line1 || '',
      city: user?.addresses.find(a => a.isDefault)?.city || '',
      state: user?.addresses.find(a => a.isDefault)?.state || '',
      zip: user?.addresses.find(a => a.isDefault)?.zip || ''
    }
  });

  // Redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Handle address change for logged in users
  const handleAddressSelect = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setValue('name', addr.name);
    setValue('line1', addr.line1);
    setValue('city', addr.city);
    setValue('state', addr.state);
    setValue('zip', addr.zip);
    setValue('phone', addr.phone);
  };

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    
    // Simulate payment authorization
    setTimeout(() => {
      let finalAddress: Address = {
        id: selectedAddressId || `addr-guest-${Date.now()}`,
        type: 'Home',
        name: data.name,
        line1: data.line1,
        city: data.city,
        state: data.state,
        zip: data.zip,
        phone: data.phone,
        isDefault: false
      };

      const orderItems = cartItems.map(item => {
        const pricing = calculatePrice(
          item.product.weight,
          item.product.purity,
          item.product.makingChargesPerGram,
          item.product.gemstonePrice
        );
        return {
          productId: item.product.id,
          name: item.product.name,
          price: pricing.total,
          quantity: item.quantity,
          image: item.product.images[0],
          weight: item.product.weight
        };
      });

      let methodStr = "Credit Card (ending 4242)";
      if (paymentMethod === 'bank') methodStr = "Secure Bank Transfer";
      if (paymentMethod === 'cod') methodStr = "OTP Secured Cash on Delivery";

      const createdOrder = placeOrder(
        orderItems,
        totals.subtotal,
        totals.tax,
        totals.total,
        finalAddress,
        methodStr
      );

      clearCart();
      setIsSubmitting(false);
      navigate('/order-success', { state: { order: createdOrder } });
    }, 2000);
  };

  return (
    <>
      <SEO title="Checkout Securely" description="Enter your delivery credentials and settle payments through our 100% encrypted luxury transit gateway." />

      <div className="grow max-w-7xl mx-auto px-4 w-full select-none py-6 text-left">
        <Breadcrumbs items={[{ label: 'Cart', url: '/cart' }, { label: 'Checkout' }]} />

        <div className="mb-10 mt-4 border-b border-gold-primary/10 pb-4">
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-1">Encrypted Gateway</span>
          <h1 className="font-heading text-2xl md:text-3xl font-light text-white tracking-wide uppercase leading-tight">
            Secure Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Shipping Details form */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Address Selection */}
            {isAuthenticated && user && user.addresses.length > 0 && (
              <div className="bg-luxury-surface border border-gold-primary/10 rounded p-6">
                <h3 className="font-heading text-sm text-gold-light uppercase tracking-wider mb-4 pb-2 border-b border-gold-primary/5">
                  Saved Delivery Addresses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => handleAddressSelect(addr)}
                      className={`p-4 rounded border text-left flex flex-col justify-between transition ${
                        selectedAddressId === addr.id
                          ? 'border-gold-primary bg-gold-primary/5'
                          : 'border-neutral-800 bg-luxury-bg hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold text-white mb-2">
                          <span>{addr.type} Address</span>
                          {selectedAddressId === addr.id && <Check className="w-4 h-4 text-gold-primary" />}
                        </div>
                        <p className="text-[11px] text-neutral-400 font-body leading-relaxed">
                          {addr.name}<br />
                          {addr.line1}<br />
                          {addr.city}, {addr.state} {addr.zip}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* General Form Inputs */}
            <div className="bg-luxury-surface border border-gold-primary/10 rounded p-6">
              <h3 className="font-heading text-sm text-gold-light uppercase tracking-wider mb-6 pb-2 border-b border-gold-primary/5">
                Shipping Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body">
                
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500">Full Name</label>
                  <input
                    type="text"
                    {...register('name')}
                    className="bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 text-white outline-none"
                  />
                  {errors.name && <span className="text-[10px] text-red-500">{errors.name.message}</span>}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500">Email Address</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 text-white outline-none"
                  />
                  {errors.email && <span className="text-[10px] text-red-500">{errors.email.message}</span>}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500">Phone Contact</label>
                  <input
                    type="text"
                    {...register('phone')}
                    className="bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 text-white outline-none"
                  />
                  {errors.phone && <span className="text-[10px] text-red-500">{errors.phone.message}</span>}
                </div>

                {/* Address Line 1 */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-neutral-500">Street Address</label>
                  <input
                    type="text"
                    {...register('line1')}
                    className="bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 text-white outline-none"
                  />
                  {errors.line1 && <span className="text-[10px] text-red-500">{errors.line1.message}</span>}
                </div>

                {/* City */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500">City</label>
                  <input
                    type="text"
                    {...register('city')}
                    className="bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 text-white outline-none"
                  />
                  {errors.city && <span className="text-[10px] text-red-500">{errors.city.message}</span>}
                </div>

                {/* State */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500">State / Province</label>
                  <input
                    type="text"
                    {...register('state')}
                    className="bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 text-white outline-none"
                  />
                  {errors.state && <span className="text-[10px] text-red-500">{errors.state.message}</span>}
                </div>

                {/* ZIP */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500">ZIP / Postal Code</label>
                  <input
                    type="text"
                    {...register('zip')}
                    className="bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 text-white outline-none"
                  />
                  {errors.zip && <span className="text-[10px] text-red-500">{errors.zip.message}</span>}
                </div>

              </div>
            </div>

            {/* Payment Selector Box */}
            <div className="bg-luxury-surface border border-gold-primary/10 rounded p-6">
              <h3 className="font-heading text-sm text-gold-light uppercase tracking-wider mb-6 pb-2 border-b border-gold-primary/5">
                Payment Verification
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {/* Credit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded border flex flex-col items-center gap-2 transition ${
                    paymentMethod === 'card' 
                      ? 'border-gold-primary bg-gold-primary/5 text-gold-primary' 
                      : 'border-neutral-800 bg-luxury-bg text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-body tracking-wider font-semibold">Credit Card</span>
                </button>

                {/* Bank Transfer */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-3.5 rounded border flex flex-col items-center gap-2 transition ${
                    paymentMethod === 'bank' 
                      ? 'border-gold-primary bg-gold-primary/5 text-gold-primary' 
                      : 'border-neutral-800 bg-luxury-bg text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-body tracking-wider font-semibold">Bank Vault</span>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded border flex flex-col items-center gap-2 transition ${
                    paymentMethod === 'cod' 
                      ? 'border-gold-primary bg-gold-primary/5 text-gold-primary' 
                      : 'border-neutral-800 bg-luxury-bg text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <ShieldAlert className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-body tracking-wider font-semibold">COD Secure</span>
                </button>
              </div>

              {/* Form input fields for Credit Card details */}
              {paymentMethod === 'card' && (
                <div className="grid grid-cols-3 gap-4 text-xs font-body bg-luxury-bg p-4 rounded border border-neutral-900">
                  <div className="flex flex-col gap-1.5 col-span-3">
                    <label className="text-neutral-500">Card Number</label>
                    <input
                      type="text"
                      placeholder="•••• •••• •••• 4242"
                      className="bg-luxury-surface border border-gold-primary/10 rounded p-2.5 text-white outline-none focus:border-gold-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-neutral-500">Expiration Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="bg-luxury-surface border border-gold-primary/10 rounded p-2.5 text-white outline-none focus:border-gold-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-neutral-500">Security Code (CVV)</label>
                    <input
                      type="password"
                      placeholder="•••"
                      className="bg-luxury-surface border border-gold-primary/10 rounded p-2.5 text-white outline-none focus:border-gold-primary"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="text-xs font-body text-neutral-400 leading-relaxed bg-luxury-bg p-4 rounded border border-neutral-900">
                  Please instruct your private bank manager to wire transfer the final billing amount to ASCOPE JEWELLLERY LLC vault account details 
                  which will be sent to your email. We release the jewellery immediately upon transfer validation.
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="text-xs font-body text-neutral-400 leading-relaxed bg-luxury-bg p-4 rounded border border-neutral-900">
                  Delivery coordinates must be matching your registered identity. Our delivery courier manager will request a 6-digit OTP verification code 
                  dispatched to your registered mobile number at the doorstep before releasing the sealed parcel casket.
                </div>
              )}

            </div>
          </div>

          {/* Settle Totals Box */}
          <div className="lg:col-span-1">
            <div className="bg-luxury-surface border border-gold-primary/10 rounded p-6 sticky top-24">
              <h3 className="font-heading text-sm text-gold-light uppercase tracking-wider mb-6 pb-2 border-b border-gold-primary/10">
                Order Review
              </h3>

              <div className="flex flex-col gap-3.5 max-h-52 overflow-y-auto mb-6 pr-2 scrollbar-thin">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center text-xs">
                    <div className="text-left max-w-[70%]">
                      <span className="text-white font-medium truncate block">{item.product.name}</span>
                      <span className="text-[10px] text-neutral-500 font-body">Qty: {item.quantity} × {item.product.weight}g</span>
                    </div>
                    <span className="font-semibold text-gold-primary">
                      {formatCurrency(
                        calculatePrice(item.product.weight, item.product.purity, item.product.makingChargesPerGram, item.product.gemstonePrice).total * item.quantity
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gold-primary/10 my-4" />

              <div className="flex flex-col gap-2.5 text-xs text-neutral-400 font-body mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatCurrency(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-400 font-semibold">
                    <span>Discount</span>
                    <span>-{formatCurrency(totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>VAT / Luxury Tax (3%)</span>
                  <span className="text-white font-medium">{formatCurrency(totals.tax)}</span>
                </div>
                
                <div className="h-px bg-gold-primary/15 my-2" />
                
                <div className="flex justify-between items-center text-sm font-semibold font-heading text-white">
                  <span>Grand Total</span>
                  <span className="text-gold-primary text-lg">{formatCurrency(totals.total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold-primary text-black font-body text-xs font-semibold uppercase tracking-widest py-4 rounded hover:bg-gold-light transition shadow-[0_4px_16px_rgba(212,175,55,0.15)] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Verifying Settle...' : 'Authorize Settle'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </form>

      </div>
    </>
  );
};
export default Checkout;
