import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { BLOGS, FAQS } from '../data/metaData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SEO } from '../components/common/SEO';
import { useGoldRate } from '../context/GoldRateContext';
import { MapPin, Phone, Clock, ChevronDown, Sparkles, Scale, BookOpen, HelpCircle } from 'lucide-react';

/* ==========================================================================
   1. ABOUT COMPONENT
   ========================================================================== */
export const About: React.FC = () => {
  return (
    <>
      <SEO title="Our Story & Heritage" description="Learn about the origins of ASCOPE JEWELLLERY, our legacy of gold craftsmanship, and conflict-free diamond ethics." />
      <div className="grow max-w-5xl mx-auto px-4 w-full select-none py-6 text-left">
        <Breadcrumbs items={[{ label: 'About Us' }]} />
        <div className="my-10 max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-gold-primary font-bold block mb-1">Our Heritage</span>
          <h1 className="font-heading text-3xl md:text-5xl font-light text-white uppercase tracking-wider mb-8">The JKS Legacy</h1>
          
          <div className="flex flex-col gap-6 text-sm text-neutral-400 font-body leading-relaxed">
            <p>
              Founded in 1994 in Beverly Hills' prestigious diamond district, ASCOPE JEWELLLERY has established a worldwide reputation 
              as a master purveyor of high-carat gold and conflict-free diamonds. Our name is synonymous with timeless design, 
              expert crafting, and structural integrity.
            </p>
            <p>
              Every piece in our inventory begins as an hand-drawn illustration by our head designers before being modeled 
              in high-fidelity 3D CAD platforms. From there, our master goldsmiths melt, refine, and carve 22K and 18K gold 
              by hand, setting each diamond and gemstone with absolute micro-precision.
            </p>
            
            <h4 className="font-heading text-lg text-gold-light uppercase tracking-wider mt-6 mb-2">Our Core Pillars</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
              <div className="bg-luxury-surface border border-gold-primary/10 p-5 rounded">
                <span className="text-gold-primary font-bold block mb-2 font-heading">100% Transparency</span>
                <p className="text-xs text-neutral-500 font-body">All metal weights, labor costs, making charges and stone properties are itemized clearly on every invoice.</p>
              </div>
              <div className="bg-luxury-surface border border-gold-primary/10 p-5 rounded">
                <span className="text-gold-primary font-bold block mb-2 font-heading">Assured Hallmarking</span>
                <p className="text-xs text-neutral-500 font-body">All our gold jewellery is stamped with the official government BIS Hallmark logo and a unique trace HUID code.</p>
              </div>
              <div className="bg-luxury-surface border border-gold-primary/10 p-5 rounded">
                <span className="text-gold-primary font-bold block mb-2 font-heading">Lifetime Security</span>
                <p className="text-xs text-neutral-500 font-body">Enjoy secure armored shipping covered by Lloyd's transit insurance and lifetime buyback guarantees.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ==========================================================================
   2. BLOG LISTING COMPONENT
   ========================================================================== */
export const BlogListing: React.FC = () => {
  return (
    <>
      <SEO title="Jewellery & Gold Rate Guides" description="Read our gold purity guides, gemstone maintenance guidelines, and bridal style advice." />
      <div className="grow max-w-7xl mx-auto px-4 w-full select-none py-6 text-left">
        <Breadcrumbs items={[{ label: 'Blogs & Guides' }]} />
        
        <div className="my-10">
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-1">Editorial Atelier</span>
          <h1 className="font-heading text-2xl md:text-3xl font-light text-white uppercase tracking-wider">Guides & Purity Education</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {BLOGS.map((blog) => (
            <div key={blog.id} className="bg-luxury-surface border border-gold-primary/10 rounded overflow-hidden flex flex-col group hover:border-gold-primary/30 transition">
              <Link to={`/blog/${blog.id}`} className="aspect-video bg-neutral-900 block overflow-hidden">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-102 transition duration-300" />
              </Link>
              <div className="p-5 grow flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-gold-primary font-bold block mb-2">{blog.category}</span>
                  <Link to={`/blog/${blog.id}`} className="font-heading text-sm text-white hover:text-gold-primary transition line-clamp-2 leading-snug">
                    {blog.title}
                  </Link>
                  <p className="text-xs text-neutral-500 font-body leading-relaxed mt-2.5 line-clamp-3">{blog.excerpt}</p>
                </div>
                
                <div className="mt-6 pt-3 border-t border-gold-primary/5 flex items-center justify-between text-[10px] text-neutral-500 font-body">
                  <span>{blog.date} • {blog.readTime}</span>
                  <Link to={`/blog/${blog.id}`} className="text-gold-light hover:text-gold-primary font-bold tracking-widest uppercase">Read Article</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* ==========================================================================
   3. BLOG DETAILS COMPONENT (GEO / AEO Optimized)
   ========================================================================== */
export const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<any | null>(null);

  useEffect(() => {
    const found = BLOGS.find(b => b.id === id);
    if (found) setBlog(found);
  }, [id]);

  if (!blog) {
    return (
      <div className="py-20 text-center">
        <h3 className="font-heading text-lg text-gold-light">Article Not Found</h3>
        <Link to="/blogs" className="text-xs uppercase text-white mt-4 inline-block underline">Back to Guides</Link>
      </div>
    );
  }

  // Schema for AEO/GEO
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "image": blog.image,
    "datePublished": blog.date,
    "articleBody": blog.content,
    "author": {
      "@type": "Organization",
      "name": "ASCOPE JEWELLLERY Atelier"
    }
  };

  return (
    <>
      <SEO title={blog.title} description={blog.excerpt} ogImage={blog.image} schema={blogSchema} />
      <div className="grow max-w-4xl mx-auto px-4 w-full select-none py-6 text-left">
        <Breadcrumbs items={[{ label: 'Blogs', url: '/blogs' }, { label: 'Article Details' }]} />

        <div className="my-10">
          <span className="text-[10px] uppercase tracking-widest text-gold-primary font-bold block mb-2">{blog.category}</span>
          <h1 className="font-heading text-2xl md:text-4xl font-light text-white tracking-wide uppercase leading-tight">
            {blog.title}
          </h1>
          <div className="text-[10px] text-neutral-500 font-body mt-2">
            Published on {blog.date} • {blog.readTime}
          </div>
        </div>

        {/* Banner image */}
        <div className="w-full aspect-video rounded overflow-hidden mb-10 border border-gold-primary/10">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        </div>

        {/* Main Content */}
        <article className="text-sm font-body text-neutral-300 leading-relaxed max-w-3xl mb-12 whitespace-pre-wrap">
          {blog.content}
        </article>

        {/* AEO / GEO Q&A Cards */}
        {blog.aeoQA.length > 0 && (
          <div className="border-t border-gold-primary/15 pt-8 mb-16 bg-gold-primary/3 p-6 rounded border">
            <h3 className="font-heading text-sm text-gold-light uppercase tracking-wider mb-6 flex items-center gap-1.5">
              <BookOpen className="w-4.5 h-4.5 text-gold-primary" />
              <span>Generative Search Q&A (Quick Summary)</span>
            </h3>
            <div className="flex flex-col gap-6 text-xs leading-relaxed font-body">
              {blog.aeoQA.map((qa: any, idx: number) => (
                <div key={idx} className="border-b border-gold-primary/5 pb-4 last:border-b-0">
                  <h4 className="font-semibold text-white mb-2 flex items-start gap-1">
                    <span className="text-gold-primary">Q:</span>
                    <span>{qa.question}</span>
                  </h4>
                  <p className="text-neutral-400 pl-4 border-l border-gold-primary/20">
                    <strong className="text-gold-light mr-1">A:</strong>
                    {qa.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

/* ==========================================================================
   4. GALLERY COMPONENT
   ========================================================================== */
export const Gallery: React.FC = () => {
  const sampleImages = [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'
  ];

  return (
    <>
      <SEO title="Luxury Jewellery Gallery" description="Immerse yourself in our portfolio of handcrafted bridal sets, custom rings and visual collections." />
      <div className="grow max-w-7xl mx-auto px-4 w-full select-none py-6 text-left">
        <Breadcrumbs items={[{ label: 'Lookbook Gallery' }]} />
        
        <div className="my-10 text-center">
          <span className="text-xs uppercase tracking-widest text-gold-primary font-bold block mb-1">The Lookbook</span>
          <h1 className="font-heading text-2xl md:text-3xl font-light text-white uppercase tracking-wider">Visual Gallery</h1>
          <div className="w-12 h-px bg-gold-primary/30 mx-auto mt-4" />
        </div>

        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 mb-16">
          {sampleImages.map((img, idx) => (
            <div key={idx} className="relative rounded overflow-hidden border border-gold-primary/5 bg-[#0D0D0D] break-inside-avoid shadow-lg group">
              <img src={img} alt={`Gallery styling ${idx + 1}`} className="w-full object-cover group-hover:scale-102 transition duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                <Sparkles className="w-6 h-6 text-gold-primary animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* ==========================================================================
   5. GOLD RATE COMPONENT
   ========================================================================== */
export const GoldRate: React.FC = () => {
  const { rates, formatCurrency } = useGoldRate();

  return (
    <>
      <SEO title="Live Gold Rates Calculator" description="Check real-time market gold rates for 24K, 22K, 18K gold and silver per gram." />
      <div className="grow max-w-4xl mx-auto px-4 w-full select-none py-6 text-left font-body">
        <Breadcrumbs items={[{ label: 'Live Gold Rate' }]} />

        <div className="my-10">
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-1">Daily Market Spot</span>
          <h1 className="font-heading text-2xl md:text-3xl font-light text-white uppercase tracking-wider">Live Gold Rates</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Rate table */}
          <div className="bg-luxury-surface border border-gold-primary/10 rounded p-6">
            <h3 className="font-heading text-sm text-gold-light uppercase tracking-wider mb-4 pb-2 border-b border-gold-primary/10">Today's Pricing</h3>
            
            <div className="flex flex-col gap-4 text-xs font-body text-neutral-400">
              <div className="flex justify-between items-center py-2 border-b border-gold-primary/5">
                <span className="text-white font-semibold">24K Pure Gold (99.9% Purity)</span>
                <span className="font-heading text-base font-bold text-gold-primary">{formatCurrency(rates['24K'])} / g</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gold-primary/5">
                <span className="text-white font-semibold">22K Standard Gold (91.6% Purity)</span>
                <span className="font-heading text-base font-bold text-gold-primary">{formatCurrency(rates['22K'])} / g</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gold-primary/5">
                <span className="text-white font-semibold">18K Jewelry Gold (75.0% Purity)</span>
                <span className="font-heading text-base font-bold text-gold-primary">{formatCurrency(rates['18K'])} / g</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white font-semibold">Fine Silver Spot (99.9% Purity)</span>
                <span className="font-heading text-base font-bold text-gold-primary">{formatCurrency(rates['Silver'])} / g</span>
              </div>
            </div>
          </div>

          {/* Guidelines info */}
          <div className="bg-luxury-surface border border-gold-primary/10 rounded p-6 flex flex-col justify-between">
            <div className="text-xs text-neutral-400 leading-relaxed">
              <h3 className="font-heading text-sm text-gold-light uppercase tracking-wider mb-3">Rate Calculations</h3>
              <p className="mb-4">
                Gold jewelry costs are derived dynamically from prevailing market bullion quotes. In addition to the base metal cost, 
                our invoices itemize:
              </p>
              <ul className="list-disc pl-4 flex flex-col gap-1.5">
                <li>Artisanal labor making charges (tied to weight or complexity).</li>
                <li>Authentic BIS Hallmark testing stamp fees.</li>
                <li>Import duties and 3% State VAT/GST taxes.</li>
              </ul>
            </div>
            <div className="mt-6 flex items-start gap-2 bg-luxury-bg p-3 rounded border border-neutral-900 text-[10px]">
              <Scale className="w-4 h-4 text-gold-primary shrink-0 mt-0.5" />
              <span>All weights are weighed on calibrated laboratory balances certified by weight and measures boards.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ==========================================================================
   6. STORE LOCATOR COMPONENT
   ========================================================================== */
export const StoreLocator: React.FC = () => {
  return (
    <>
      <SEO title="Luxury Stores Locator" description="Find ASCOPE JEWELLLERY retail stores and book private showroom viewing appointments." />
      <div className="grow max-w-5xl mx-auto px-4 w-full select-none py-6 text-left">
        <Breadcrumbs items={[{ label: 'Showroom Locator' }]} />

        <div className="my-10">
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-1">Our Showrooms</span>
          <h1 className="font-heading text-2xl md:text-3xl font-light text-white uppercase tracking-wider">Store Locator</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-luxury-surface border border-gold-primary/10 rounded p-6 text-xs text-neutral-400 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-gold-primary/5 pb-2">
              <MapPin className="w-5 h-5 text-gold-primary" />
              <h3 className="font-heading text-sm text-white font-semibold uppercase">Beverly Hills Atelier</h3>
            </div>
            <p className="font-body leading-relaxed">
              742 Premium Avenue, Diamond District<br />
              Beverly Hills, CA 90210
            </p>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold-primary" />
              <span>+1 (555) 982-1217</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-primary" />
              <span>Mon - Sat: 10:00 AM - 7:30 PM (Sunday Closed)</span>
            </div>
          </div>

          {/* Map Mock overlay */}
          <div className="relative rounded overflow-hidden border border-gold-primary/10 bg-luxury-bg aspect-video flex items-center justify-center">
            <div className="absolute inset-0 bg-cover opacity-35" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800')` }} />
            <div className="relative z-10 text-center p-4">
              <span className="text-[10px] uppercase tracking-widest font-body text-gold-primary font-bold block mb-2">Showroom Map View</span>
              <p className="text-[11px] text-neutral-300 max-w-xs mx-auto">Interactive showroom directions and routing coordinates are sent upon booking calendar reservations.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ==========================================================================
   7. CONTACT COMPONENT
   ========================================================================== */
const contactSchema = zod.object({
  name: zod.string().min(3, 'Name is required'),
  email: zod.string().email('Valid email is required'),
  message: zod.string().min(10, 'Message details are required')
});

export const Contact: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = (data: any) => {
    console.log('[ASCOPE JEWELLLERY] Contact form submitted:', data);
    setSuccess(true);
  };

  return (
    <>
      <SEO title="Contact Concierge Support" description="Reach out to our ASCOPE JEWELLLERY concierge desk for custom orders, sizing consultations, and support." />
      <div className="grow max-w-md mx-auto px-4 w-full select-none py-12 text-left">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />
        <div className="bg-luxury-surface border border-gold-primary/10 rounded p-8 mt-4 shadow-2xl">
          <h2 className="font-heading text-xl text-gold-light uppercase tracking-wider mb-2">Contact Concierge</h2>
          <p className="font-luxury italic text-xs text-neutral-400 mb-6">Inquire about custom sizing, commissions or active orders.</p>

          {success ? (
            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded mb-4">
              Your inquiry has been received. Our concierge team will reach out within 24 business hours.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-xs font-body">
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500">Full Name</label>
                <input type="text" {...register('name')} className="w-full bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 text-white outline-none" />
                {errors.name && <span className="text-[10px] text-red-500">{errors.name.message as string}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500">Email Address</label>
                <input type="email" {...register('email')} className="w-full bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 text-white outline-none" />
                {errors.email && <span className="text-[10px] text-red-500">{errors.email.message as string}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500">Inquiry Message</label>
                <textarea rows={4} {...register('message')} className="w-full bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 text-white outline-none resize-none" />
                {errors.message && <span className="text-[10px] text-red-500">{errors.message.message as string}</span>}
              </div>

              <button type="submit" className="w-full bg-gold-primary text-black font-semibold font-body py-3.5 rounded hover:bg-gold-light transition uppercase tracking-widest mt-2 cursor-pointer">
                Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

/* ==========================================================================
   8. FAQ COMPONENT
   ========================================================================== */
export const FAQ: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  // Schema FAQ format
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <SEO title="Frequently Asked Questions" description="Find answers to questions on gold hallmarking, dynamic pricing, customization, returns and shipping." schema={faqSchema} />
      <div className="grow max-w-3xl mx-auto px-4 w-full select-none py-6 text-left">
        <Breadcrumbs items={[{ label: 'FAQs Assistance' }]} />

        <div className="my-10 text-center">
          <span className="text-xs uppercase tracking-widest text-gold-primary font-bold block mb-1">Support Atelier</span>
          <h1 className="font-heading text-2xl md:text-3xl font-light text-white uppercase tracking-wider">Frequently Asked Questions</h1>
          <div className="w-12 h-px bg-gold-primary/30 mx-auto mt-4" />
        </div>

        <div className="flex flex-col gap-4 mb-16 font-body text-xs select-none">
          {FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="bg-luxury-surface border border-gold-primary/10 rounded overflow-hidden">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-white hover:bg-gold-primary/5 transition focus:outline-none"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-gold-primary" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown className={`w-4.5 h-4.5 text-gold-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 border-t border-gold-primary/5 text-neutral-400 leading-relaxed font-body">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

/* ==========================================================================
   9. LEGAL POLICY PAGES (Privacy, Terms, Shipping, Refund)
   ========================================================================== */
interface PolicyLayoutProps {
  title: string;
  children: React.ReactNode;
}

const PolicyLayout: React.FC<PolicyLayoutProps> = ({ title, children }) => (
  <div className="grow max-w-4xl mx-auto px-4 w-full select-none py-6 text-left font-body">
    <Breadcrumbs items={[{ label: title }]} />
    <div className="my-10 max-w-3xl">
      <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-1">Company Guidelines</span>
      <h1 className="font-heading text-2xl md:text-4xl font-light text-white uppercase tracking-wider mb-8">{title}</h1>
      
      <div className="text-xs text-neutral-400 leading-relaxed flex flex-col gap-6 font-body">
        {children}
      </div>
    </div>
  </div>
);

export const PrivacyPolicy: React.FC = () => (
  <>
    <SEO title="Privacy Policy" description="Review details on user data security and customer profiles handling." />
    <PolicyLayout title="Privacy Policy">
      <p>
        At ASCOPE JEWELLLERY, we treat your profile credentials and personal coordinates with strict confidentiality. 
        We do not trade, sell, or disclose registry details to external marketing companies.
      </p>
      <h4 className="font-semibold text-white uppercase text-[10px] tracking-wider mt-2 mb-0.5">Information We Gather</h4>
      <p>
        We collect name details, shipping address coordinates, transaction logs, and web statistics only to validate payment captures, 
        dispatch packages securely, and configure personalized lookbooks.
      </p>
      <h4 className="font-semibold text-white uppercase text-[10px] tracking-wider mt-2 mb-0.5">Payment Protocols</h4>
      <p>
        All billing transactions are processed through 100% encrypted luxury payment gateways. No credit card numbers or CVV codes 
        are stored in our database.
      </p>
    </PolicyLayout>
  </>
);

export const TermsConditions: React.FC = () => (
  <>
    <SEO title="Terms & Conditions" description="Review terms of service, pricing structures, and hallmarking details." />
    <PolicyLayout title="Terms & Conditions">
      <p>
        By using ASCOPE JEWELLLERY, you agree to comply with our commercial terms. 
        All gold rates are updated dynamically according to international bullion spots.
      </p>
      <h4 className="font-semibold text-white uppercase text-[10px] tracking-wider mt-2 mb-0.5">Dynamic Pricing Estimates</h4>
      <p>
        Estimated totals in checkout are calculated dynamically based on weights and live gold rates. Minor changes in market rates 
        can cause price variations before final billing settles.
      </p>
      <h4 className="font-semibold text-white uppercase text-[10px] tracking-wider mt-2 mb-0.5">Authenticity Stamps</h4>
      <p>
        ASCOPE JEWELLLERY certifies the authenticity of all high-carat products. Any attempt to modify, polish, or alter hallmark stamps 
        voids our lifetime buyback warranty program.
      </p>
    </PolicyLayout>
  </>
);

export const ShippingPolicy: React.FC = () => (
  <>
    <SEO title="Shipping Policy" description="Review details on security caskets, OTP door checks, and Lloyd's transit insurance." />
    <PolicyLayout title="Shipping Policy">
      <p>
        Because our products represent high-value gold and diamonds assets, all shipping schedules follow strict security measures:
      </p>
      <ul className="list-disc pl-5 flex flex-col gap-2">
        <li>All transits are fully covered by secure Lloyd's insurance policies.</li>
        <li>Parcels are dispatched in tamper-evident sealed caskets.</li>
        <li>We require signatures from the registered billing contact upon doorstep arrival.</li>
        <li>Couriers verify a 6-digit OTP passcode before releasing any items.</li>
      </ul>
    </PolicyLayout>
  </>
);

export const RefundPolicy: React.FC = () => (
  <>
    <SEO title="Refund & Exchange Policy" description="Learn about our 14-day hassle-free returns and lifetime gold buyback warranty." />
    <PolicyLayout title="Refund Policy">
      <p>
        We offer a 14-day return window for items in their original, unused packaging with safety tags intact.
      </p>
      <h4 className="font-semibold text-white uppercase text-[10px] tracking-wider mt-2 mb-0.5">Lifetime Buyback warranty</h4>
      <p>
        All ASCOPE JEWELLLERY items qualify for our lifetime buyback and exchange warranty program. 
        We calculate exchange payouts using prevailing market gold rates of the metal weight (excluding GST taxes and labor making charges).
      </p>
    </PolicyLayout>
  </>
);
