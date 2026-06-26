import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { getArtworkDetailById, getAdjacentArtworks, ArtworkDetailedInfo } from '../services/artworkDetailService';
import { getArtworkImageWithWatermark } from '../services/artworkService';
import { ArtworkTierBadge, PricingDetails } from '../components/ArtworkTierInfo';
import ArtworkCard from '../components/ArtworkCard';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

// Standard EMI Compound Interest Loan Formula: EMI = [P x R x (1+R)^N]/[((1+R)^N)-1]
const calculateEMI = (principal: number, annualRate: number, months: number): number => {
  if (annualRate === 0) {
    return principal / months;
  }
  const r = annualRate / 12 / 100; // monthly rate
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
};

const ENVS = [
  {
    name: 'Executive Boardroom',
    url: '/assets/rooms/boardroom.png',
    artStyle: {
      top: '32%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  },
  {
    name: 'Minimalist Living Room',
    url: '/assets/rooms/living_room.png',
    artStyle: {
      top: '35%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  },
  {
    name: 'Gallery Lobby Reception',
    url: '/assets/rooms/gallery_lounge.png',
    artStyle: {
      top: '32%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  }
];

const getArtWidthForTier = (tier: string) => {
  switch (tier) {
    case 'small': return '12%';
    case 'medium': return '18%';
    case 'large': return '26%';
    case 'extra-large': return '34%';
    default: return '20%';
  }
};

export default function ArtworkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [artwork, setArtwork] = useState<ArtworkDetailedInfo | null>(null);
  const [watermarkedImage, setWatermarkedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [adjacent, setAdjacent] = useState({ prev: null as any, next: null as any });
  const [isInsitu, setIsInsitu] = useState(false);
  const [activeEnv, setActiveEnv] = useState(0);
  const [isImmersive, setIsImmersive] = useState(false);
  const [artScale, setArtScale] = useState(1.0);
  const [purchaseMode, setPurchaseMode] = useState<'monthly' | 'full'>('monthly');
  const [selectedMonths, setSelectedMonths] = useState<3 | 6 | 9 | 12>(3);

  const { addToCart } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  // Hover Zoom State
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);

  // Lock body scroll when immersive room mode is active
  useEffect(() => {
    if (isImmersive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isImmersive]);

  const handleAcquisition = (actionType: string) => {
    if (!user) {
      navigate(`/signin?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }

    if (!artwork) return;

    if (actionType.startsWith('monthly')) {
      const price = Math.round(
        artwork.metadata?.pricingTiers?.[selectedMonths.toString()] ||
        artwork.rentalPriceCents ||
        ((artwork.replacementValue || 0) / selectedMonths)
      );
      addToCart({
        artworkId: artwork.id,
        name: `${artwork.name} (${selectedMonths} Months)`,
        price: price,
        type: `monthly_${selectedMonths}` as any,
        imageUrl: artwork.localPath
      });
      navigate('/cart');
    } else if (actionType === 'full') {
      addToCart({
        artworkId: artwork.id,
        name: artwork.name,
        price: artwork.replacementValue || 0,
        type: 'full',
        imageUrl: artwork.localPath
      });
      alert('Redirecting to secure Razorpay checkout...');
      window.open('https://razorpay.com', '_blank');
    } else if (actionType === 'info') {
      navigate(`/inquire?artwork=${encodeURIComponent(artwork?.name || '')}&artist=${encodeURIComponent(artwork?.artist || '')}`);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: artwork?.name || 'Artwork',
          text: `Check out ${artwork?.name} on Kalavault`,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [artPosition, setArtPosition] = useState({ top: 35, left: 50 });

  // Reset coordinate position when environment room selection changes
  useEffect(() => {
    if (ENVS[activeEnv]) {
      const defaultStyle = ENVS[activeEnv].artStyle;
      const t = parseFloat(defaultStyle.top);
      const l = parseFloat(defaultStyle.left);
      setArtPosition({ top: t, left: l });
    }
  }, [activeEnv]);

  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
  };

  useEffect(() => {
    const handleDrag = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - dragStart.x;
      const deltaY = clientY - dragStart.y;

      const containerId = isImmersive ? 'insitu-immersive-container' : 'insitu-container';
      const container = document.getElementById(containerId);
      if (container) {
        const rect = container.getBoundingClientRect();
        const pctX = (deltaX / rect.width) * 100;
        const pctY = (deltaY / rect.height) * 100;

        setArtPosition(prev => ({
          top: Math.max(5, Math.min(95, prev.top + pctY)),
          left: Math.max(5, Math.min(95, prev.left + pctX))
        }));
        setDragStart({ x: clientX, y: clientY });
      }
    };

    const handleDragEndGlobal = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEndGlobal);
      window.addEventListener('touchmove', handleDrag, { passive: false });
      window.addEventListener('touchend', handleDragEndGlobal);
    }

    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEndGlobal);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('touchend', handleDragEndGlobal);
    };
  }, [isDragging, dragStart, isImmersive]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!id) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const artworkData = await getArtworkDetailById(id);
        if (artworkData) {
          setArtwork(artworkData);
          const adjacentData = await getAdjacentArtworks(id);
          setAdjacent(adjacentData);
        }
      } catch (err) {
        console.error("Error fetching artwork data:", err);
      } finally {
        setLoading(false);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="bg-paper-white text-primary min-h-screen flex flex-col pt-16 md:pt-24">
        <TopNavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-3 border-gallery-gold/30 border-t-gallery-gold rounded-full animate-spin" />
            <p className="font-body-md text-on-surface-variant">Loading artwork...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="bg-paper-white text-primary min-h-screen flex flex-col pt-16 md:pt-24">
        <TopNavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display-lg text-4xl mb-4">Artwork Not Found</h1>
            <p className="font-body-md text-on-surface-variant mb-8">The artwork you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/collections')}
              className="font-label-caps text-[10px] uppercase tracking-[0.1em] px-8 py-3 bg-primary text-paper-white hover:bg-primary/90 transition-colors duration-300"
            >
              Back to Collections
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-paper-white text-primary min-h-screen flex flex-col pt-16 md:pt-20">
      <TopNavBar />

      <main className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden">
        {/* Left Panel: Immersive Visualizer (Sticky) */}
        <div className="w-full lg:w-[60%] lg:h-[calc(100vh-80px)] lg:sticky lg:top-[80px] bg-subtle-smoke flex flex-col justify-center items-center p-4 md:p-10 border-b lg:border-b-0 lg:border-r border-outline/10 select-none overflow-hidden">
          {/* Action Buttons overlay in left panel */}
          <div className="absolute top-6 left-6 z-20 flex justify-between items-center pointer-events-none">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={() => navigate('/collections')}
              className="pointer-events-auto font-label-caps text-[11px] uppercase tracking-[0.15em] font-bold text-primary hover:text-white hover:bg-primary transition-all duration-300 flex items-center gap-2 cursor-pointer bg-white/90 backdrop-blur-md px-5 py-3 rounded-full border border-outline/10 shadow-lg hover:shadow-xl"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Collections
            </motion.button>
          </div>

          {/* Viewer Container */}
          <div className="w-full h-full flex flex-col items-center justify-center max-w-4xl relative select-none mt-12 lg:mt-0">
            {!isInsitu ? (
              <div
                className="relative max-w-full max-h-[65vh] flex items-center justify-center group cursor-zoom-in rounded bg-transparent no-select"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoomPos({ x, y });
                }}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onContextMenu={(e) => e.preventDefault()}
              >
                <div className="relative inline-block overflow-hidden shadow-2xl">
                  <img
                    src={artwork.localPath}
                    alt={artwork.name}
                    className="max-h-[65vh] max-w-full w-auto h-auto block object-contain transition-transform duration-300 ease-out no-drag"
                    style={{
                      transformOrigin: isZoomed ? `${zoomPos.x}% ${zoomPos.y}%` : 'center',
                      transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                    }}
                    onDragStart={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  {/* Premium Thin Golden Frame applied tightly to the wrapper */}
                  <div className={`absolute inset-0 border-[0.15cm] border-[#cca550] mix-blend-multiply opacity-80 transition-opacity duration-300 pointer-events-none ${isZoomed ? 'opacity-0' : 'opacity-100'}`} />
                  <div className={`absolute inset-0 border-[0.15cm] border-gallery-gold shadow-[inset_0_2px_10px_rgba(0,0,0,0.4),0_8px_25px_rgba(0,0,0,0.25)] opacity-90 transition-opacity duration-300 pointer-events-none ${isZoomed ? 'opacity-0' : 'opacity-100'}`} />
                  <div className={`absolute inset-[0.15cm] border border-black/40 transition-opacity duration-300 pointer-events-none ${isZoomed ? 'opacity-0' : 'opacity-100'}`} />

                  {/* Watermark overlay */}
                  <div className={`watermark-tiled absolute inset-0 transition-opacity duration-500 pointer-events-none ${isZoomed ? 'opacity-30' : 'opacity-100'}`} />
                </div>
              </div>
            ) : (
              <div id="insitu-container" className="relative w-full h-full aspect-[16/10] overflow-hidden rounded border border-outline/5 shadow-2xl bg-white" onContextMenu={(e) => e.preventDefault()}>
                {/* Environment Room Background */}
                <img
                  src={ENVS[activeEnv].url}
                  alt={ENVS[activeEnv].name}
                  className="w-full h-full object-cover select-none no-drag"
                  onDragStart={(e) => e.preventDefault()}
                />

                {/* Artwork Positioned on the Wall - Draggable */}
                <div
                  style={{
                    position: 'absolute',
                    top: `${artPosition.top}%`,
                    left: `${artPosition.left}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${parseFloat(getArtWidthForTier(artwork.tier)) * artScale}%`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    touchAction: 'none',
                  }}
                  onMouseDown={handleStartDrag}
                  onTouchStart={handleStartDrag}
                  className={`shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 group/art select-none active:scale-[1.01] ${isDragging ? '' : 'transition-all duration-300'}`}
                >
                  <img
                    src={artwork.localPath}
                    alt={artwork.name}
                    className="w-full h-auto object-cover pointer-events-none"
                  />
                  {/* Subtle golden frame outline for the on-wall placement */}
                  <div className="absolute inset-0 border-[0.05cm] border-[#cca550] mix-blend-multiply opacity-90 pointer-events-none" />
                  <div className="absolute inset-0 border-[0.05cm] border-gallery-gold opacity-80 pointer-events-none" />
                </div>

                {/* Drag Help Overlay */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white/80 border border-white/10 rounded-lg px-3 py-1.5 pointer-events-none z-30 shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                  <div className="flex items-center gap-1.5 text-[8.5px] font-label-caps uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[13px] animate-pulse">drag_pan</span>
                    <span>Drag painting to place</span>
                  </div>
                </div>

                {/* Enter Immersive Mode Overlay Button */}
                <button
                  onClick={() => setIsImmersive(true)}
                  className="absolute top-4 right-4 bg-black/70 backdrop-blur-md hover:bg-gallery-gold hover:text-primary transition-all duration-300 text-white border border-white/20 rounded-lg px-3 py-2 flex items-center gap-1.5 cursor-pointer z-30 shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                  title="Expand Immersive View"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_full</span>
                  <span className="font-label-caps text-[9px] uppercase tracking-wider">Immersive Mode</span>
                </button>

                {/* Room Selector overlay inside the InSitu container */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center bg-black/50 backdrop-blur-md p-2 border border-white/10 rounded">
                  {ENVS.map((env, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveEnv(idx)}
                      className={`font-label-caps text-[9px] uppercase tracking-[0.15em] px-4 py-2 border transition-all duration-300 cursor-pointer ${activeEnv === idx
                          ? 'bg-paper-white text-primary border-paper-white shadow-sm font-bold'
                          : 'border-white/20 text-paper-white/80 hover:bg-white/10 hover:text-paper-white'
                        }`}
                    >
                      {env.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controls: Share and In-Situ Toggle */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 z-10 relative pointer-events-auto">
            {/* View Mode Toggle */}
            <div className="flex gap-2 border border-outline/10 rounded-full p-1 bg-white/50 backdrop-blur-md shadow-sm">
              <button
                onClick={() => setIsInsitu(false)}
                className={`font-label-caps text-[10px] uppercase tracking-[0.2em] px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 ${!isInsitu
                    ? 'bg-primary text-paper-white shadow-md'
                    : 'text-on-surface-variant hover:text-primary hover:bg-black/5'
                  }`}
              >
                Artwork Detail
              </button>
              <button
                onClick={() => setIsInsitu(true)}
                className={`font-label-caps text-[10px] uppercase tracking-[0.2em] px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 ${isInsitu
                    ? 'bg-primary text-paper-white shadow-md'
                    : 'text-on-surface-variant hover:text-primary hover:bg-black/5'
                  }`}
              >
                Context View
              </button>
            </div>

            <button
              onClick={() => {
                if (!artwork) return;
                if (isFavorite(artwork.id)) {
                  removeFavorite(artwork.id);
                } else {
                  addFavorite(artwork.id);
                }
              }}
              className={`font-label-caps text-[10px] uppercase tracking-[0.15em] font-bold hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2 cursor-pointer backdrop-blur-md px-6 py-2.5 rounded-full border border-outline/10 shadow-sm hover:shadow-md ${isFavorite(artwork?.id || '') ? 'bg-primary text-white' : 'bg-white/90 text-primary'}`}
            >
              <span className="material-symbols-outlined text-[16px]">{isFavorite(artwork?.id || '') ? 'favorite' : 'favorite_border'}</span>
              {isFavorite(artwork?.id || '') ? 'Favorited' : 'Favorite'}
            </button>

            <button
              onClick={handleShare}
              className="font-label-caps text-[10px] uppercase tracking-[0.15em] font-bold text-primary hover:text-white hover:bg-primary transition-all duration-300 flex items-center gap-2 cursor-pointer bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-outline/10 shadow-sm hover:shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              Share Artwork
            </button>
          </div>
        </div>

        <div
          data-lenis-prevent
          className="w-full lg:w-[40%] px-6 md:px-10 py-10 lg:py-14 bg-paper-white flex flex-col gap-10 lg:h-[calc(100vh-80px)] lg:overflow-y-auto border-l border-outline/10 hide-scrollbar overscroll-contain"
        >
          {/* Title and stats */}
          <div>
            <h1 className="font-display-lg text-4xl md:text-5xl text-primary mb-6 tracking-tight">
              {artwork.name}
            </h1>
            <p className="font-body-md text-on-surface-variant leading-relaxed mb-6">
              {artwork.description}
            </p>

            {/* Artwork Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-subtle-smoke/50 rounded border border-gallery-gold/10">
                <p className="font-label-caps text-[9px] text-gallery-gold uppercase tracking-wider mb-1">Value</p>
                <p className="font-display-md text-base text-primary">₹{(artwork.replacementValue || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-subtle-smoke/50 rounded border border-gallery-gold/10">
                <p className="font-label-caps text-[9px] text-gallery-gold uppercase tracking-wider mb-1">Year</p>
                <p className="font-display-md text-base text-primary">{artwork.yearCreated}</p>
              </div>
              <div className="p-3 bg-subtle-smoke/50 rounded border border-gallery-gold/10">
                <p className="font-label-caps text-[9px] text-gallery-gold uppercase tracking-wider mb-1">Tier</p>
                <div className="flex items-center">
                  <ArtworkTierBadge tier={artwork.tier} showLabel={true} className="text-[8px]" />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="border-t border-outline/10 pt-6 space-y-4">
            <div>
              <p className="font-label-caps text-[9px] text-gallery-gold uppercase tracking-wider mb-1">Medium</p>
              <p className="font-body-md text-primary text-sm">{artwork.medium}</p>
            </div>
            <div>
              <p className="font-label-caps text-[9px] text-gallery-gold uppercase tracking-wider mb-1">Condition</p>
              <p className="font-body-md text-primary text-sm">{artwork.condition}</p>
            </div>
            <div>
              <p className="font-label-caps text-[9px] text-gallery-gold uppercase tracking-wider mb-1">Customization</p>
              <p className="font-body-md text-primary text-sm">Available upon request</p>
            </div>
            <div>
              <p className="font-label-caps text-[9px] text-gallery-gold uppercase tracking-wider mb-1">Provenance</p>
              <p className="font-body-md text-primary text-xs leading-relaxed">{artwork.provenance}</p>
            </div>
          </div>

          {/* Unified Acquisition Widget */}
          <div className="border-t border-outline/10 pt-6">
            <p className="font-label-caps text-[9px] text-gallery-gold uppercase tracking-wider mb-4">Acquisition Options</p>

            <div className="flex gap-2 p-1 bg-subtle-smoke/50 border border-outline/5 rounded mb-6">
              <button
                onClick={() => setPurchaseMode('monthly')}
                className={`flex-1 py-2.5 font-label-caps text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${purchaseMode === 'monthly' ? 'bg-white shadow-sm text-primary font-bold border border-outline/5' : 'text-primary/60 hover:text-primary'}`}
              >
                Pay Monthly
              </button>
              <button
                onClick={() => setPurchaseMode('full')}
                className={`flex-1 py-2.5 font-label-caps text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${purchaseMode === 'full' ? 'bg-white shadow-sm text-primary font-bold border border-outline/5' : 'text-primary/60 hover:text-primary'}`}
              >
                Buy in Full
              </button>
            </div>

            {purchaseMode === 'monthly' ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-subtle-smoke/30 p-1 border border-outline/5 rounded">
                  {[3, 6, 9, 12].map(m => (
                    <button
                      key={m}
                      onClick={() => setSelectedMonths(m as 3 | 6 | 9 | 12)}
                      className={`flex-1 py-2 font-label-caps text-[10px] transition-colors cursor-pointer ${selectedMonths === m ? 'bg-primary text-white' : 'text-primary/70 hover:bg-black/5'}`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-end pb-2">
                  <span className="font-body-md text-sm text-on-surface-variant">Monthly Investment</span>
                  <span className="font-display-md text-3xl text-primary">
                    ₹{Math.round(
                      artwork.metadata?.pricingTiers?.[selectedMonths.toString()] ||
                      artwork.rentalPriceCents ||
                      ((artwork.replacementValue || 0) / selectedMonths)
                    ).toLocaleString('en-IN')}<span className="text-base text-primary/60 font-body-md">/mo</span>
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleAcquisition(`monthly_${selectedMonths}`)}
                    className="w-full font-label-caps text-[10px] uppercase tracking-[0.1em] px-6 py-4 bg-primary text-paper-white hover:bg-primary/90 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[14px]">shopping_cart</span>
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleAcquisition('info')}
                    className="w-full font-label-caps text-[10px] uppercase tracking-[0.1em] px-6 py-4 border border-primary text-primary hover:bg-primary/5 transition-colors duration-300 cursor-pointer"
                  >
                    Consult Curator
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-end py-2">
                  <span className="font-body-md text-sm text-on-surface-variant">Full Acquisition</span>
                  <span className="font-display-md text-3xl text-primary">
                    ₹{(artwork.replacementValue || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleAcquisition('full')}
                    className="w-full font-label-caps text-[10px] uppercase tracking-[0.1em] px-6 py-4 bg-gallery-gold text-primary hover:bg-gallery-gold/90 transition-colors shadow-sm cursor-pointer font-bold flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                    Acquire Now
                  </button>
                  <button
                    onClick={() => handleAcquisition('info')}
                    className="w-full font-label-caps text-[10px] uppercase tracking-[0.1em] px-6 py-4 border border-primary text-primary hover:bg-primary/5 transition-colors duration-300 cursor-pointer"
                  >
                    Consult Curator
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Related Artworks */}
          {artwork.relatedArtworks && artwork.relatedArtworks.length > 0 && (
            <div className="border-t border-outline/10 pt-8 mt-4">
              <h2 className="font-display-md text-2xl mb-8 text-primary">Related Artworks</h2>
              <div className="grid grid-cols-2 gap-4">
                {artwork.relatedArtworks.map((related, idx) => (
                  <ArtworkCard key={related.id} artwork={related} index={idx} />
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          {(adjacent.prev || adjacent.next) && (
            <div className="border-t border-outline/10 pt-6 mt-4 flex justify-between">
              {adjacent.prev ? (
                <button
                  onClick={() => navigate(`/artwork/${adjacent.prev.id}`)}
                  className="font-label-caps text-[10px] uppercase tracking-[0.1em] text-gallery-gold hover:text-gallery-gold/80 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  ← Previous
                </button>
              ) : (
                <div />
              )}
              {adjacent.next ? (
                <button
                  onClick={() => navigate(`/artwork/${adjacent.next.id}`)}
                  className="font-label-caps text-[10px] uppercase tracking-[0.1em] text-gallery-gold hover:text-gallery-gold/80 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Next →
                </button>
              ) : (
                <div />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Immersive Fullscreen Room Visualizer */}
      <AnimatePresence>
        {isImmersive && (
          <motion.div
            id="insitu-immersive-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-[#0a0a0a] flex items-center justify-center select-none overflow-hidden"
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Environment Room Background */}
            <img
              src={ENVS[activeEnv].url}
              alt={ENVS[activeEnv].name}
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none opacity-95 no-drag"
              onDragStart={(e) => e.preventDefault()}
            />

            {/* Artwork Positioned on the Wall - Draggable */}
            <div
              style={{
                position: 'absolute',
                top: `${artPosition.top}%`,
                left: `${artPosition.left}%`,
                transform: 'translate(-50%, -50%)',
                width: `${parseFloat(getArtWidthForTier(artwork.tier)) * artScale}%`,
                cursor: isDragging ? 'grabbing' : 'grab',
                touchAction: 'none',
              }}
              onMouseDown={handleStartDrag}
              onTouchStart={handleStartDrag}
              className={`shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/10 z-10 group/immersive-art select-none active:scale-[1.01] ${isDragging ? '' : 'transition-all duration-300'}`}
            >
              <img
                src={artwork.localPath}
                alt={artwork.name}
                className="w-full h-auto object-cover pointer-events-none"
              />
              {/* Subtle golden frame outline for the on-wall placement */}
              <div className="absolute inset-0 border-[0.06cm] border-[#cca550] mix-blend-multiply opacity-90 pointer-events-none" />
              <div className="absolute inset-0 border-[0.06cm] border-gallery-gold opacity-80 pointer-events-none" />
            </div>

            {/* Drag Help Overlay */}
            <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md text-white/80 border border-white/10 rounded-lg px-4 py-2 pointer-events-none z-30 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2 text-[10px] font-label-caps uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px] animate-pulse">drag_pan</span>
                <span>Drag painting to reposition on the wall</span>
              </div>
            </div>

            {/* Immersive Controls Panel at bottom */}
            <div className="absolute bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[90%] max-w-4xl bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 z-20 shadow-2xl">
              {/* Left Column: Room Selectors */}
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="font-label-caps text-[9px] text-gallery-gold/80 uppercase tracking-[0.2em] text-center md:text-left">Select Environment</span>
                <div className="flex gap-2 justify-center md:justify-start">
                  {ENVS.map((env, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveEnv(idx)}
                      className={`font-label-caps text-[9px] uppercase tracking-[0.15em] px-4 py-2 border transition-all duration-300 cursor-pointer ${activeEnv === idx
                          ? 'bg-paper-white text-primary border-paper-white shadow-sm font-bold'
                          : 'border-white/20 text-paper-white/80 hover:bg-white/10 hover:text-paper-white'
                        }`}
                    >
                      {env.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Middle Column: Scale Slider */}
              <div className="flex flex-col gap-2 w-full md:w-1/3">
                <div className="flex justify-between items-center">
                  <span className="font-label-caps text-[9px] text-gallery-gold/80 uppercase tracking-[0.2em]">Artwork Scale</span>
                  <span className="font-label-caps text-[9px] text-white/60 tracking-wider">
                    {Math.round(artScale * 100)}% {artScale === 1.0 ? '(Default)' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={artScale}
                  onChange={(e) => setArtScale(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/20 appearance-none outline-none rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-gallery-gold [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                />
              </div>

              {/* Right Column: Close Button */}
              <div className="flex items-center justify-end w-full md:w-auto mt-2 md:mt-0">
                <button
                  onClick={() => setIsImmersive(false)}
                  className="w-full md:w-auto font-label-caps text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-gallery-gold px-6 py-3 hover:bg-paper-white hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                  Exit Immersive View
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
