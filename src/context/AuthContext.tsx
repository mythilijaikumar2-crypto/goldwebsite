import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weight: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: Address[];
  orders: Order[];
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, phone: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, updated: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  placeOrder: (items: OrderItem[], subtotal: number, tax: number, total: number, address: Address, paymentMethod: string) => Order;
  sendOtp: (email: string) => Promise<string>; // returns simulated OTP
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    type: 'Home',
    name: 'Jane Doe',
    line1: '124 Gold Boulevard, Apt 4B',
    city: 'Beverly Hills',
    state: 'CA',
    zip: '90210',
    phone: '+1 (555) 123-4567',
    isDefault: true
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('jks_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const saveUser = (u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('jks_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('jks_user');
    }
  };

  const login = async (email: string): Promise<boolean> => {
    // Standard mock login: logs in user and loads default profile
    const u: UserProfile = {
      name: 'Jane Doe',
      email: email,
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      addresses: DEFAULT_ADDRESSES,
      orders: [
        {
          id: 'ORD-98217',
          date: 'May 12, 2026',
          status: 'Delivered',
          items: [
            {
              productId: 'JKS-101',
              name: 'Aura Gold Ring 1',
              price: 382.40,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=300',
              weight: 5.25
            }
          ],
          subtotal: 350.00,
          tax: 32.40,
          total: 382.40,
          shippingAddress: DEFAULT_ADDRESSES[0],
          paymentMethod: 'Visa Ending in 4242'
        }
      ]
    };
    saveUser(u);
    return true;
  };

  const register = async (name: string, email: string, phone: string): Promise<boolean> => {
    const u: UserProfile = {
      name,
      email,
      phone,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      addresses: [],
      orders: []
    };
    saveUser(u);
    return true;
  };

  const logout = () => {
    saveUser(null);
  };

  const updateProfile = (name: string, phone: string) => {
    if (!user) return;
    const updated = { ...user, name, phone };
    saveUser(updated);
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    if (!user) return;
    const id = `addr-${Date.now()}`;
    const newAddr: Address = { ...addr, id };
    
    let updatedAddresses = [...user.addresses];
    if (newAddr.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newAddr);

    saveUser({ ...user, addresses: updatedAddresses });
  };

  const updateAddress = (id: string, updated: Omit<Address, 'id'>) => {
    if (!user) return;
    let updatedAddresses = user.addresses.map(a => {
      if (a.id === id) {
        return { ...updated, id };
      }
      return a;
    });

    if (updated.isDefault) {
      updatedAddresses = updatedAddresses.map(a => {
        if (a.id !== id) return { ...a, isDefault: false };
        return a;
      });
    }

    saveUser({ ...user, addresses: updatedAddresses });
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const updatedAddresses = user.addresses.filter(a => a.id !== id);
    // If we deleted default, set the first remaining one as default
    if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.isDefault)) {
      updatedAddresses[0].isDefault = true;
    }
    saveUser({ ...user, addresses: updatedAddresses });
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const updatedAddresses = user.addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    saveUser({ ...user, addresses: updatedAddresses });
  };

  const placeOrder = (
    items: OrderItem[],
    subtotal: number,
    tax: number,
    total: number,
    address: Address,
    paymentMethod: string
  ): Order => {
    if (!user) throw new Error('Sign in required to place order');
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'Processing',
      items,
      subtotal,
      tax,
      total,
      shippingAddress: address,
      paymentMethod
    };

    saveUser({
      ...user,
      orders: [newOrder, ...user.orders]
    });

    return newOrder;
  };

  const sendOtp = async (email: string): Promise<string> => {
    // Generate a secure mock 6 digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[JKS Jewels] Mock Verification OTP for ${email}: ${otp}`);
    return otp;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      placeOrder,
      sendOtp
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
