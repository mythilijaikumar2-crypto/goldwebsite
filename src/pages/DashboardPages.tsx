import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, ClipboardList, MapPin, Settings as SettingsIcon, LogOut, Plus, Trash2 } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SEO } from '../components/common/SEO';
import { useGoldRate } from '../context/GoldRateContext';

/* ==========================================================================
   SHARED DASHBOARD LAYOUT COMPONENT
   ========================================================================== */
interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: 'profile' | 'orders' | 'addresses' | 'settings';
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, title }) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Link to="/login" replace />;
  }

  const menuItems = [
    { id: 'profile', label: 'My Profile', path: '/profile', icon: User },
    { id: 'orders', label: 'Order History', path: '/orders', icon: ClipboardList },
    { id: 'addresses', label: 'Saved Addresses', path: '/addresses', icon: MapPin },
    { id: 'settings', label: 'Account Settings', path: '/settings', icon: SettingsIcon }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="grow max-w-7xl mx-auto px-4 w-full select-none py-6 text-left">
      <Breadcrumbs items={[{ label: 'Dashboard', url: '/profile' }, { label: title }]} />

      <div className="mb-10 mt-4 border-b border-gold-primary/10 pb-4">
        <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-1">Customer Registry</span>
        <h1 className="font-heading text-2xl md:text-3xl font-light text-white tracking-wide uppercase leading-tight">
          Welcome back, {user.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Navigation Sidebar Panel */}
        <aside className="lg:col-span-1 bg-luxury-surface border border-gold-primary/10 rounded overflow-hidden">
          <div className="p-6 border-b border-gold-primary/10 flex flex-col items-center text-center">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border border-gold-primary/20 bg-luxury-bg mb-3" />
            <h4 className="font-heading text-sm text-white font-semibold">{user.name}</h4>
            <p className="text-[10px] text-neutral-500 font-body mt-0.5">{user.email}</p>
          </div>

          <nav className="flex flex-col text-xs uppercase tracking-wider font-body">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 px-6 py-4 border-b border-gold-primary/5 last:border-b-0 hover:bg-gold-primary/5 transition ${
                    activeTab === item.id ? 'bg-gold-primary/5 text-gold-primary font-bold' : 'text-neutral-400'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 text-gold-primary" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-6 py-4 text-red-400 hover:bg-red-500/5 transition text-left cursor-pointer border-t border-gold-primary/10 font-bold mt-2"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Content Panel */}
        <main className="lg:col-span-3">
          {children}
        </main>
      </div>
    </div>
  );
};

/* ==========================================================================
   1. PROFILE COMPONENT
   ========================================================================== */
export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [success, setSuccess] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    updateProfile(name, phone);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <DashboardLayout activeTab="profile" title="My Profile">
      <SEO title="My Profile" description="Manage your JKS Jewels customer account profile details." />
      <div className="bg-luxury-surface border border-gold-primary/10 rounded p-6">
        <h3 className="font-heading text-sm text-gold-light uppercase tracking-wider mb-6 pb-2 border-b border-gold-primary/10">
          Profile Details
        </h3>

        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded mb-4">
            Profile details updated successfully.
          </div>
        )}

        <form onSubmit={handleUpdate} className="flex flex-col gap-4 text-xs font-body max-w-md">
          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-500">Registered Email (Cannot be changed)</label>
            <input type="email" disabled value={user?.email} className="bg-luxury-bg border border-neutral-900 rounded p-3 text-neutral-500 outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-500">Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 text-white outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-500">Phone Contact</label>
            <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 text-white outline-none" />
          </div>

          <button type="submit" className="bg-gold-primary text-black font-semibold font-body py-3 px-6 rounded hover:bg-gold-light transition uppercase tracking-widest mt-2 cursor-pointer w-fit">
            Save Profile changes
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

/* ==========================================================================
   2. ORDERS COMPONENT
   ========================================================================== */
