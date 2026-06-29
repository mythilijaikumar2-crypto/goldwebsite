import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../data/products';
import { useCart } from './CartContext';

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const savedWishlist = localStorage.getItem('jks_wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  const saveWishlist = (items: Product[]) => {
    setWishlistItems(items);
    localStorage.setItem('jks_wishlist', JSON.stringify(items));
  };

  const addToWishlist = (product: Product) => {
    if (wishlistItems.some(item => item.id === product.id)) return;
    saveWishlist([...wishlistItems, product]);
  };

  const removeFromWishlist = (productId: string) => {
    const updated = wishlistItems.filter(item => item.id !== productId);
    saveWishlist(updated);
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const moveToCart = (product: Product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      moveToCart
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
