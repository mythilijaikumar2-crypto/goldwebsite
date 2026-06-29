import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../data/products';
import { useGoldRate } from './GoldRateContext';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  coupon: Coupon | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  getCartTotals: () => {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const AVAILABLE_COUPONS: Coupon[] = [
  { code: 'GOLD10', type: 'percentage', value: 10 },
  { code: 'JKSWELCOME', type: 'fixed', value: 50, minSpend: 300 },
  { code: 'BRIDAL15', type: 'percentage', value: 15, minSpend: 1500 }
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const { calculatePrice } = useGoldRate();

  useEffect(() => {
    const savedCart = localStorage.getItem('jks_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('jks_cart', JSON.stringify(items));
  };

  const addToCart = (product: Product, quantity = 1) => {
    const index = cartItems.findIndex(item => item.product.id === product.id);
    if (index > -1) {
      const updated = [...cartItems];
      updated[index].quantity += quantity;
      saveCart(updated);
    } else {
      saveCart([...cartItems, { product, quantity }]);
    }
  };

  const removeFromCart = (productId: string) => {
    const updated = cartItems.filter(item => item.product.id !== productId);
    saveCart(updated);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cartItems.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
    setCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    const found = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (found) {
      const { subtotal } = getCartTotalsRaw();
      if (found.minSpend && subtotal < found.minSpend) {
        return false;
      }
      setCoupon(found);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Helper to calculate subtotal based on current live rates
  const getCartTotalsRaw = () => {
    let subtotal = 0;
    cartItems.forEach(item => {
      const details = calculatePrice(
        item.product.weight,
        item.product.purity,
        item.product.makingChargesPerGram,
        item.product.gemstonePrice
      );
      // We calculate subtotal as the sum of items' custom subtotals (excl. individual tax)
      subtotal += (details.metalCost + details.makingCost + details.gemstoneCost) * item.quantity;
    });
    return { subtotal };
  };

  const getCartTotals = () => {
    const { subtotal } = getCartTotalsRaw();
    let discount = 0;

    if (coupon) {
      if (coupon.type === 'percentage') {
        discount = subtotal * (coupon.value / 100);
      } else {
        discount = coupon.value;
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const tax = discountedSubtotal * 0.03; // 3% GST
    const total = discountedSubtotal + tax;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      coupon,
      applyCoupon,
      removeCoupon,
      getCartTotals
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