export const Orders: React.FC = () => {
  const { user } = useAuth();
  const { formatCurrency } = useGoldRate();

  return (
    <DashboardLayout activeTab="orders" title="Order History">
      <SEO title="Order History" description="Check details and secure tracking of your active gold and diamond transactions." />
      <div className="bg-luxury-surface border border-gold-primary/10 rounded p-6">
        <h3 className="font-heading text-sm text-gold-light uppercase tracking-wider mb-6 pb-2 border-b border-gold-primary/10">
          Transaction History
        </h3>

        {user?.orders.length === 0 ? (
          <p className="text-xs text-neutral-400 italic font-body">You have not placed any orders yet.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {user?.orders.map((order) => (
              <div key={order.id} className="border border-gold-primary/15 rounded overflow-hidden">
                {/* Order Meta bar */}
                <div className="bg-black/55 px-4 py-3 flex flex-wrap items-center justify-between text-xs font-body text-neutral-400 gap-2 border-b border-gold-primary/10">
                  <div className="flex items-center gap-4">
                    <span>Reference: <strong className="text-white font-mono">{order.id}</strong></span>
                    <span>Date: <strong className="text-white">{order.date}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-500">Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase ${
                      order.status === 'Delivered' ? 'bg-green-500/10 text-green-400' : 'bg-gold-primary/10 text-gold-primary'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 flex flex-col gap-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 text-xs font-body">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover bg-luxury-bg rounded border border-neutral-900" />
                        <div className="text-left">
                          <span className="text-white font-semibold block">{item.name}</span>
                          <span className="text-[10px] text-neutral-500">Qty: {item.quantity} • {item.weight}g</span>
                        </div>
                      </div>
                      <span className="font-semibold text-gold-primary">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="bg-black/20 p-4 border-t border-gold-primary/5 flex items-center justify-between text-xs font-body text-neutral-400">
                  <span>Method: {order.paymentMethod}</span>
                  <div className="flex items-center gap-2">
                    <span>Total Settle:</span>
                    <strong className="text-gold-primary text-sm font-heading">{formatCurrency(order.total)}</strong>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

/* ==========================================================================
   3. ADDRESSES COMPONENT
   ========================================================================== */
export const Addresses: React.FC = () => {
  const { user, addAddress, deleteAddress, setDefaultAddress } = useAuth();
  
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [name, setName] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !line1.trim() || !city.trim() || !state.trim() || !zip.trim() || !phone.trim()) return;

    addAddress({
      type,
      name,
      line1,
      city,
      state,
      zip,
      phone,
      isDefault
    });

    // Reset Form
    setName('');
    setLine1('');
    setCity('');
    setState('');
    setZip('');
    setPhone('');
    setIsDefault(false);
    setShowForm(false);
  };

  return (
    <DashboardLayout activeTab="addresses" title="Saved Addresses">
      <SEO title="Saved Addresses" description="Configure shipping destinations and set default delivery profiles." />
      <div className="bg-luxury-surface border border-gold-primary/10 rounded p-6">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gold-primary/10">
          <h3 className="font-heading text-sm text-gold-light uppercase tracking-wider">
            Shipping Destinations
          </h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 text-[10px] text-gold-primary hover:text-gold-light uppercase tracking-widest font-body font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 bg-luxury-bg border border-gold-primary/10 p-5 rounded grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body">
            <h4 className="md:col-span-2 text-gold-light uppercase tracking-widest text-[10px] font-semibold border-b border-neutral-900 pb-2">New Address Form</h4>
            
            <div className="flex flex-col gap-1">
              <label className="text-neutral-500">Address Label</label>
              <select value={type} onChange={(e) => setType(e.target.value as any)} className="bg-luxury-surface border border-gold-primary/15 rounded p-2 text-white">
                <option value="Home">Home Address</option>
                <option value="Work">Work Address</option>
                <option value="Other">Other Location</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-neutral-500">Recipient Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="bg-luxury-surface border border-gold-primary/15 rounded p-2 text-white outline-none" />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-neutral-500">Street Address</label>
              <input type="text" required value={line1} onChange={(e) => setLine1(e.target.value)} className="bg-luxury-surface border border-gold-primary/15 rounded p-2 text-white outline-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-neutral-500">City</label>
              <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="bg-luxury-surface border border-gold-primary/15 rounded p-2 text-white outline-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-neutral-500">State / Region</label>
              <input type="text" required value={state} onChange={(e) => setState(e.target.value)} className="bg-luxury-surface border border-gold-primary/15 rounded p-2 text-white outline-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-neutral-500">ZIP Code</label>
              <input type="text" required value={zip} onChange={(e) => setZip(e.target.value)} className="bg-luxury-surface border border-gold-primary/15 rounded p-2 text-white outline-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-neutral-500">Phone</label>
              <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-luxury-surface border border-gold-primary/15 rounded p-2 text-white outline-none" />
            </div>

            <label className="flex items-center gap-2 md:col-span-2 mt-2 cursor-pointer">
              <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="rounded text-gold-primary" />
              <span>Set as default address</span>
            </label>

            <button type="submit" className="bg-gold-primary text-black font-semibold py-2.5 px-6 rounded hover:bg-gold-light transition uppercase tracking-widest mt-2 cursor-pointer w-fit md:col-span-2">
              Save Address
            </button>
          </form>
        )}

        {user?.addresses.length === 0 ? (
          <p className="text-xs text-neutral-400 italic font-body">No addresses registered. Please register one above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user?.addresses.map((addr) => (
              <div 
                key={addr.id}
                className={`p-4 rounded border flex flex-col justify-between text-xs font-body ${
                  addr.isDefault ? 'border-gold-primary/50 bg-gold-primary/3' : 'border-neutral-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold uppercase text-[10px] tracking-wider">{addr.type} Address</span>
                    {addr.isDefault && <span className="bg-gold-primary/10 text-gold-primary text-[8px] font-bold px-1.5 py-0.5 rounded">DEFAULT</span>}
                  </div>
                  <p className="text-neutral-400 leading-relaxed">
                    {addr.name}<br />
                    {addr.line1}<br />
                    {addr.city}, {addr.state} {addr.zip}<br />
                    <span className="text-neutral-500 mt-1 block">Phone: {addr.phone}</span>
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gold-primary/5">
                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-[9px] uppercase tracking-widest text-gold-light hover:text-white transition font-semibold"
                    >
                      Make Default
                    </button>
                  )}
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="text-neutral-500 hover:text-red-400 transition"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

/* ==========================================================================
   4. SETTINGS COMPONENT
   ========================================================================== */
export const Settings: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [pass, setPass] = useState('');
  const [cPass, setCPass] = useState('');
  const [passErr, setPassErr] = useState('');

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setPassErr('');
    setSuccess(false);

    if (pass.length < 6) {
      setPassErr('Password must be at least 6 characters.');
      return;
    }
    if (pass !== cPass) {
      setPassErr('Passwords do not match.');
      return;
    }

    setSuccess(true);
    setPass('');
    setCPass('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <DashboardLayout activeTab="settings" title="Account Settings">
      <SEO title="Account Settings" description="Change passwords and configure security settings." />
      <div className="bg-luxury-surface border border-gold-primary/10 rounded p-6">
        <h3 className="font-heading text-sm text-gold-light uppercase tracking-wider mb-6 pb-2 border-b border-gold-primary/10">
          Account Settings
        </h3>

        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded mb-4">
            Security settings updated successfully.
          </div>
        )}

        <form onSubmit={handlePasswordReset} className="flex flex-col gap-4 text-xs font-body max-w-md">
          <h4 className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Change Password</h4>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-500">New Password</label>
            <input type="password" required value={pass} onChange={(e) => setPass(e.target.value)} className="bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 text-white outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-500">Confirm New Password</label>
            <input type="password" required value={cPass} onChange={(e) => setCPass(e.target.value)} className="bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 text-white outline-none" />
            {passErr && <span className="text-[10px] text-red-500 mt-1">{passErr}</span>}
          </div>

          <button type="submit" className="bg-gold-primary text-black font-semibold font-body py-3 px-6 rounded hover:bg-gold-light transition uppercase tracking-widest mt-2 cursor-pointer w-fit">
            Change Password
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};
