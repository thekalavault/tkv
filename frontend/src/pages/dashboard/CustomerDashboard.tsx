import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../lib/firebase';
import { fetchArtworks } from '../../services/artworkService';
import ArtworkCard from '../../components/ArtworkCard';
import { SkeletonArtworkCard } from '../../components/SkeletonCard';
import { CollectionArtwork } from '../../lib/collectionsData';

export default function CustomerDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser, loading: authLoading } = useAuth();
  
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'portfolio';

  // Portfolio state
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Catalog state
  const [catalogArtworks, setCatalogArtworks] = useState<CollectionArtwork[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/signin');
    }
  }, [currentUser, authLoading, navigate]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [modalOpen]);

  useEffect(() => {
    if (currentUser) {
      if (activeTab === 'portfolio') {
        loadArtworks();
      } else if (activeTab === 'catalog' && catalogArtworks.length === 0) {
        loadCatalog();
      }
    }
  }, [currentUser, activeTab]);

  const loadArtworks = async () => {
    setLoading(true);
    try {
      const token = currentUser ? await currentUser.getIdToken() : '';
      const response = await fetch(`${API_BASE_URL}/api/v1/artworks/my-collection`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setArtworks(data || []); // my-collection returns an array directly, not { items: [] }
      }
    } catch (err) {
      console.error('Failed to load artworks', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCatalog = async () => {
    setCatalogLoading(true);
    try {
      const data = await fetchArtworks(1, 100);
      setCatalogArtworks(data.items);
    } catch (err) {
      console.error('Failed to load catalog artworks', err);
    } finally {
      setCatalogLoading(false);
    }
  };

  useEffect(() => {
    const bars = document.querySelectorAll('.progress-bar');
    const observerOptions = { threshold: 0.1 };

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target as HTMLElement;
                const finalWidth = bar.getAttribute('data-width');
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.transition = 'width 2s cubic-bezier(0.16, 1, 0.3, 1)';
                    if (finalWidth) bar.style.width = finalWidth;
                }, 200);
                barObserver.unobserve(bar);
            }
        });
    }, observerOptions);

    bars.forEach(bar => barObserver.observe(bar));

    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    reveals.forEach(reveal => revealObserver.observe(reveal));
    
    return () => {
        barObserver.disconnect();
        revealObserver.disconnect();
    }
  }, [artworks]);

  return (
    <div className="bg-paper-white text-primary selection:bg-gallery-gold/30 font-body-md overflow-x-hidden min-h-screen">
      
      { /* Swap Modal Overlay */ }
      <div className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${modalOpen ? 'visible opacity-100' : 'invisible opacity-0'}`} id="swapModal">
        <div className={`bg-paper-white p-12 max-w-lg w-full shadow-2xl relative transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${modalOpen ? 'scale-100' : 'scale-95'}`}>
          <button className="absolute top-6 right-6 text-primary/50 hover:text-primary transition-colors cursor-pointer" onClick={() => setModalOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
          <span className="font-label-caps text-[10px] tracking-widest text-gallery-gold uppercase mb-4 block">CURATION SERVICES</span>
          <h3 className="font-display-md text-3xl text-primary mb-6">Initiate Artwork Swap</h3>
          <p className="font-body-md text-primary/70 mb-10 leading-relaxed">
            Our white-glove rotation service ensures a seamless transition. Select your preferred replacement from the catalog, and our logistics team will handle the installation and return of your current piece.
          </p>
          <div className="space-y-4">
            <Link to="/collections" className="w-full bg-primary text-white py-4 font-label-caps text-[11px] tracking-widest hover:bg-gallery-gold transition-colors uppercase cursor-pointer flex justify-center">BROWSE CATALOG</Link>
            <button className="w-full border border-gallery-gold/30 py-4 font-label-caps text-[11px] tracking-widest hover:bg-subtle-smoke transition-colors uppercase cursor-pointer" onClick={() => setModalOpen(false)}>CANCEL</button>
          </div>
        </div>
      </div>

      { /* Sidebar Navigation Shell */ }
      <aside className="h-screen w-64 fixed left-0 top-0 bg-subtle-smoke border-r border-gallery-gold/20 flex flex-col z-40">
        <div className="px-8 py-10">
          <Link to="/">
            <h1 className="font-display-lg text-2xl text-primary tracking-widest uppercase">The Kala Vault</h1>
          </Link>
          <p className="font-label-caps text-[10px] tracking-widest text-gallery-gold uppercase mt-2">CURATED MANAGEMENT</p>
        </div>
        <nav className="flex-1 px-4 flex flex-col gap-2 hide-scrollbar overflow-y-auto">
          <Link to="/customer?tab=portfolio" className={`group relative flex items-center gap-4 px-4 py-3 font-bold transition-all ${activeTab === 'portfolio' ? 'text-primary border-l-2 border-gallery-gold bg-gallery-gold/5' : 'text-primary/70 hover:bg-gallery-gold/5 hover:text-gallery-gold border-l-2 border-transparent'}`}>
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span className="font-label-caps text-[11px] tracking-widest uppercase">Portfolio</span>
          </Link>
          <Link to="/customer?tab=catalog" className={`group relative flex items-center gap-4 px-4 py-3 font-bold transition-all ${activeTab === 'catalog' ? 'text-primary border-l-2 border-gallery-gold bg-gallery-gold/5' : 'text-primary/70 hover:bg-gallery-gold/5 hover:text-gallery-gold border-l-2 border-transparent'}`}>
            <span className="material-symbols-outlined text-[18px]">palette</span>
            <span className="font-label-caps text-[11px] tracking-widest uppercase">Browse Catalog</span>
          </Link>
          <Link to="/customer?tab=legal" className={`group relative flex items-center gap-4 px-4 py-3 font-bold transition-all ${activeTab === 'legal' ? 'text-primary border-l-2 border-gallery-gold bg-gallery-gold/5' : 'text-primary/70 hover:bg-gallery-gold/5 hover:text-gallery-gold border-l-2 border-transparent'}`}>
            <span className="material-symbols-outlined text-[18px]">gavel</span>
            <span className="font-label-caps text-[11px] tracking-widest uppercase">Legal & Terms</span>
          </Link>
        </nav>
        
        <div className="p-6 border-t border-gallery-gold/20 space-y-4">
          <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 bg-white flex items-center justify-center border border-gallery-gold/30">
              <span className="material-symbols-outlined text-primary text-[18px]">person</span>
            </div>
            <div className="overflow-hidden">
              <p className="font-label-caps text-[11px] tracking-widest uppercase truncate text-primary">
                {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Alexander Voss'}
              </p>
              <p className="text-[9px] text-gallery-gold uppercase tracking-[0.2em] mt-1">Collector Tier</p>
            </div>
          </div>
          <Link onClick={() => auth.signOut()} className="flex items-center gap-4 px-2 py-2 text-primary/70 hover:text-gallery-gold transition-colors" to="/">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="font-label-caps text-[11px] tracking-widest uppercase">Logout</span>
          </Link>
        </div>
      </aside>

      { /* Main Content Area */ }
      <main className="ml-64 min-h-screen flex flex-col">
        { /* Header */ }
        <header className="h-24 flex items-center justify-between px-12 bg-paper-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gallery-gold/20">
          <div>
            <h2 className="font-display-md text-3xl tracking-tight text-primary">Collector Dashboard</h2>
          </div>
          <div className="flex items-center gap-8">
            <button 
              className={`bg-primary text-white font-label-caps text-[10px] tracking-widest uppercase px-8 py-3 flex items-center gap-3 relative overlay-hidden group transition-colors ${
                artworks.some(art => {
                  const acq = new Date(art.metadata?.acquiredAt || art.createdAt || new Date());
                  return Math.ceil(Math.abs(new Date().getTime() - acq.getTime()) / (1000 * 60 * 60 * 24)) >= 90;
                }) ? 'hover:bg-gallery-gold cursor-pointer' : 'opacity-50 cursor-not-allowed'
              }`} 
              onClick={() => {
                const hasEligible = artworks.some(art => {
                  const acq = new Date(art.metadata?.acquiredAt || art.createdAt || new Date());
                  return Math.ceil(Math.abs(new Date().getTime() - acq.getTime()) / (1000 * 60 * 60 * 24)) >= 90;
                });
                if (hasEligible) setModalOpen(true);
                else alert('No artworks are currently eligible for a swap. A 3-month holding period is required.');
              }}
            >
              <span className="relative z-10">Request Artwork Swap</span>
              <span className="material-symbols-outlined relative z-10 text-[16px]">swap_calls</span>
            </button>
          </div>
        </header>

        { /* Dashboard Content Grid */ }
        <div className="max-w-[1600px] mx-auto px-12 py-16 flex-1 w-full">
          
          {activeTab === 'portfolio' && (
            <div className="grid grid-cols-12 gap-16 mb-20">
              <div className="col-span-12 lg:col-span-8 reveal">
                <section className="space-y-2 mb-10 border-b border-gallery-gold/20 pb-4">
                  <span className="font-label-caps text-[10px] tracking-widest text-gallery-gold uppercase block">PORTFOLIO</span>
                  <h3 className="font-display-md text-4xl tracking-tight text-primary">Owned Pieces</h3>
                </section>
              
              { /* Subscription Cards List */ }
              <div className="space-y-8">
                {loading ? (
                  <p className="text-primary/50 text-sm font-label-caps">Syncing portfolio...</p>
                ) : artworks.length === 0 ? (
                  <div className="bg-subtle-smoke p-12 border border-gallery-gold/20 text-center">
                    <p className="font-body-md text-primary/60 mb-6">No active in-residence collections.</p>
                    <Link to="/collections" className="px-8 py-3 bg-primary text-white font-label-caps text-[11px] tracking-widest uppercase hover:bg-gallery-gold transition-colors">
                      Browse & Acquire Artwork
                    </Link>
                  </div>
                ) : (
                  artworks.map((art, index) => {
                    const imageUrl = art.images && art.images[0] 
                      ? (art.images[0].fileKey.startsWith('http') ? art.images[0].fileKey : `${API_BASE_URL}/uploads/${art.images[0].fileKey}`)
                      : 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600';
                    
                    const acquiredDate = new Date(art.metadata?.acquiredAt || art.createdAt || new Date());
                    const diffTime = Math.abs(new Date().getTime() - acquiredDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const isEligible = diffDays >= 90;
                    const daysRemaining = Math.max(0, 90 - diffDays);
                    const percentage = Math.min(100, Math.round((diffDays / 90) * 100));

                    return (
                      <div key={art.id} className="flex flex-col md:flex-row gap-8 bg-subtle-smoke p-0 border border-gallery-gold/20 hover:border-gallery-gold/50 transition-colors group shadow-sm">
                        <div className="w-full md:w-64 aspect-[4/3] md:aspect-square relative overflow-hidden group/img shrink-0 bg-white">
                          <img alt={art.title} className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-1000" src={imageUrl} />
                          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between p-6 pl-0">
                          <div>
                            <p className="font-label-caps text-[10px] tracking-widest text-gallery-gold uppercase mb-2">{art.sku || 'ARTWORK'}</p>
                            <h4 className="font-display-md text-3xl tracking-tight text-primary mb-6">{art.title}</h4>
                            <div className="flex gap-12 mb-8">
                              <div>
                                <p className="font-label-caps text-[9px] tracking-widest text-primary/50 uppercase mb-1">ACQUIRED</p>
                                <p className="font-body-md text-lg text-primary">{acquiredDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                              </div>
                              <div>
                                <p className="font-label-caps text-[10px] tracking-widest text-primary/50 uppercase mb-1">Declared Value</p>
                                <p className="font-body-md text-lg text-primary">₹{((art.replacementValue || 0)).toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between items-end">
                              <p className="font-label-caps text-[9px] tracking-widest text-primary/60 uppercase">ROTATION ELIGIBILITY: {percentage}% COMPLETE</p>
                              <p className="font-label-caps text-[10px] tracking-widest text-gallery-gold uppercase">{isEligible ? 'ELIGIBLE NOW' : `${daysRemaining} Days Remaining`}</p>
                            </div>
                            <div className="w-full h-1 bg-gallery-gold/10 overflow-hidden">
                              <div className="h-full bg-gallery-gold progress-bar" data-width={`${percentage}%`}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            { /* Activity Sidebar */ }
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-8 reveal" style={{ transitionDelay: '200ms' }}>
              <section className="bg-white p-10 border border-gallery-gold/20 shadow-sm flex-1">
                <span className="font-label-caps text-[10px] tracking-widest text-gallery-gold uppercase mb-4 block">MEMBER ACTIVITY</span>
                <h3 className="font-display-md text-3xl tracking-tight text-primary mb-10 pb-4 border-b border-gallery-gold/10">Recent Swap History</h3>
                <div className="space-y-10">
                  <div className="flex gap-6 group">
                    <div className="relative shrink-0">
                      <div className="w-px h-full bg-gallery-gold/20 absolute left-1/2 -translate-x-1/2 top-4"></div>
                      <div className="w-3 h-3 rounded-full bg-gallery-gold relative z-10 ring-4 ring-white"></div>
                    </div>
                    <div>
                      <p className="font-label-caps text-[10px] tracking-widest text-primary uppercase">SWAP COMPLETED</p>
                      <p className="text-primary/50 font-label-caps text-[9px] tracking-widest mb-3 mt-1 uppercase">Dec 15, 2025</p>
                      <p className="font-body-md text-sm text-primary mb-1 border-l-2 border-primary/20 pl-4">"The Fragmented Shore" returned.</p>
                      <p className="font-body-md text-sm text-primary border-l-2 border-primary/20 pl-4">"Echoes of Silence No. 4" installed.</p>
                    </div>
                  </div>
                  <div className="flex gap-6 group">
                    <div className="relative shrink-0">
                      <div className="w-3 h-3 rounded-full bg-subtle-smoke border border-gallery-gold/50 relative z-10 ring-4 ring-white"></div>
                    </div>
                    <div>
                      <p className="font-label-caps text-[10px] tracking-widest text-primary uppercase">SUBSCRIPTION INITIATED</p>
                      <p className="text-primary/50 font-label-caps text-[9px] tracking-widest mb-3 mt-1 uppercase">Oct 12, 2025</p>
                      <p className="font-body-md text-sm text-primary border-l-2 border-primary/20 pl-4">Premium Collection Plan activated.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          )}

          {activeTab === 'catalog' && (
            <div className="reveal">
              <section className="space-y-2 mb-10 border-b border-gallery-gold/20 pb-4">
                <span className="font-label-caps text-[10px] tracking-widest text-gallery-gold uppercase block">DISCOVER</span>
                <h3 className="font-display-md text-4xl tracking-tight text-primary">Curated Catalog</h3>
              </section>
              
              {catalogLoading ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8 mt-8">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="break-inside-avoid">
                      <SkeletonArtworkCard />
                    </div>
                  ))}
                </div>
              ) : catalogArtworks.length === 0 ? (
                <div className="w-full flex items-center justify-center py-24">
                  <p className="font-body-md text-primary/50">No artworks found in the catalog.</p>
                </div>
              ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8 mt-8">
                  {catalogArtworks.map((art, idx) => (
                    <div key={art.id} className="break-inside-avoid">
                      <ArtworkCard artwork={art} index={idx} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="reveal max-w-4xl">
              <section className="space-y-2 mb-10 border-b border-gallery-gold/20 pb-4">
                <span className="font-label-caps text-[10px] tracking-widest text-gallery-gold uppercase block">ADMINISTRATIVE</span>
                <h3 className="font-display-md text-4xl tracking-tight text-primary">Legal & Terms</h3>
              </section>

              <div className="space-y-12 text-primary/80">
                <p className="font-body-lg text-lg text-primary border-l-2 border-gallery-gold/30 pl-5 leading-relaxed">
                  Welcome to The Kala Vault. This section outlines our legal terms, privacy policy, and user agreements for members.
                </p>

                <section className="bg-white p-8 border border-outline/10 shadow-sm">
                  <h2 className="font-display-md text-2xl mb-4 text-primary">1. Terms of Service</h2>
                  <p className="leading-relaxed">
                    By accessing our platform and utilizing the customer dashboard, you agree to abide by our terms of service and any applicable laws. 
                    The artworks leased or purchased through The Kala Vault are subject to our rotation and ownership policies. Members are responsible for the safe keeping of the pieces under their care.
                  </p>
                </section>

                <section className="bg-white p-8 border border-outline/10 shadow-sm">
                  <h2 className="font-display-md text-2xl mb-4 text-primary">2. Privacy Policy</h2>
                  <p className="leading-relaxed">
                    We respect your privacy and are committed to protecting your personal data. 
                    Your information is used strictly for authentication, curation, logistics scheduling, and payment processing. We do not sell your personal data to third parties.
                  </p>
                </section>

                <section className="bg-white p-8 border border-outline/10 shadow-sm">
                  <h2 className="font-display-md text-2xl mb-4 text-primary">3. Swap & Rotation Policy</h2>
                  <p className="leading-relaxed">
                    Artworks acquired or leased may only be swapped or rotated after a minimum holding period of 3 months (90 days). The Kala Vault handles all logistics, packaging, and transportation associated with the swap.
                  </p>
                </section>
              </div>
            </div>
          )}
        </div>

        <footer className="w-full px-12 py-12 flex flex-col items-center justify-center bg-paper-white border-t border-gallery-gold/20 mt-auto">
          <p className="font-label-caps text-[9px] tracking-widest uppercase text-primary/40">© 2026 The Kala Vault. All Rights Reserved.</p>
        </footer>
      </main>
    </div>
  );
}
