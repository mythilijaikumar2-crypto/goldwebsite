import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { productsDatabase } from '../data/products';
import { ProductGrid } from '../components/product/ProductGrid';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SEO } from '../components/common/SEO';

export const SearchResults: React.FC = () => {
  const location = useLocation();
  const [results, setResults] = useState<any[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setQuery(q);

    if (q.trim()) {
      const filtered = productsDatabase.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.category.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [location.search]);

  return (
    <>
      <SEO title={`Search Results for "${query}"`} description={`Review the matching gold and diamond jewellery search results for "${query}" on ASCOPE JEWELLLERY.`} />

      <div className="grow max-w-7xl mx-auto px-4 w-full select-none py-6 text-left">
        <Breadcrumbs items={[{ label: 'Search Results' }]} />

        <div className="mb-10 mt-4">
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-1">Search Output</span>
          <h1 className="font-heading text-2xl md:text-3xl font-light text-white tracking-wide uppercase leading-tight">
            Results for "{query}"
          </h1>
          <p className="text-xs text-neutral-400 font-body mt-2">
            Found <span className="text-gold-primary font-bold">{results.length}</span> matching pieces in our atelier database
          </p>
        </div>

        <ProductGrid products={results} />

        {results.length === 0 && (
          <div className="mt-8 text-center max-w-md mx-auto">
            <h4 className="text-xs font-semibold text-gold-light uppercase tracking-wider mb-3">Try checking our categories</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Gold Rings', 'Gold Chains', 'Gold Earrings', 'Gold Bangles', 'Diamond Jewellery'].map((c) => (
                <Link
                  key={c}
                  to={`/products?category=${encodeURIComponent(c)}`}
                  className="text-[10px] uppercase tracking-widest font-body bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded hover:border-gold-primary transition text-white"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
};
export default SearchResults;
