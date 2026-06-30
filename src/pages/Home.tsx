import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, HelpCircle, ArrowRight, Star, Sparkles } from 'lucide-react';
import { productsDatabase } from '../data/products';
import { CATEGORIES_METADATA } from '../data/metaData';
import { ProductCard } from '../components/product/ProductCard';
import { useGoldRate } from '../context/GoldRateContext';
import { SEO } from '../components/common/SEO';
import { Newsletter } from '../components/layout/Newsletter';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1600',
    title: 'The Royal Bridal Collection',
    subtitle: 'Heritage Masterpieces Crafted in 22K Hallmark Gold',
    link: '/bridal-jewellery'
  },
  {
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1600',
    title: 'Modern Diamond Solitaires',
    subtitle: 'Brilliance Redefined for Everyday Luxuries',
    link: '/diamond-jewellery'
  },
  {
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=1600',
    title: 'Classic Gold Chains & Bands',
    subtitle: 'Timeless Silhouettes for Men and Women',
    link: '/gold-jewellery'
  }
];

const TESTIMONIALS = [
  {
    name: 'Sathya Narayanan',
    role: 'Collector',
    quote: 'The craftsmanship of the royal choker I ordered is absolutely sublime. ASCOPE JEWELLLERY provides a level of luxury and detail that rivals Place Vendôme.',
    stars: 5
  },
  {
    name: 'Rajesh Kannan N',
    role: 'Investor',
    quote: 'Extremely transparent billing. The live price calculations matching exact gold weights and daily market rates make ASCOPE JEWELLLERY the most trusted jewelry brand.',
    stars: 5
  },
  {
    name: 'Ashwin Kumar',
    role: 'Art Director',
    quote: 'Their customer care concierge treated me like royalty, sending video previews of the ring settings. Absolute premium ecommerce benchmark.',
    stars: 5
  }
];

