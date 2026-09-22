import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { getArtworkDetailById, getArtworkDetailByIdSync, getAdjacentArtworks, recordArtworkView, getRecentlyViewedArtworks } from '../services/artworkDetailService';
import { getArtworkImages, sanitizeArtworkImageUrl, FALLBACK_PAINTINGS } from '../services/artworkService';
import { CollectionArtwork } from '../lib/collectionsData';
import ArtworkCard from '../components/ArtworkCard';
import RobustArtworkImage from '../components/RobustArtworkImage';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { initiateRazorpayCheckout } from '../services/paymentService';
import { PaymentSuccessModal } from '../components/PaymentSuccessModal';

const ENVS = [
  {
    name: 'Executive Boardroom',
    url: '/assets/rooms/boardroom.png',
    artStyle: {
      top: '32%',
      left: '50%',
    }
  },
  {
    name: 'Minimalist Living Room',
    url: '/assets/rooms/living_room.png',
    artStyle: {
      top: '35%',
      left: '50%',
    }
  },
  {
    name: 'Gallery Lobby Reception',
    url: '/assets/rooms/gallery_lounge.png',
    artStyle: {
      top: '32%',
      left: '50%',
    }
  }
];

const getArtWidthForTier = (tier: string) => {
  switch (tier?.toLowerCase()) {
    case 'small': return '14%';
    case 'medium': return '20%';
    case 'large': return '28%';
    case 'extra-large': return '36%';
    default: return '22%';
  }
};

