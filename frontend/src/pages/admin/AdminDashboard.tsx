import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../lib/firebase';

// Import Admin Modules
import CatalogManager from './components/CatalogManager';
import HomepageEditor from './components/HomepageEditor';
import CRMManager from './components/CRMManager';
import ContractManager from './components/ContractManager';

export default function AdminDashboard() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Tab Routing State
  const [activeTab, setActiveTab] = useState<'catalog' | 'homepage' | 'crm' | 'contracts'>('catalog');

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/signin');
    }
  }, [currentUser, authLoading, navigate]);

  return (
    <div className="bg-paper-white text-primary font-body-md selection:bg-gallery-gold/30 min-h-screen">
      
      { /* Side Navigation Bar */ }
      <aside className="h-screen w-64 fixed left-0 top-0 bg-subtle-smoke border-r border-gallery-gold/20 flex flex-col z-50">
        <div className="px-6 py-8">
          <Link to="/">
            <h1 className="font-display-lg text-2xl text-primary tracking-widest uppercase">The Kala Vault</h1>
          </Link>
          <p className="font-label-caps text-[10px] text-gallery-gold mt-2 tracking-[0.2em] uppercase">Admin Dashboard</p>
        </div>
        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto hide-scrollbar px-4">
          
          <button 
            onClick={() => setActiveTab('catalog')}
            className={`text-left font-bold py-3 pl-4 flex items-center gap-4 transition-all w-full border-l-2 ${
              activeTab === 'catalog' 
                ? 'border-gallery-gold bg-gallery-gold/5 text-primary' 
                : 'border-transparent text-primary/70 hover:bg-gallery-gold/5 hover:text-gallery-gold group'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${activeTab !== 'catalog' && 'group-hover:text-gallery-gold'}`}>palette</span>
            <span className="font-label-caps text-[11px] tracking-widest uppercase">Catalog</span>
          </button>

          <button 
            onClick={() => setActiveTab('homepage')}
            className={`text-left font-bold py-3 pl-4 flex items-center gap-4 transition-all w-full border-l-2 ${
              activeTab === 'homepage' 
                ? 'border-gallery-gold bg-gallery-gold/5 text-primary' 
                : 'border-transparent text-primary/70 hover:bg-gallery-gold/5 hover:text-gallery-gold group'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${activeTab !== 'homepage' && 'group-hover:text-gallery-gold'}`}>web</span>
            <span className="font-label-caps text-[11px] tracking-widest uppercase">Homepage</span>
          </button>

          <button 
            onClick={() => setActiveTab('crm')}
            className={`text-left font-bold py-3 pl-4 flex items-center gap-4 transition-all w-full border-l-2 ${
              activeTab === 'crm' 
                ? 'border-gallery-gold bg-gallery-gold/5 text-primary' 
                : 'border-transparent text-primary/70 hover:bg-gallery-gold/5 hover:text-gallery-gold group'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${activeTab !== 'crm' && 'group-hover:text-gallery-gold'}`}>groups</span>
            <span className="font-label-caps text-[11px] tracking-widest uppercase">CRM & Leads</span>
          </button>

          <button 
            onClick={() => setActiveTab('contracts')}
            className={`text-left font-bold py-3 pl-4 flex items-center gap-4 transition-all w-full border-l-2 ${
              activeTab === 'contracts' 
                ? 'border-gallery-gold bg-gallery-gold/5 text-primary' 
                : 'border-transparent text-primary/70 hover:bg-gallery-gold/5 hover:text-gallery-gold group'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${activeTab !== 'contracts' && 'group-hover:text-gallery-gold'}`}>description</span>
            <span className="font-label-caps text-[11px] tracking-widest uppercase">Contracts</span>
          </button>

        </nav>
        
        <div className="px-6 pb-8 mt-auto flex flex-col gap-4">
          <div className="pt-6 border-t border-gallery-gold/20 flex flex-col gap-3">
            <Link onClick={() => auth.signOut()} className="text-primary/70 flex items-center gap-4 py-2 hover:text-gallery-gold transition-colors" to="/">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span className="font-label-caps text-[10px] tracking-widest uppercase">Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      { /* Main Content Area */ }
      <main className="ml-64 min-h-screen flex flex-col">
        { /* Top App Bar Content */ }
        <header className="h-24 flex justify-between items-center px-12 bg-paper-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-gallery-gold/20">
          <div className="flex items-center gap-6">
            <h2 className="font-display-md text-3xl text-primary tracking-tight">
              {activeTab === 'catalog' && 'Inventory & Catalog'}
              {activeTab === 'homepage' && 'Homepage Editor'}
              {activeTab === 'crm' && 'Leads & Relationships'}
              {activeTab === 'contracts' && 'Lease Agreements'}
            </h2>
            <div className="flex items-center gap-2 bg-gallery-gold/10 border border-gallery-gold/30 px-3 py-1.5">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gallery-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gallery-gold"></span>
              </span>
              <span className="text-primary font-label-caps text-[9px] tracking-[0.2em] uppercase">SYSTEM SYNCED</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/customer">
              <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  <p className="font-label-caps text-[11px] tracking-widest uppercase text-primary">
                    {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Julianne Vose'}
                  </p>
                  <p className="font-label-caps text-[9px] text-gallery-gold tracking-widest uppercase">
                    SENIOR CURATOR
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-subtle-smoke flex items-center justify-center border border-gallery-gold/30 font-display-md text-primary uppercase">
                  {(currentUser?.displayName || currentUser?.email || 'J')[0]}
                </div>
              </div>
            </Link>
          </div>
        </header>

        { /* Dynamic Tab Rendering */ }
        <div className="p-12 flex-1 w-full">
          {activeTab === 'catalog' && <CatalogManager currentUser={currentUser} />}
          {activeTab === 'homepage' && <HomepageEditor />}
          {activeTab === 'crm' && <CRMManager />}
          {activeTab === 'contracts' && <ContractManager />}
        </div>

        { /* Footer */ }
        <footer className="w-full px-12 py-12 flex flex-col items-center justify-center gap-6 bg-paper-white border-t border-gallery-gold/20 mt-auto">
          <p className="font-label-caps text-[9px] tracking-widest text-primary/40 uppercase">© 2026 The Kala Vault. All Rights Reserved.</p>
        </footer>
      </main>
    </div>
  );
}