export const Home: React.FC = () => {
  const { rates, formatCurrency } = useGoldRate();
  
  // Gold Rate Calculator state
  const [calcWeight, setCalcWeight] = useState(10);
  const [calcPurity, setCalcPurity] = useState<'24K' | '22K' | '18K'>('22K');
  const [calcMakingCharge, setCalcMakingCharge] = useState(10); // $10/g

  // Filter subsets
  const featuredProducts = productsDatabase.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = productsDatabase.filter(p => p.isNewArrival).slice(0, 4);
  const bestSellers = productsDatabase.filter(p => p.isBestSeller).slice(0, 4);

  // Calculator price
  const rawCost = calcWeight * rates[calcPurity];
  const makingCharges = calcWeight * calcMakingCharge;
  const subtotal = rawCost + makingCharges;
  const gst = subtotal * 0.03;
  const finalPrice = subtotal + gst;

  // Schema for AEO/SEO
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "name": "ASCOPE JEWELLLERY",
    "image": HERO_SLIDES[0].image,
    "priceRange": "$$$$",
    "telephone": "+1-555-982-1217",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "742 Premium Avenue, Diamond District",
      "addressLocality": "Beverly Hills",
      "addressRegion": "CA",
      "postalCode": "90210",
      "addressCountry": "US"
    }
  };

  return (
    <>
      <SEO 
        title="Timeless Elegance, Crafted in Gold"
        description="Explore ASCOPE JEWELLLERY' premium collection of 22K hallmark gold rings, heavy bridal necklaces, certified diamond sets, and antique temple jewellery."
        schema={homeSchema}
      />

      <div className="grow">
        
        {/* HERO SLIDER SECTION */}
        <section
className="
relative
min-h-screen
h-[100svh]
overflow-hidden bg-black">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            effect="fade"
            loop
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            className="w-full h-full"
          >
            {HERO_SLIDES.map((slide, idx) => (
              <SwiperSlide key={idx} className="relative w-full h-full">
                <div className="absolute inset-0 bg-black/45 z-10" />
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="absolute inset-0 w-full h-full object-cover scale-105" 
                />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
                  <div className="max-w-4xl flex flex-col items-center">
                    <motion.span
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="font-luxury text-xs md:text-sm uppercase tracking-[0.3em] text-gold-light mb-3 block"
                    >
                      Exclusive Atelier Design
                    </motion.span>
                    
                    <motion.h2
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="font-heading text-3xl md:text-6xl font-light text-white tracking-wide uppercase leading-tight"
                    >
                      {slide.title}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="font-body text-xs md:text-sm text-neutral-200 mt-4 tracking-widest max-w-lg"
                    >
                      {slide.subtitle}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className="mt-8"
                    >
                      <Link 
                        to={slide.link}
                        className="bg-gold-primary hover:bg-gold-light text-black font-body text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded transition duration-300 shadow-[0_4px_16px_rgba(212,175,55,0.2)]"
                      >
                        Discover Collection
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* FEATURED CATEGORIES SECTION */}
        <section className="py-20 max-w-7xl mx-auto px-4 text-center">
          <span className="font-luxury italic text-sm text-gold-primary tracking-widest block mb-2">Curated Selections</span>
          <h2 className="font-heading text-2xl md:text-3xl text-white uppercase tracking-wider mb-3">Browse Categories</h2>
          <div className="w-12 h-px bg-gold-primary/30 mx-auto mb-12" />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {CATEGORIES_METADATA.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center bg-luxury-surface border border-gold-primary/10 rounded p-4 transition-all duration-300 hover:border-gold-primary/40 text-center"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden bg-luxury-bg border border-gold-primary/10 mb-4 group-hover:scale-105 transition-transform duration-300">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-body text-xs font-semibold text-neutral-300 group-hover:text-gold-primary transition">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* BRIDAL HIGHLIGHT PARALLAX SECTION */}
        <section className="relative py-32 bg-black overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1600')` }} />
          <div className="absolute inset-0 bg-linear-to-t from-luxury-bg via-transparent to-luxury-bg pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <span className="font-luxury italic text-base text-gold-primary tracking-widest flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" />
              The Bride of ASCOPE JEWELLLERY
            </span>
            <h2 className="font-heading text-3xl md:text-5xl text-white uppercase tracking-wider font-light mt-3 mb-6">
              Grand Heritage Bridal Wear
            </h2>
            <p className="font-body text-xs md:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed mb-8">
              Forged over hundreds of hours by master goldsmiths, our bridal neckpieces, heavy waist belts, 
              and tiaras utilize pure 22K hallmark gold embedded with hand-cut Rubies, Emeralds, and high-clarity diamonds.
            </p>
            <Link 
              to="/bridal-jewellery"
              className="inline-flex items-center gap-2 border border-gold-primary/30 hover:border-gold-primary px-6 py-3 text-xs uppercase tracking-widest font-body text-gold-light hover:text-white transition duration-300"
            >
              <span>Explore Bridal Registry</span>
              <ArrowRight className="w-4 h-4 text-gold-primary" />
            </Link>
          </div>
        </section>

        {/* COLLECTIONS SHELVES (Featured, New, Best) */}
        <section className="py-20 max-w-7xl mx-auto px-4">
          
          {/* Featured */}
          <div className="mb-20">
            <div className="flex items-end justify-between border-b border-gold-primary/10 pb-4 mb-8">
              <div className="text-left">
                <span className="font-luxury italic text-xs text-gold-primary tracking-widest block mb-1">Handpicked Masterpieces</span>
                <h3 className="font-heading text-xl md:text-2xl text-white uppercase tracking-wider">Featured Collection</h3>
              </div>
              <Link to="/products" className="text-xs uppercase tracking-widest font-body text-neutral-400 hover:text-gold-primary transition">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>

          {/* New Arrivals */}
          <div className="mb-20">
            <div className="flex items-end justify-between border-b border-gold-primary/10 pb-4 mb-8">
              <div className="text-left">
                <span className="font-luxury italic text-xs text-gold-primary tracking-widest block mb-1">Fresh from the Atelier</span>
                <h3 className="font-heading text-xl md:text-2xl text-white uppercase tracking-wider">New Arrivals</h3>
              </div>
              <Link to="/products?filter=new" className="text-xs uppercase tracking-widest font-body text-neutral-400 hover:text-gold-primary transition">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>

          {/* Best Sellers */}
          <div>
            <div className="flex items-end justify-between border-b border-gold-primary/10 pb-4 mb-8">
              <div className="text-left">
                <span className="font-luxury italic text-xs text-gold-primary tracking-widest block mb-1">Most Coveted Designs</span>
                <h3 className="font-heading text-xl md:text-2xl text-white uppercase tracking-wider">Best Sellers</h3>
              </div>
              <Link to="/products?filter=best" className="text-xs uppercase tracking-widest font-body text-neutral-400 hover:text-gold-primary transition">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>

        </section>

        {/* LIVE GOLD RATE ESTIMATOR SECTION */}
        <section className="py-20 bg-luxury-surface/50 border-y border-gold-primary/10">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Rates Description */}
            <div className="text-left">
              <span className="font-luxury italic text-sm text-gold-primary tracking-widest block mb-2">Live Market Transparency</span>
              <h2 className="font-heading text-2xl md:text-3xl text-white uppercase tracking-wider mb-4">
                Gold Price Estimator
              </h2>
              <p className="text-xs text-luxury-gray leading-relaxed mb-6 font-body">
                We believe in complete pricing transparency. Our jewellery retail rates are tied directly to the live spot price of 24K, 22K, and 18K gold. 
                Use this custom calculator to estimate the current gold value of any piece by adjusting weights and purity karats.
              </p>

              <div className="grid grid-cols-3 gap-4 border border-gold-primary/10 p-4 rounded bg-luxury-bg">
                <div className="text-center">
                  <div className="text-[10px] text-neutral-500 uppercase font-body tracking-wider">24K Spot/g</div>
                  <div className="font-heading text-sm text-gold-primary font-bold mt-1">{formatCurrency(rates['24K'])}</div>
                </div>
                <div className="text-center border-x border-gold-primary/10">
                  <div className="text-[10px] text-neutral-500 uppercase font-body tracking-wider">22K Spot/g</div>
                  <div className="font-heading text-sm text-gold-primary font-bold mt-1">{formatCurrency(rates['22K'])}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-neutral-500 uppercase font-body tracking-wider">18K Spot/g</div>
                  <div className="font-heading text-sm text-gold-primary font-bold mt-1">{formatCurrency(rates['18K'])}</div>
                </div>
              </div>
            </div>

            {/* Calculator Widget */}
            <div className="bg-luxury-surface border border-gold-primary/10 p-6 rounded text-left">
              <h3 className="font-heading text-sm text-gold-light uppercase tracking-wider mb-6 pb-2 border-b border-gold-primary/10">
                Calculator Form
              </h3>
              
              <div className="flex flex-col gap-4">
                {/* Weight */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs text-neutral-400 font-body">
                    <span>Metal Weight (Grams)</span>
                    <span className="text-gold-primary font-bold">{calcWeight}g</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(parseInt(e.target.value))}
                    className="w-full h-1 bg-luxury-bg appearance-none rounded cursor-pointer accent-gold-primary"
                  />
                </div>

                {/* Carat Purity */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-neutral-400 font-body">Gold Carat Purity</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['24K', '22K', '18K'].map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setCalcPurity(k as any)}
                        className={`py-2 text-xs font-semibold rounded font-body border transition ${
                          calcPurity === k 
                            ? 'bg-gold-primary border-gold-primary text-black' 
                            : 'bg-transparent border-gold-primary/20 text-neutral-400 hover:border-gold-primary'
                        }`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Making Charges Estimator */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs text-neutral-400 font-body">
                    <span>Estimated Making Charges (per gram)</span>
                    <span className="text-gold-primary font-bold">${calcMakingCharge}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    value={calcMakingCharge}
                    onChange={(e) => setCalcMakingCharge(parseInt(e.target.value))}
                    className="w-full h-1 bg-luxury-bg appearance-none rounded cursor-pointer accent-gold-primary"
                  />
                </div>

                {/* Result Block */}
                <div className="mt-4 pt-4 border-t border-gold-primary/15 bg-black/40 p-4 rounded flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-neutral-400 font-body">
                    <span>Gold Price ({calcPurity})</span>
                    <span>{formatCurrency(rawCost)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400 font-body">
                    <span>Making Charges ({calcWeight}g × ${calcMakingCharge})</span>
                    <span>{formatCurrency(makingCharges)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400 font-body">
                    <span>Luxury Tax/VAT (3%)</span>
                    <span>{formatCurrency(gst)}</span>
                  </div>
                  <div className="h-px bg-gold-primary/10 my-1" />
                  <div className="flex justify-between items-center text-sm font-semibold font-heading text-white">
                    <span>Estimated Total Cost</span>
                    <span className="text-gold-primary text-lg">{formatCurrency(finalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* WHY CHOOSE US VALUE PROPS */}
        <section className="py-20 max-w-7xl mx-auto px-4 text-center">
          <span className="font-luxury italic text-sm text-gold-primary tracking-widest block mb-2">Our Assurances</span>
          <h2 className="font-heading text-2xl md:text-3xl text-white uppercase tracking-wider mb-12">The JKS Experience</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center bg-luxury-surface border border-gold-primary/10 p-6 rounded gold-glow">
              <Award className="w-10 h-10 text-gold-primary mb-4 animate-gold-pulse" />
              <h4 className="font-heading text-sm text-gold-light uppercase tracking-wider mb-2">BIS Hallmark certified</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-body">
                Every single piece of our gold jewelry carries the official laser-etched HUID code, confirming 916 and 750 purity.
              </p>
            </div>
            
            <div className="flex flex-col items-center bg-luxury-surface border border-gold-primary/10 p-6 rounded gold-glow">
              <ShieldCheck className="w-10 h-10 text-gold-primary mb-4 animate-gold-pulse" />
              <h4 className="font-heading text-sm text-gold-light uppercase tracking-wider mb-2">100% Insured Delivery</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-body">
                We pack each item in tamper-proof armored caskets and cover full transit insurance to secure your assets.
              </p>
            </div>

            <div className="flex flex-col items-center bg-luxury-surface border border-gold-primary/10 p-6 rounded gold-glow">
              <HelpCircle className="w-10 h-10 text-gold-primary mb-4 animate-gold-pulse" />
              <h4 className="font-heading text-sm text-gold-light uppercase tracking-wider mb-2">Bespoke Consultations</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-body">
                Schedule virtual appointments with our lead designers to tailor-make personal wedding collections.
              </p>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS CAROUSEL */}
        <section className="py-20 bg-[#0C0C0C] border-t border-gold-primary/5 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <span className="font-luxury italic text-sm text-gold-primary tracking-widest block mb-2">Client Whispers</span>
            <h2 className="font-heading text-2xl md:text-3xl text-white uppercase tracking-wider mb-12">Atelier Reviews</h2>
            
            <Swiper
              modules={[Autoplay, Pagination]}
              loop
              autoplay={{ delay: 6000 }}
              pagination={{ clickable: true }}
              className="w-full pb-10"
            >
              {TESTIMONIALS.map((t, idx) => (
                <SwiperSlide key={idx} className="flex flex-col items-center">
                  <div className="flex items-center gap-0.5 justify-center text-gold-primary mb-6">
                    {Array.from({ length: t.stars }).map((_, i) => <Star key={i} className="w-4 h-4 fill-gold-primary" />)}
                  </div>
                  <p className="font-heading text-lg md:text-xl text-neutral-300 italic max-w-2xl mx-auto leading-relaxed mb-6 font-light">
                    "{t.quote}"
                  </p>
                  <span className="font-body text-xs font-semibold uppercase tracking-widest text-gold-light">{t.name}</span>
                  <span className="text-[10px] text-neutral-500 uppercase font-body mt-1 block">{t.role}</span>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* INSTAGRAM GALLERY GRID */}
        <section className="py-20 max-w-7xl mx-auto px-4 text-center">
          <span className="font-luxury italic text-sm text-gold-primary tracking-widest block mb-2">Social Atelier</span>
          <h2 className="font-heading text-2xl md:text-3xl text-white uppercase tracking-wider mb-12">#JKSJewels</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
              'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=600',
              'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600',
              'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600'
            ].map((img, idx) => (
              <div key={idx} className="relative aspect-square group overflow-hidden rounded bg-luxury-bg border border-gold-primary/5">
                <img src={img} alt="Instagram Post" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                  <svg className="w-6 h-6 text-gold-primary fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NEWSLETTER */}
        <Newsletter />

      </div>
    </>
  );
};
export default Home;
