import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Package, Calendar, MapPin, CreditCard, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SEO } from '../components/common/SEO';
import { useGoldRate } from '../context/GoldRateContext';

export const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const { formatCurrency } = useGoldRate();

  const order = location.state?.order;

  // Safeguard if accessed directly
  if (!order) {
    return <Navigate to="/" replace />;
  }

  // Calculate estimated delivery: 3 business days from now
  const estDate = new Date();
  estDate.setDate(estDate.getDate() + 3);
  const formattedEstDate = estDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <SEO title="Order Confirmed Successfully" description="Your transaction has been approved. Preparing secured transit vault packaging for delivery." />

      <div className="grow max-w-4xl mx-auto px-4 w-full select-none py-6 text-left">
        <Breadcrumbs items={[{ label: 'Order Confirmed' }]} />

        {/* Status Header */}
        <div className="text-center py-10 flex flex-col items-center border-b border-gold-primary/10 mb-8">
          <CheckCircle2 className="w-16 h-16 text-gold-primary mb-4 animate-gold-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-gold-primary font-bold">Transaction Success</span>
          <h1 className="font-heading text-2xl md:text-3xl font-light text-white uppercase tracking-wider mt-1.5 mb-2">
            Invoice Approved
          </h1>
          <p className="text-xs text-neutral-400 font-body max-w-sm mx-auto">
            Order Reference: <span className="text-gold-light font-semibold font-mono">{order.id}</span>. 
            A secured tracking code has been dispatched to your email.
          </p>
        </div>

        {/* Order details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          
          {/* Left panel: logistics */}
          <div className="flex flex-col gap-6">
            
            {/* Delivery Estimation */}
            <div className="bg-luxury-surface border border-gold-primary/10 rounded p-5 flex gap-4">
              <Calendar className="w-5 h-5 text-gold-primary shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-semibold text-white uppercase tracking-wider mb-1.5 text-[10px]">Estimated Delivery</h4>
                <p className="text-gold-light font-medium mb-1 font-body">{formattedEstDate}</p>
                <p className="text-[10px] text-neutral-500 font-body">Subject to secured armored courier schedules.</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-luxury-surface border border-gold-primary/10 rounded p-5 flex gap-4">
              <MapPin className="w-5 h-5 text-gold-primary shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-semibold text-white uppercase tracking-wider mb-1.5 text-[10px]">Delivery Address</h4>
                <p className="text-neutral-300 font-body font-medium">{order.shippingAddress.name}</p>
                <p className="text-neutral-400 font-body leading-relaxed mt-1">
                  {order.shippingAddress.line1}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-luxury-surface border border-gold-primary/10 rounded p-5 flex gap-4">
              <CreditCard className="w-5 h-5 text-gold-primary shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-semibold text-white uppercase tracking-wider mb-1.5 text-[10px]">Method of Settle</h4>
                <p className="text-neutral-300 font-body font-medium">{order.paymentMethod}</p>
                <p className="text-[10px] text-neutral-500 font-body mt-1">Fully cleared transit gateway.</p>
              </div>
            </div>

          </div>

          {/* Right panel: invoice card */}
          <div className="bg-luxury-surface border border-gold-primary/10 rounded p-5 flex flex-col justify-between">
            <div>
              <h4 className="font-heading text-xs text-gold-light uppercase tracking-wider mb-4 pb-2 border-b border-gold-primary/10">
                Itemized Invoice
              </h4>
              
              <div className="flex flex-col gap-4 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="text-left max-w-[70%]">
                      <span className="text-white font-medium truncate block">{item.name}</span>
                      <span className="text-[10px] text-neutral-500 font-body">Qty: {item.quantity} • {item.weight}g</span>
                    </div>
                    <span className="font-semibold text-gold-primary font-body">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gold-primary/15 bg-black/40 p-4 rounded text-xs font-body flex flex-col gap-2">
              <div className="flex justify-between text-neutral-400">
                <span>Metal & Labor Subtotal</span>
                <span className="text-white font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Luxury VAT (3%)</span>
                <span className="text-white font-medium">{formatCurrency(order.tax)}</span>
              </div>
              <div className="h-px bg-gold-primary/10 my-1" />
              <div className="flex justify-between items-center text-sm font-semibold font-heading text-white">
                <span>Total Settled</span>
                <span className="text-gold-primary text-base font-bold">{formatCurrency(order.total)}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Security Assurances info */}
        <div className="bg-gold-primary/5 border border-gold-primary/10 rounded p-5 flex gap-4 items-start mb-10 text-xs text-neutral-400 font-body leading-relaxed">
          <Package className="w-5 h-5 text-gold-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white uppercase tracking-wider text-[10px] block mb-1">Casket Packaging Notice</span>
            All jewellery items are sealed in tamper-evident containers inside an armored leather casket box accompanied by printed 
            BIS Hallmark purity certificates, gemstone grading reports (IGI/GIA), and your lifetime buyback warranty card. Do not accept the shipment if the security tape is broken.
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-gold-primary text-black font-body text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded hover:bg-gold-light transition shadow-[0_4px_16px_rgba(212,175,55,0.15)]"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </>
  );
};
export default OrderSuccess;