export default function ArtworkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const { data: artwork, isLoading: isArtworkLoading } = useQuery({
    queryKey: ['artwork', id],
    queryFn: () => getArtworkDetailById(id!),
    initialData: () => (id ? (getArtworkDetailByIdSync(id) || undefined) : undefined),
    enabled: !!id,
    staleTime: 1000 * 60 * 5
  });

  const { data: adjacentData } = useQuery({
    queryKey: ['adjacent-artwork', id],
    queryFn: () => getAdjacentArtworks(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5
  });

  const loading = isArtworkLoading;
  const adjacent = adjacentData || { prev: null, next: null };

  const [isInsitu, setIsInsitu] = useState(false);
  const [activeEnv, setActiveEnv] = useState(0);
  const [isImmersive] = useState(false);
  const [artScale] = useState(1.0);
  const [purchaseMode, setPurchaseMode] = useState<'monthly' | 'full'>('monthly');
  const [selectedMonths, setSelectedMonths] = useState<3 | 6 | 9 | 12>(3);
  const [isPaying, setIsPaying] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{
    paymentId: string;
    orderId: string;
    amount: number;
    receipt?: string;
  } | null>(null);

  const { addToCart } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<CollectionArtwork[]>([]);
  const [recommendationTab, setRecommendationTab] = useState<'viewed' | 'curated'>('viewed');

  useEffect(() => {
    if (id) {
      recordArtworkView(id);
      const viewed = getRecentlyViewedArtworks(id);
      setRecentlyViewed(viewed);
      if (viewed.length > 0) {
        setRecommendationTab('viewed');
      } else {
        setRecommendationTab('curated');
      }
      setActiveImageIndex(0);
    }
  }, [id]);

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
        artwork.originalArtwork?.metadata?.pricingTiers?.[selectedMonths.toString()] ||
        artwork.originalArtwork?.rentalPriceCents ||
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
      const price = artwork.replacementValue || 0;
      setIsPaying(true);
      initiateRazorpayCheckout({
        amount: price,
        description: `Direct Acquisition: ${artwork.name} by ${artwork.artist || 'The Kala Vault'}`,
        artworkId: artwork.id,
        notes: {
          artworkId: artwork.id,
          artworkName: artwork.name,
          artist: artwork.artist || '',
          type: 'full_acquisition',
        },
        customerName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : undefined,
        customerEmail: user?.email,
        onSuccess: (paymentData) => {
          setIsPaying(false);
          setSuccessDetails(paymentData);
        },
        onError: (err) => {
          setIsPaying(false);
          alert(err || 'Payment failed.');
        },
        onDismiss: () => {
          setIsPaying(false);
        },
      });
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
        alert('Artwork link copied to clipboard!');
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [artPosition, setArtPosition] = useState({ top: 35, left: 50 });

  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX, y: clientY });
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const dx = clientX - dragStart.x;
      const dy = clientY - dragStart.y;
      
      const container = document.getElementById('insitu-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        const dTopPct = (dy / rect.height) * 100;
        const dLeftPct = (dx / rect.width) * 100;
        
        setArtPosition(prev => ({
          top: Math.max(10, Math.min(85, prev.top + dTopPct)),
          left: Math.max(10, Math.min(90, prev.left + dLeftPct))
        }));
      }
      setDragStart({ x: clientX, y: clientY });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragStart]);

  if (loading) {
    return (
      <div className="bg-[#FAF6F0] text-[#1E1412] min-h-screen flex flex-col pt-20 md:pt-28">
        <TopNavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A0E17]" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="bg-[#FAF6F0] text-[#1E1412] min-h-screen flex flex-col pt-20 md:pt-28">
        <TopNavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <h1 className="font-cinzel text-3xl mb-3 text-[#1E1412]">Artwork Not Found</h1>
            <p className="text-[#1E1412]/70 text-sm mb-6 font-body-md">The requested artwork may have been archived or leased.</p>
            <button
              onClick={() => navigate('/collections')}
              className="pill-button pill-button-bordeaux text-xs"
            >
              RETURN TO COLLECTIONS
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const monthlyCost = Math.round(
    artwork.originalArtwork?.metadata?.pricingTiers?.[selectedMonths.toString()] ||
    artwork.originalArtwork?.rentalPriceCents ||
    ((artwork.replacementValue || 15000) * 0.012)
  );

  const galleryViews = (artwork.galleryImages && artwork.galleryImages.length > 0)
    ? artwork.galleryImages
    : getArtworkImages(artwork.originalArtwork || (artwork as any));

  const currentView = galleryViews[activeImageIndex] || galleryViews[0];
  const activeImageUrl = sanitizeArtworkImageUrl(currentView?.fileKey, artwork.id);

  return (
    <div className="bg-[#FAF6F0] text-[#1E1412] min-h-screen flex flex-col pt-20 md:pt-24 selection:bg-[#C5A059]/30">
      <TopNavBar />

      <main className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden">
        
        {/* Left Visualizer Panel */}
        <div className="w-full lg:w-[58%] lg:h-[calc(100vh-96px)] lg:sticky lg:top-[96px] bg-[#F5EFEB] flex flex-col justify-between items-center p-6 md:p-12 border-b lg:border-b-0 lg:border-r border-[#C5A059]/25 select-none overflow-hidden">
          
          {/* Top Bar: Back to Collections Pill */}
          <div className="w-full flex justify-between items-center z-20">
            <button
              onClick={() => navigate('/collections')}
              aria-label="Back to Collections"
              className="flex items-center gap-2 bg-[#FAF6F0]/95 backdrop-blur-md px-4 py-2 rounded-full border border-[#C5A059]/30 text-[#1E1412] hover:bg-[#4A0E17] hover:text-[#FAF6F0] hover:border-[#C5A059] transition-all duration-300 font-cinzel text-[11px] font-bold uppercase tracking-wider cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Catalog</span>
            </button>
          </div>

          {/* Main Visualizer Container */}
          <div className="w-full flex-1 flex flex-col items-center justify-center relative select-none my-4">
            {!isInsitu ? (
              <div className="flex flex-col items-center justify-center w-full">
                
                {/* Artwork with Thin Luxury Wooden Frame Finish and Interactive Zoom */}
                <div
                  className="relative flex items-center justify-center group cursor-zoom-in no-select"
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
                  <div className="relative inline-flex items-center justify-center p-[4px] bg-gradient-to-b from-[#3E2419] via-[#2A160F] to-[#1E0E08] border-[6px] sm:border-[8px] border-[#341B12] shadow-[0_24px_60px_rgba(26,13,8,0.35)] transition-all duration-300">
                    <div className="relative p-[1.5px] bg-gradient-to-tr from-[#9E7D38]/70 via-[#DFC07D]/90 to-[#9E7D38]/70 overflow-hidden">
                      <div className="relative overflow-hidden flex items-center justify-center bg-[#120704] min-w-[200px] min-h-[260px]">
                        <RobustArtworkImage
                          src={activeImageUrl}
                          fallbackUrls={currentView?.fallbackUrls}
                          seed={`${artwork.id}-${activeImageIndex}`}
                          alt={`${artwork.name} - ${currentView?.label || 'Perspective'}`}
                          loading="eager"
                          decoding="async"
                          className="max-h-[54vh] max-w-full w-auto h-auto block object-contain transition-transform duration-300 ease-out no-drag relative z-10 will-change-transform"
                          style={{
                            transformOrigin: isZoomed ? `${zoomPos.x}% ${zoomPos.y}%` : 'center',
                            transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                            backfaceVisibility: 'hidden',
                          }}
                          onDragStart={(e) => e.preventDefault()}
                          onContextMenu={(e) => e.preventDefault()}
                        />
                        
                        {/* Watermark Overlay */}
                        <div className={`watermark-tiled absolute inset-0 transition-opacity duration-500 pointer-events-none z-20 ${isZoomed ? 'opacity-35' : 'opacity-60'}`} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Multi-Angle Thumbnails with View Indicator */}
                <div className="flex flex-col items-center gap-2 mt-5 w-full">
                  <div className="flex items-center gap-2 text-[10px] font-cinzel text-[#4A0E17] uppercase tracking-[0.2em] font-semibold">
                    <span>✦ VIEW 0{activeImageIndex + 1} / 0{galleryViews.length}:</span>
                    <span className="text-[#1E1412] font-bold">{currentView?.label || 'MUSEUM PERSPECTIVE'}</span>
                  </div>

                  <div className="flex gap-2.5 sm:gap-3 overflow-x-auto py-1 px-4 max-w-full justify-center">
                    {galleryViews.map((img, idx) => {
                      const isSelected = activeImageIndex === idx;
                      return (
                        <button
                          key={img.id || idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative group/thumb rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer p-0.5 ${
                            isSelected 
                              ? 'border-[#4A0E17] ring-2 ring-[#C5A059]/80 scale-105 shadow-md bg-white' 
                              : 'border-[#C5A059]/30 opacity-70 hover:opacity-100 hover:border-[#C5A059] bg-[#FAF6F0]'
                          }`}
                          title={img.label}
                        >
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden bg-[#1E0E08]">
                            <RobustArtworkImage
                              src={img.fileKey}
                              fallbackUrls={img.fallbackUrls}
                              seed={`${artwork.id}-${idx}`}
                              alt={img.label}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              <div id="insitu-container" className="relative w-full h-full aspect-[16/10] overflow-hidden rounded-3xl border border-[#C5A059]/30 shadow-2xl bg-white" onContextMenu={(e) => e.preventDefault()}>
                <img
                  src={ENVS[activeEnv].url}
                  alt={ENVS[activeEnv].name}
                  className="w-full h-full object-cover select-none no-drag"
                  onDragStart={(e) => e.preventDefault()}
                />

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
                  className={`shadow-[0_30px_60px_rgba(36,22,17,0.4)] border border-white/20 select-none active:scale-[1.01] ${isDragging ? '' : 'transition-all duration-300'}`}
                >
                  <RobustArtworkImage
                    src={artwork.localPath}
                    seed={artwork.id}
                    alt={artwork.name}
                    className="w-full h-auto object-cover pointer-events-none"
                  />
                </div>

                {/* Room Selector Pills */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center bg-[#160D0A]/90 backdrop-blur-md p-2 border border-[#C5A059]/25 rounded-full">
                  {ENVS.map((env, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveEnv(idx)}
                      className={`font-cinzel text-[10.5px] uppercase tracking-wider px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                        activeEnv === idx
                          ? 'bg-[#C5A059] text-[#241611] font-bold shadow-sm'
                          : 'text-[#FAF6F0]/80 hover:bg-white/10'
                      }`}
                    >
                      {env.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Pill Controls */}
          <div className="w-full flex flex-wrap justify-center items-center gap-3 z-20">
            <div className="flex bg-[#FAF6F0]/90 backdrop-blur-md p-1 rounded-full border border-[#C5A059]/30 shadow-xs">
              <button
                onClick={() => setIsInsitu(false)}
                className={`font-cinzel text-[10.5px] font-bold uppercase tracking-wider px-5 py-2 rounded-full cursor-pointer transition-all ${
                  !isInsitu ? 'bg-[#4A0E17] text-[#FAF6F0] shadow-xs' : 'text-[#1E1412]/70 hover:text-[#4A0E17]'
                }`}
              >
                ARTWORK VIEW
              </button>
              <button
                onClick={() => setIsInsitu(true)}
                className={`font-cinzel text-[10.5px] font-bold uppercase tracking-wider px-5 py-2 rounded-full cursor-pointer transition-all ${
                  isInsitu ? 'bg-[#4A0E17] text-[#FAF6F0] shadow-xs' : 'text-[#1E1412]/70 hover:text-[#4A0E17]'
                }`}
              >
                ROOM CONTEXT
              </button>
            </div>

            <button
              onClick={() => {
                if (!user) {
                  navigate(`/signin?redirect=${encodeURIComponent(location.pathname + location.search)}`);
                  return;
                }
                if (!artwork) return;
                if (isFavorite(artwork.id)) {
                  removeFavorite(artwork.id);
                } else {
                  addFavorite(artwork.id);
                }
              }}
              className={`pill-button text-[11px] shadow-xs ${
                isFavorite(artwork?.id || '') 
                  ? 'bg-[#4A0E17] text-white border-[#C5A059]' 
                  : 'bg-[#FAF6F0]/90 text-[#1E1412] border-[#C5A059]/30 hover:bg-[#4A0E17] hover:text-[#FAF6F0]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] mr-1.5">
                {isFavorite(artwork?.id || '') ? 'favorite' : 'favorite_border'}
              </span>
              FAVORITE
            </button>

            <button
              onClick={handleShare}
              className="pill-button bg-[#FAF6F0]/90 text-[#1E1412] border-[#C5A059]/30 hover:bg-[#4A0E17] hover:text-[#FAF6F0] text-[11px] shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] mr-1.5">share</span>
              SHARE
            </button>
          </div>
        </div>

        {/* Right Details & Acquisition Panel */}
        <div
          data-lenis-prevent
          className="w-full lg:w-[42%] px-6 md:px-12 py-10 lg:py-14 bg-[#FAF6F0] text-[#1E1412] flex flex-col gap-8 lg:h-[calc(100vh-96px)] lg:overflow-y-auto border-l border-[#C5A059]/20 hide-scrollbar overscroll-contain"
        >
          {/* Header Title & Artist */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="font-cinzel text-[10px] text-[#4A0E17] uppercase tracking-[0.3em] font-bold">
                MUSEUM ARCHIVAL EDITION
              </span>
              <div className="h-px w-8 bg-[#4A0E17]/40" />
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#1E1412] font-semibold mb-2 tracking-tight leading-tight">
              {artwork.name}
            </h1>
            <p className="font-cormorant italic text-xl text-[#1E1412]/75 mb-6">
              By {artwork.artist || 'Kalavault Curated Masterpiece'}
            </p>
            
            <p className="font-body-md text-sm md:text-base text-[#1E1412]/80 leading-relaxed mb-6">
              {artwork.description || "A captivating visual exploration that balances architectural geometry and poetic abstraction, ideally scaled to define prestigious commercial or residential environments."}
            </p>

            {/* Metric Overview Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-4 bg-[#F5EFEB] rounded-2xl border border-[#C5A059]/25 shadow-xs text-center">
                <p className="font-cinzel text-[9.5px] text-[#4A0E17] uppercase tracking-[0.2em] font-bold mb-1">VALUATION</p>
                <p className="font-cinzel text-xl text-[#1E1412] font-bold">₹{(artwork.replacementValue || 12000).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-[#F5EFEB] rounded-2xl border border-[#C5A059]/25 shadow-xs text-center">
                <p className="font-cinzel text-[9.5px] text-[#4A0E17] uppercase tracking-[0.2em] font-bold mb-1">YEAR</p>
                <p className="font-cinzel text-xl text-[#1E1412] font-bold">{artwork.yearCreated || 2023}</p>
              </div>
              <div className="p-4 bg-[#F5EFEB] rounded-2xl border border-[#C5A059]/25 shadow-xs text-center">
                <p className="font-cinzel text-[9.5px] text-[#4A0E17] uppercase tracking-[0.2em] font-bold mb-1">SCALE TIER</p>
                <p className="font-cinzel text-xs font-bold text-[#4A0E17] uppercase tracking-wider mt-1">{artwork.tier || 'MEDIUM'}</p>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="border-t border-[#C5A059]/20 pt-6">
            <h3 className="font-cinzel text-2xl text-[#1E1412] font-semibold mb-4">Specifications</h3>
            <div className="grid grid-cols-2 gap-y-5 gap-x-4 text-xs font-sans">
              <div>
                <p className="text-[#1E1412]/55 uppercase tracking-widest font-bold mb-1 font-cinzel text-[10px]">MEDIUM</p>
                <p className="text-[#1E1412] font-semibold">{artwork.medium || 'Archival Pigment on Fine Art Canvas'}</p>
              </div>
              <div>
                <p className="text-[#1E1412]/55 uppercase tracking-widest font-bold mb-1 font-cinzel text-[10px]">DIMENSIONS</p>
                <p className="text-[#1E1412] font-semibold">{artwork.size || '36" × 48" Gallery Stretched'}</p>
              </div>
              <div>
                <p className="text-[#1E1412]/55 uppercase tracking-widest font-bold mb-1 font-cinzel text-[10px]">PROVENANCE</p>
                <p className="text-[#1E1412] font-semibold">Certified Vault Registry</p>
              </div>
              <div>
                <p className="text-[#1E1412]/55 uppercase tracking-widest font-bold mb-1 font-cinzel text-[10px]">CONDITION</p>
                <p className="text-[#1E1412] font-semibold">Museum Archival Prerelease</p>
              </div>
            </div>
          </div>

          {/* Unified Acquisition Widget */}
          <div className="border-t border-[#C5A059]/20 pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-cinzel text-[10.5px] text-[#4A0E17] uppercase tracking-[0.2em] font-bold">
                ACQUISITION PROTOCOL
              </span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-[#F5EFEB] p-1 rounded-full mb-5 border border-[#C5A059]/30">
              <button
                onClick={() => setPurchaseMode('monthly')}
                className={`flex-1 py-2.5 font-cinzel text-[11px] font-bold uppercase tracking-widest transition-all cursor-pointer rounded-full ${
                  purchaseMode === 'monthly' ? 'bg-[#4A0E17] text-[#FAF6F0] shadow-sm' : 'text-[#1E1412]/70 hover:text-[#4A0E17]'
                }`}
              >
                LEASING &amp; ROTATION
              </button>
              <button
                onClick={() => setPurchaseMode('full')}
                className={`flex-1 py-2.5 font-cinzel text-[11px] font-bold uppercase tracking-widest transition-all cursor-pointer rounded-full ${
                  purchaseMode === 'full' ? 'bg-[#4A0E17] text-[#FAF6F0] shadow-sm' : 'text-[#1E1412]/70 hover:text-[#4A0E17]'
                }`}
              >
                OUTRIGHT ACQUISITION
              </button>
            </div>

            {purchaseMode === 'monthly' ? (
              <div className="space-y-5">
                {/* Month Duration Switcher */}
                <div className="flex bg-white p-1 rounded-full border border-[#C5A059]/30">
                  {[3, 6, 9, 12].map(m => (
                    <button
                      key={m}
                      onClick={() => setSelectedMonths(m as 3 | 6 | 9 | 12)}
                      className={`flex-1 py-2 font-cinzel text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer rounded-full ${
                        selectedMonths === m ? 'bg-[#C5A059] text-[#241611] shadow-xs font-bold' : 'text-[#1E1412]/60 hover:text-[#4A0E17]'
                      }`}
                    >
                      {m} Mo
                    </button>
                  ))}
                </div>

                {/* Monthly Price Display */}
                <div className="flex justify-between items-baseline pt-2">
                  <span className="font-cinzel text-sm text-[#1E1412]/70 font-semibold uppercase tracking-wider">Rotational Investment</span>
                  <span className="font-cinzel text-3xl text-[#1E1412] font-bold">
                    ₹{monthlyCost.toLocaleString('en-IN')}
                    <span className="text-sm font-sans text-[#1E1412]/50 font-normal"> / MO</span>
                  </span>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={() => handleAcquisition(`monthly_${selectedMonths}`)}
                    className="pill-button pill-button-bordeaux text-xs w-full shadow-md py-4 justify-center"
                  >
                    <span className="material-symbols-outlined text-[17px] mr-2">shopping_bag</span>
                    RESERVE FOR YOUR SPACE
                  </button>
                  <button
                    onClick={() => handleAcquisition('info')}
                    className="pill-button pill-button-outline text-xs w-full py-4 justify-center"
                  >
                    SPEAK WITH CURATORIAL ADVISOR
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex justify-between items-baseline pt-2">
                  <span className="font-cinzel text-sm text-[#1E1412]/70 font-semibold uppercase tracking-wider">Permanent Acquisition</span>
                  <span className="font-cinzel text-3xl text-[#1E1412] font-bold">
                    ₹{(artwork.replacementValue || 15000).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={() => handleAcquisition('full')}
                    className="pill-button pill-button-gold text-xs w-full shadow-md py-4 justify-center"
                  >
                    <span className="material-symbols-outlined text-[17px] mr-2">workspace_premium</span>
                    ACQUIRE MASTERPIECE
                  </button>
                  <button
                    onClick={() => handleAcquisition('info')}
                    className="pill-button pill-button-outline text-xs w-full py-4 justify-center"
                  >
                    REQUEST CUSTOM COMMISSION
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recommendations & Previously Viewed Section */}
          <div className="border-t border-[#C5A059]/25 pt-6 mt-4">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                {recentlyViewed.length > 0 && (
                  <button
                    onClick={() => setRecommendationTab('viewed')}
                    className={`font-cinzel text-xs sm:text-[13px] font-bold uppercase tracking-wider pb-1.5 transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
                      recommendationTab === 'viewed'
                        ? 'border-[#4A0E17] text-[#4A0E17]'
                        : 'border-transparent text-[#1E1412]/50 hover:text-[#1E1412]'
                    }`}
                  >
                    <span>Previously Viewed</span>
                    <span className="text-[10px] bg-[#4A0E17]/10 text-[#4A0E17] px-2 py-0.5 rounded-full font-bold">
                      {recentlyViewed.length}
                    </span>
                  </button>
                )}
                
                <button
                  onClick={() => setRecommendationTab('curated')}
                  className={`font-cinzel text-xs sm:text-[13px] font-bold uppercase tracking-wider pb-1.5 transition-all cursor-pointer border-b-2 ${
                    recommendationTab === 'curated' || recentlyViewed.length === 0
                      ? 'border-[#4A0E17] text-[#4A0E17]'
                      : 'border-transparent text-[#1E1412]/50 hover:text-[#1E1412]'
                  }`}
                >
                  Curator's Recommendations
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {(recommendationTab === 'viewed' && recentlyViewed.length > 0
                ? recentlyViewed
                : (artwork.relatedArtworks || [])
              ).slice(0, 4).map((related, idx) => (
                <ArtworkCard key={related.id} artwork={related} index={idx} />
              ))}
            </div>
          </div>

          {/* Adjacent Artwork Navigation */}
          {(adjacent.prev || adjacent.next) && (
            <div className="border-t border-[#C5A059]/20 pt-5 mt-auto flex justify-between">
              {adjacent.prev ? (
                <button
                  onClick={() => navigate(`/artwork/${adjacent.prev.id}`)}
                  className="font-cinzel text-[11px] uppercase tracking-wider font-bold text-[#1E1412]/70 hover:text-[#4A0E17] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  ← Previous Piece
                </button>
              ) : <div />}
              {adjacent.next ? (
                <button
                  onClick={() => navigate(`/artwork/${adjacent.next.id}`)}
                  className="font-cinzel text-[11px] uppercase tracking-wider font-bold text-[#1E1412]/70 hover:text-[#4A0E17] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  Next Piece →
                </button>
              ) : <div />}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Success Modal */}
      <PaymentSuccessModal
        isOpen={Boolean(successDetails)}
        onClose={() => setSuccessDetails(null)}
        details={successDetails}
      />
    </div>
  );
}
