import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Layouts
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

// Pages
import { Home } from '../pages/Home';
import { ProductListing } from '../pages/ProductListing';
import { ProductDetails } from '../pages/ProductDetails';
import { SearchResults } from '../pages/SearchResults';
import { Wishlist } from '../pages/Wishlist';
import { Cart } from '../pages/Cart';
import { Checkout } from '../pages/Checkout';
import { OrderSuccess } from '../pages/OrderSuccess';

// Auth Pages
import { Login, Register, ForgotPassword, OtpVerification } from '../pages/AuthPages';

// Dashboard Pages
import { Profile, Orders, Addresses, Settings } from '../pages/DashboardPages';

// Editorial Pages
import { 
  About, 
  BlogListing, 
  BlogDetails, 
  Gallery, 
  GoldRate, 
  StoreLocator, 
  Contact, 
  FAQ, 
  PrivacyPolicy, 
  TermsConditions, 
  ShippingPolicy, 
  RefundPolicy 
} from '../pages/EditorialPages';

// Scroll To Top on route change helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      
      {/* Shared Layout Header */}
      <Header />
      
      {/* Route Pathways */}
      <div className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<ProductListing />} />
          <Route path="/gold-jewellery" element={<ProductListing />} />
          <Route path="/diamond-jewellery" element={<ProductListing />} />
          <Route path="/bridal-jewellery" element={<ProductListing />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* Auth pathways */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<OtpVerification />} />

          {/* Dashboard pathways */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/settings" element={<Settings />} />

          {/* Editorial pathways */}
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<BlogListing />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gold-rate" element={<GoldRate />} />
          <Route path="/store-locator" element={<StoreLocator />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Policies pathways */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
        </Routes>
      </div>

      {/* Shared Layout Footer */}
      <Footer />
    </>
  );
};
export default AppRoutes;
