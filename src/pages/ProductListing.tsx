import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { productsDatabase } from '../data/products';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';
import type { FilterState } from '../components/product/ProductFilters';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SEO } from '../components/common/SEO';
import { useGoldRate } from '../context/GoldRateContext';

const INITIAL_FILTERS: FilterState = {
  search: '',
  categories: [],
  purity: [],
  minPrice: 0,
  maxPrice: 10000,
  minWeight: 0,
  maxWeight: 100,
  sortBy: 'featured'
};

export const ProductListing: React.FC = () => {
  const location = useLocation();
  const { calculatePrice } = useGoldRate();

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [filteredProducts, setFilteredProducts] = useState(productsDatabase);
  const [isLoading, setIsLoading] = useState(false);

  // Set page headers & meta based on pathname/query
  let title = "Luxury Jewellery Collection";
  let description = "Explore the complete catalogue of JKS Jewels. Handcrafted rings, necklaces, bands, earrings and customized jewelry.";
  let bannerImage = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200";

  // Check URL parameters for preset conditions
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const path = location.pathname;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let activeCategories: string[] = [];
      let activePurities: ('18K' | '22K' | '24K')[] = [];
      let filterText = '';

      if (path === '/gold-jewellery') {
        // filter all categories except Diamond Jewellery
        activeCategories = productsDatabase.map(p => p.category).filter(c => c !== "Diamond Jewellery");
        activePurities = ['22K', '24K'];
      } else if (path === '/diamond-jewellery') {
        activeCategories = ["Diamond Jewellery"];
      } else if (path === '/bridal-jewellery') {
        activeCategories = ["Bridal Jewellery", "Temple Jewellery"];
      } else if (categoryParam) {
        activeCategories = [categoryParam];
      }

      setFilters({
        ...INITIAL_FILTERS,
        categories: activeCategories,
        purity: activePurities,
        search: filterText
      });
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [path, categoryParam]);

  // Adjust headings dynamically
  if (path === '/gold-jewellery') {
    title = "Signature Gold Jewellery";
    description = "Indulge in 22K and 24K certified hallmark gold jewellery. Custom handmade necklaces, solid bangles, chains, and rings.";
    bannerImage = "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=1200";
  } else if (path === '/diamond-jewellery') {
    title = "Certified Diamond Collection";
    description = "Experience unmatched radiance. Shop GIA and IGI certified conflict-free solitaire rings, diamond necklaces, and studs.";
    bannerImage = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200";
  } else if (path === '/bridal-jewellery') {
    title = "The Bridal Registry";
    description = "Royal wedding jewelry sets. Traditional chokers, multilayered haaram necklaces, and antique hand-cut stone collections.";
    bannerImage = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200";
  } else if (categoryParam) {
    title = `${categoryParam}`;
  }

  // Filter application logic
  useEffect(() => {
    let result = [...productsDatabase];

    // Search query filter
    if (filters.search) {
      result = result.filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()));
    }

    // Categories filter
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // Purity filter
    if (filters.purity.length > 0) {
      result = result.filter(p => filters.purity.includes(p.purity));
    }

    // Weight bounds filter
    result = result.filter(p => p.weight <= filters.maxWeight);

    // Price bounds filter (derived dynamically based on live rate calculations)
    result = result.filter(p => {
      const { total } = calculatePrice(p.weight, p.purity, p.makingChargesPerGram, p.gemstonePrice);
      return total <= filters.maxPrice;
    });

    // Sorting logic
    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => {
        const priceA = calculatePrice(a.weight, a.purity, a.makingChargesPerGram, a.gemstonePrice).total;
        const priceB = calculatePrice(b.weight, b.purity, b.makingChargesPerGram, b.gemstonePrice).total;
        return priceA - priceB;
      });
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => {
        const priceA = calculatePrice(a.weight, a.purity, a.makingChargesPerGram, a.gemstonePrice).total;
        const priceB = calculatePrice(b.weight, b.purity, b.makingChargesPerGram, b.gemstonePrice).total;
        return priceB - priceA;
      });
    } else if (filters.sortBy === 'weight_asc') {
      result.sort((a, b) => a.weight - b.weight);
    } else if (filters.sortBy === 'weight_desc') {
      result.sort((a, b) => b.weight - a.weight);
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'newest') {
      result = result.filter(p => p.isNewArrival);
    }

    setFilteredProducts(result);
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <>
      <SEO title={title} description={description} ogImage={bannerImage} />

      <div className="grow max-w-7xl mx-auto px-4 w-full select-none py-6">
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: title }]} />

        {/* Hero banner */}
        <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-10 flex items-center justify-center bg-black border border-gold-primary/10">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img src={bannerImage} alt={title} className="absolute inset-0 w-full h-full object-cover" />
          
          <div className="relative z-20 text-center px-4 max-w-xl">
            <h1 className="font-heading text-xl md:text-3xl font-light text-gold-light uppercase tracking-wider mb-2">
              {title}
            </h1>
            <p className="text-[11px] text-neutral-300 leading-relaxed font-body">
              {description}
            </p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters 
              filters={filters} 
              onChange={setFilters} 
              onReset={handleResetFilters} 
            />
          </div>

          {/* Grid Panel */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6 text-xs text-neutral-400 font-body">
              <div>
                Displaying <span className="text-gold-primary font-bold">{filteredProducts.length}</span> pieces of exquisite jewellery
              </div>
            </div>

            <ProductGrid 
              products={filteredProducts} 
              isLoading={isLoading} 
            />
          </div>
        </div>

      </div>
    </>
  );
};
export default ProductListing;
