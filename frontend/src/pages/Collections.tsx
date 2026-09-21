import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { buildCollectionsFromData, CollectionArtwork, Collection } from '../lib/collectionsData';
import ArtworkCard from '../components/ArtworkCard';
import { fetchArtworks } from '../services/artworkService';
import { SkeletonArtworkCard } from '../components/SkeletonCard';
import { useNavigate } from 'react-router-dom';

function HeroCarousel({ artworks }: { artworks: CollectionArtwork[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const navigate = useNavigate();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation between -5 and 5 degrees
    const rX = -((y / rect.height) - 0.5) * 10;
    const rY = ((x / rect.width) - 0.5) * 10;
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  useEffect(() => {
    if (!artworks || artworks.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(artworks.length, 6));
    }, 5000);
    return () => clearInterval(interval);
  }, [artworks]);

  if (!artworks || artworks.length === 0) {
    return (
      <div className="w-full h-[420px] md:h-[500px] bg-stone-200/20 animate-pulse rounded-xl border border-outline/5 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
      </div>
    );
  }

  const items = artworks.slice(0, 6);
  const current = items[currentIndex] || artworks[0];

  return (
    <div className="w-full h-[400px] md:h-[500px]" style={{ perspective: '1200px' }}>
      <motion.div 
        className="relative w-full h-full rounded-xl overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#C5A059]/30 bg-[#140C0A] cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => current && navigate('/artwork/' + current.id)}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.5 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, rotateY: 10, scale: 1.05, filter: 'blur(8px)', z: -100 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1, filter: 'blur(0px)', z: 0 }}
            exit={{ opacity: 0, rotateY: -10, scale: 0.95, filter: 'blur(8px)', z: -100 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={current.localPath} 
              alt={current.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />
        
        {/* Framing brackets */}
        <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/40 pointer-events-none" />
        <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-white/40 pointer-events-none" />
        
        {/* Content Overlay */}
        <div className="absolute bottom-8 left-8 right-8 z-10 text-[#FAF6F0] flex flex-col justify-end pointer-events-none">
          <div className="flex items-center gap-3 mb-2.5">
            <span className="font-cinzel text-[10px] text-[#DFC07D] tracking-[0.25em] uppercase font-bold">Featured Rotation</span>
            <div className="w-8 h-[1px] bg-[#DFC07D]/50" />
          </div>
          <motion.h2 
            key={current.id + '-title'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-cinzel text-2xl sm:text-3xl md:text-5xl mb-2.5 leading-tight drop-shadow-md text-white font-medium"
          >
            {current.name}
          </motion.h2>
          <p className="font-cormorant italic text-base sm:text-lg text-[#DFC07D]/90 mb-6">
            {(current as any).artist || (current as any).originalArtwork?.artist || 'Unknown Artist'}
          </p>
          
          {/* Navigation Dots */}
          <div className="flex gap-2.5 pointer-events-auto">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                aria-label={`Select artwork ${idx + 1}`}
                className="h-1.5 rounded-full transition-all duration-500 cursor-pointer"
                style={{
                  width: currentIndex === idx ? '36px' : '6px',
                  background: currentIndex === idx ? '#DFC07D' : 'rgba(255,255,255,0.3)'
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
            
export default function Collections() {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState<'curated' | 'val_high' | 'val_low' | 'title_asc' | 'artist_asc'>('curated');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('all');
  const [priceRange, setPriceRange] = useState<'all' | 'under_30k' | '30k_60k' | '60k_100k' | 'above_100k'>('all');
  const [visibleCount, setVisibleCount] = useState(20);
  const navigate = useNavigate();

  // Reset pagination when any filter criteria changes
  useEffect(() => {
    setVisibleCount(20);
  }, [activeTab, searchQuery, selectedArtist, priceRange, sortBy]);

  // Stale-While-Revalidate Caching for Collections Catalog
  const [allArtworks, setAllArtworks] = useState<CollectionArtwork[]>(() => {
    const cached = localStorage.getItem('kb_cached_artworks_v3') || localStorage.getItem('kb_cached_artworks');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const items = parsed.items || (Array.isArray(parsed) ? parsed : []);
        if (items.length) {
          const built = buildCollectionsFromData(items);
          return built.allArtworks;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [collections, setCollections] = useState<Collection[]>(() => {
    const cached = localStorage.getItem('kb_cached_artworks_v3') || localStorage.getItem('kb_cached_artworks');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const items = parsed.items || (Array.isArray(parsed) ? parsed : []);
        if (items.length) {
          const built = buildCollectionsFromData(items);
          return built.collections;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [loading, setLoading] = useState(() => allArtworks.length === 0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    async function loadData() {
      try {
        const data = await fetchArtworks(1, 50);
        if (data && data.items && data.items.length > 0) {
          localStorage.setItem('kb_cached_artworks_v3', JSON.stringify(data));
          const built = buildCollectionsFromData(data.items);
          setAllArtworks(built.allArtworks);
          setCollections(built.collections);
        }
      } catch (err) {
        console.error("Failed to load artworks", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Dynamically extract unique artists
  const availableArtists = useMemo(() => {
    const set = new Set<string>();
    allArtworks.forEach(art => {
      const name = (art as any).artist || art.originalArtwork?.artist;
      if (name && name.trim()) set.add(name.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allArtworks]);

  // Comprehensive Filtering and Sorting logic
  const displayedArtworks = useMemo(() => {
    let list = [...allArtworks];

    // 1. Format/Category Tab
    if (activeTab !== 'all') {
      const collection = collections.find(c => c.id === activeTab);
      list = collection ? [...collection.artworks] : list.filter(a => a.tier === activeTab);
    }

    // 2. Search Query (Title, Artist, Description, Medium)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(a => {
        const title = (a.name || '').toLowerCase();
        const artist = ((a as any).artist || a.originalArtwork?.artist || '').toLowerCase();
        const desc = (a.originalArtwork?.description || '').toLowerCase();
        const medium = (a.originalArtwork?.medium || '').toLowerCase();
        return title.includes(q) || artist.includes(q) || desc.includes(q) || medium.includes(q);
      });
    }

    // 3. Artist Filter
    if (selectedArtist !== 'all') {
      list = list.filter(a => {
        const artist = (a as any).artist || a.originalArtwork?.artist || '';
        return artist.toLowerCase() === selectedArtist.toLowerCase();
      });
    }

    // 4. Money / Valuation Range Filter
    if (priceRange !== 'all') {
      list = list.filter(a => {
        const val = a.originalArtwork?.replacementValue || (a.originalArtwork?.rentalPriceCents ? Math.round(a.originalArtwork.rentalPriceCents / 0.012) : 35000);
        if (priceRange === 'under_30k') return val < 30000;
        if (priceRange === '30k_60k') return val >= 30000 && val <= 60000;
        if (priceRange === '60k_100k') return val > 60000 && val <= 100000;
        if (priceRange === 'above_100k') return val > 100000;
        return true;
      });
    }

    // 5. Sorting
    if (sortBy === 'val_high') {
      list.sort((a, b) => (b.originalArtwork?.replacementValue || 0) - (a.originalArtwork?.replacementValue || 0));
    } else if (sortBy === 'val_low') {
      list.sort((a, b) => (a.originalArtwork?.replacementValue || 0) - (b.originalArtwork?.replacementValue || 0));
    } else if (sortBy === 'title_asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'artist_asc') {
      const getArtName = (x: any) => (x.artist || x.originalArtwork?.artist || '');
      list.sort((a, b) => getArtName(a).localeCompare(getArtName(b)));
    }

    return list;
  }, [allArtworks, collections, activeTab, searchQuery, selectedArtist, priceRange, sortBy]);

  const paginatedArtworks = useMemo(() => {
    return displayedArtworks.slice(0, visibleCount);
  }, [displayedArtworks, visibleCount]);

  const hasMore = visibleCount < displayedArtworks.length;
  const remainingCount = displayedArtworks.length - visibleCount;

  const hasActiveFilters = searchQuery.trim() !== '' || selectedArtist !== 'all' || priceRange !== 'all' || activeTab !== 'all';

  const handleResetFilters = () => {
    setActiveTab('all');
    setSearchQuery('');
    setSelectedArtist('all');
    setPriceRange('all');
    setSortBy('curated');
    setVisibleCount(20);
  };

  return (
    <div className="bg-[#FAF6F0] text-[#1E1412] min-h-screen font-body-md flex flex-col pt-20 md:pt-28 selection:bg-[#C5A059]/30">
      <TopNavBar />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 py-10 md:py-16">
        
        {/* Header Section — Architectural 12-Column Banner */}
        <div className="relative mb-14 md:mb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 border-b border-[#C5A059]/25 pb-14 items-center">
          {/* Ambient Luxury Blur Backdrops */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.08)_0%,transparent_70%)] blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-0 right-10 w-[450px] h-[450px] bg-[radial-gradient(circle_at_center,rgba(74,14,23,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none -z-10" />

          {/* Left Column: Editorial Info */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-cinzel text-[10px] text-[#4A0E17] uppercase tracking-[0.3em] font-bold">
                  CURATED ARCHIVES
                </span>
                <div className="h-[1px] w-12 bg-[#4A0E17]/40" />
              </div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-brand text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#1E1412] leading-[1.08] font-semibold"
              >
                The <span className="italic font-light text-[#4A0E17] font-cormorant">Collection</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="font-body-lg text-[15px] md:text-[16px] text-[#1E1412]/75 leading-relaxed border-l-2 border-[#4A0E17]/40 pl-4 mt-6"
              >
                A structured museum directory of certified corporate and residential art assets across curated movements. Programmed for flexible rotational workspaces.
              </motion.p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#1E1412]/70 font-cinzel font-bold">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4A0E17] animate-pulse" />
                <span className="text-[#1E1412]">{allArtworks.length} Certified Works</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1C2D24]" />
                White-Glove Delivery
              </span>
            </div>
          </div>

          {/* Right Column: 3D Tilt Carousel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <HeroCarousel artworks={allArtworks.filter(a => (a.originalArtwork?.replacementValue || 0) >= 35000)} />
          </motion.div>
        </div>

        {/* Collection Filter & Sort Control Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 space-y-6 pb-8 border-b border-[#C5A059]/25"
        >
          {/* Top Filter Controls: Search & Select Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
            
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#1E1412]/40">
                search
              </span>
              <input
                type="text"
                placeholder="Search artwork, artist, medium..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF6F0] border border-[#C5A059]/30 rounded-full pl-10 pr-9 py-2.5 text-xs font-sans font-medium text-[#1E1412] placeholder:text-[#1E1412]/45 outline-none focus:border-[#4A0E17] focus:ring-1 focus:ring-[#4A0E17]/20 transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#1E1412]/50 hover:text-[#1E1412] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Artist Dropdown Filter */}
            <div className="lg:col-span-3 relative">
              <select
                value={selectedArtist}
                onChange={(e) => setSelectedArtist(e.target.value)}
                className="w-full appearance-none bg-[#FAF6F0] border border-[#C5A059]/30 rounded-full px-4 py-2.5 pr-8 text-xs font-cinzel font-bold text-[#1E1412] outline-none hover:border-[#4A0E17] focus:border-[#4A0E17] transition-colors cursor-pointer shadow-sm"
              >
                <option value="all">Artist: All Artists ({availableArtists.length})</option>
                {availableArtists.map(artist => (
                  <option key={artist} value={artist}>{artist}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#1E1412]/45 pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Money / Valuation Filter */}
            <div className="lg:col-span-3 relative">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as any)}
                className="w-full appearance-none bg-[#FAF6F0] border border-[#C5A059]/30 px-4 py-2.5 pr-8 text-xs font-cinzel font-bold text-[#1E1412] outline-none hover:border-[#4A0E17] focus:border-[#4A0E17] transition-colors cursor-pointer"
              >
                <option value="all">Valuation: All Price Ranges</option>
                <option value="under_30k">Under ₹30,000</option>
                <option value="30k_60k">₹30,000 to ₹60,000</option>
                <option value="60k_100k">₹60,000 to ₹1,00,000</option>
                <option value="above_100k">Above ₹1,00,000</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#1E1412]/45 pointer-events-none">
                payments
              </span>
            </div>

            {/* Sort Controller */}
            <div className="lg:col-span-2 relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full appearance-none bg-[#FAF6F0] border border-[#C5A059]/30 rounded-full px-4 py-2.5 pr-8 text-xs font-cinzel font-bold text-[#1E1412] outline-none hover:border-[#4A0E17] focus:border-[#4A0E17] transition-colors cursor-pointer shadow-sm"
              >
                <option value="curated">Sort: Curated</option>
                <option value="val_low">Price: Low to High</option>
                <option value="val_high">Price: High to Low</option>
                <option value="title_asc">Title: A to Z</option>
                <option value="artist_asc">Artist: A to Z</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#1E1412]/45 pointer-events-none">
                sort
              </span>
            </div>
          </div>

          {/* Category Filter Pills & Reset Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`font-cinzel text-[11px] uppercase tracking-[0.16em] font-bold px-5 py-2 rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-[#4A0E17] text-[#FAF6F0] border border-[#6E1825] shadow-md scale-[1.02]'
                    : 'bg-[#FAF6F0] border border-[#C5A059]/30 text-[#1E1412]/75 hover:bg-[#4A0E17] hover:text-[#FAF6F0]'
                }`}
              >
                ALL WORKS ({allArtworks.length})
              </button>
              
              {collections.map(collection => (
                <button
                  key={collection.id}
                  onClick={() => setActiveTab(collection.id)}
                  className={`font-cinzel text-[11px] uppercase tracking-[0.16em] font-bold px-5 py-2 rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    activeTab === collection.id
                      ? 'bg-[#4A0E17] text-[#FAF6F0] border border-[#6E1825] shadow-md scale-[1.02]'
                      : 'bg-[#FAF6F0] border border-[#C5A059]/30 text-[#1E1412]/75 hover:bg-[#4A0E17] hover:text-[#FAF6F0]'
                  }`}
                >
                  {collection.name} ({collection.artworks.length})
                </button>
              ))}
            </div>

            {/* Results count & Clear button */}
            <div className="flex items-center gap-3">
              <span className="text-[11.5px] font-sans text-[#1E1412]/60 font-medium">
                Showing <strong className="text-[#1E1412] font-bold">{displayedArtworks.length}</strong> of {allArtworks.length} pieces
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] uppercase tracking-wider font-cinzel font-bold text-[#4A0E17] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                  Reset
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Dynamic Editorial Museum Artwork Gallery */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 lg:gap-14 justify-items-center">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonArtworkCard key={idx} />
            ))}
          </div>
        ) : displayedArtworks.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-4xl text-[#1E1412]/30 mb-2">search_off</span>
            <p className="font-body-md text-[#1E1412]/70 mb-4">No artworks found matching your current filter criteria.</p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-[#4A0E17] text-[#FAF6F0] font-cinzel text-xs uppercase tracking-widest font-bold rounded-full hover:bg-[#6E1825] transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 lg:gap-14 items-stretch justify-items-center"
            >
              {paginatedArtworks.map((art, idx) => (
                <ArtworkCard 
                  key={art.id} 
                  artwork={art} 
                  index={idx} 
                  variant="collections" 
                />
              ))}
            </motion.div>

            {/* Pagination & Load More Section */}
            {hasMore && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="pt-10 pb-6 flex flex-col items-center justify-center space-y-4"
              >
                {/* Visual Progress Bar */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#1E1412]/60 font-semibold">
                    Showing {Math.min(visibleCount, displayedArtworks.length)} of {displayedArtworks.length} Certified Masterpieces
                  </span>
                  <div className="w-52 h-1.5 bg-[#C5A059]/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#4A0E17] via-[#C5A059] to-[#4A0E17] rounded-full transition-all duration-700"
                      style={{ width: `${(Math.min(visibleCount, displayedArtworks.length) / displayedArtworks.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Luxury Load More Button */}
                <button
                  onClick={() => setVisibleCount(prev => prev + 20)}
                  className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#4A0E17] text-[#FAF6F0] font-cinzel text-[11.5px] uppercase tracking-[0.2em] font-bold shadow-lg hover:bg-[#6E1825] hover:shadow-[0_14px_35px_rgba(74,14,23,0.3)] transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-[#C5A059]/40"
                >
                  <span>VIEW MORE MASTERPIECES</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/25 text-[10px] tracking-normal font-mono font-bold text-[#DFC07D]">
                    +{Math.min(20, remainingCount)}
                  </span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-y-0.5 transition-transform">
                    expand_more
                  </span>
                </button>
              </motion.div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
