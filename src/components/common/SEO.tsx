import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'product' | 'article';
  ogImage?: string;
  schema?: Record<string, any> | Record<string, any>[]; // custom JSON-LD
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=1200',
  schema
}) => {
  const brandName = "ASCOPE JEWELLLERY";
  const fullTitle = `${title} | ${brandName} - Timeless Luxury Gold Jewellery`;
  const currentUrl = canonicalUrl || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={brandName} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* AEO / GEO Crawl directives */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />

      {/* Schema Injection */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};
export default SEO;
