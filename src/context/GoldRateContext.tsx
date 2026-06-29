import React, { createContext, useContext, useState, useEffect } from 'react';

export interface GoldRates {
  '24K': number; // USD per gram
  '22K': number; // USD per gram
  '18K': number; // USD per gram
  'Silver': number; // USD per gram
}

interface GoldRateContextType {
  rates: GoldRates;
  updateRates: (newRates: Partial<GoldRates>) => void;
  calculatePrice: (
    weight: number,
    purity: '24K' | '22K' | '18K',
    makingChargesPerGram: number,
    gemstonePrice: number
  ) => {
    metalCost: number;
    makingCost: number;
    gemstoneCost: number;
    tax: number;
    total: number;
  };
  formatCurrency: (value: number) => string;
}

const GoldRateContext = createContext<GoldRateContextType | undefined>(undefined);

export const GoldRateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Base starting rates
  const [rates, setRates] = useState<GoldRates>({
    '24K': 76.50,
    '22K': 70.15,
    '18K': 57.40,
    'Silver': 1.10
  });

  // Simulate minor gold rate fluctuations occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prev => {
        const change = (Math.random() - 0.5) * 0.15; // micro fluctuation
        const new24K = parseFloat((prev['24K'] + change).toFixed(2));
        return {
          '24K': new24K,
          '22K': parseFloat((new24K * 0.9167).toFixed(2)), // 22K is 91.67% of 24K
          '18K': parseFloat((new24K * 0.75).toFixed(2)),   // 18K is 75% of 24K
          'Silver': parseFloat((prev['Silver'] + (Math.random() - 0.5) * 0.01).toFixed(2))
        };
      });
    }, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const updateRates = (newRates: Partial<GoldRates>) => {
    setRates(prev => ({
      ...prev,
      ...newRates
    }));
  };

  const calculatePrice = (
    weight: number,
    purity: '24K' | '22K' | '18K',
    makingChargesPerGram: number,
    gemstonePrice: number
  ) => {
    const metalRate = rates[purity];
    const metalCost = weight * metalRate;
    const makingCost = weight * makingChargesPerGram;
    const gemstoneCost = gemstonePrice;
    
    const subtotal = metalCost + makingCost + gemstoneCost;
    const tax = subtotal * 0.03; // 3% Luxury Tax/GST
    const total = subtotal + tax;

    return {
      metalCost: parseFloat(metalCost.toFixed(2)),
      makingCost: parseFloat(makingCost.toFixed(2)),
      gemstoneCost: parseFloat(gemstoneCost.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <GoldRateContext.Provider value={{ rates, updateRates, calculatePrice, formatCurrency }}>
      {children}
    </GoldRateContext.Provider>
  );
};

export const useGoldRate = () => {
  const context = useContext(GoldRateContext);
  if (!context) {
    throw new Error('useGoldRate must be used within a GoldRateProvider');
  }
  return context;
};
