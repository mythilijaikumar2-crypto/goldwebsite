import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { GoldRateProvider } from './context/GoldRateContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { LuxuryLoader } from './components/common/LuxuryLoader';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hold splash screen for 2.4 seconds to let SVG stroke draw and percentage complete
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <GoldRateProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <BrowserRouter>
                {loading ? <LuxuryLoader /> : <AppRoutes />}
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </GoldRateProvider>
    </HelmetProvider>
  );
};
export default App;
