import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { buildCollectionsFromData, CollectionArtwork, Collection } from '../lib/collectionsData';
import ArtworkCard from '../components/ArtworkCard';
import { fetchArtworks } from '../services/artworkService';
import { SkeletonArtworkCard } from '../components/SkeletonCard';



function HeroCarousel({ artworks }: { artworks: CollectionArtwork[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

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
      <div className="w-full h-[500px] bg-stone-200/20 animate-pulse rounded-xl border border-outline/5 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
      </div>
    );
  }

  const items = artworks.slice(0, 6);
  const current = items[currentIndex];

  return (
    <div className="w-full h-[400px] md:h-[500px]" style={{ perspective: '1200px' }}>
      <motion.div 
        className="relative w-full h-full rounded-xl overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-outline/10 bg-matte-black"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
          <img src={current.localPath} alt={current.name} className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
      
      {/* Framing brackets */}
      <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/30" />
      <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-white/30" />
      
      {/* Content Overlay */}
      <div className="absolute bottom-8 left-8 right-8 z-10 text-paper-white flex flex-col justify-end h-full">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-[11px] text-gallery-gold tracking-widest uppercase font-bold">Featured Rotation</span>
          <div className="w-8 h-[1px] bg-gallery-gold/50" />
        </div>
        <motion.h2 
          key={current.id + '-title'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display-lg text-3xl md:text-5xl mb-3 leading-tight drop-shadow-md text-white"
        >
          {current.name}
        </motion.h2>
        <p className="font-label-caps text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-paper-white/80 mb-8">
          {(current as any).artist || (current as any).originalArtwork?.artist || 'Unknown Artist'}
        </p>
        
        {/* Navigation Dots */}
        <div className="flex gap-2.5">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className="h-1.5 rounded-full transition-all duration-500 cursor-pointer"
              style={{
                width: currentIndex === idx ? '32px' : '6px',
                background: currentIndex === idx ? '#D4AF37' : 'rgba(255,255,255,0.3)'
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
  const [artworks, setArtworks] = useState<CollectionArtwork[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [allArtworks, setAllArtworks] = useState<CollectionArtwork[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, collections: 0, byTier: { small: 0, medium: 0, large: 0, 'extra-large': 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchArtworks(1, 100);
        const built = buildCollectionsFromData(data.items);
        setAllArtworks(built.allArtworks);
        setCollections(built.collections);
        setStats(built.stats);
      } catch (err) {
        console.error("Failed to load artworks", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'all') {
      setArtworks(allArtworks);
    } else {
      const collection = collections.find(c => c.id === activeTab);
      setArtworks(collection?.artworks || []);
    }
  }, [activeTab, allArtworks, collections]);

  // Memoize artworks to prevent unnecessary re-renders
  const displayedArtworks = useMemo(() => artworks, [artworks]);

  return (
    <div className="bg-paper-white text-primary min-h-screen font-body-md flex flex-col pt-16 md:pt-24">
      <TopNavBar />

      <main className="flex-1 w-full max-w-[1800px] mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        {/* Header Section - 12-Column Architectural Layout */}
        <div className="relative mb-20 md:mb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-b border-outline/10 pb-16 items-stretch overflow-visible">
          {/* Ambient Luxury Blur Backdrops */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none -z-10" />

          {/* Left Column: Editorial Banner (4-Columns) */}
          <div className="lg:col-span-4 flex flex-col justify-between relative lg:border-r lg:border-outline/10 lg:pr-12">
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <span className="font-label-caps text-[10px] text-gallery-gold uppercase tracking-[0.3em] block font-bold">
                  Curated Catalog
                </span>
                <div className="h-[1px] w-12 bg-gallery-gold/30" />
              </div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-display-lg text-5xl md:text-7xl tracking-tight mb-8 text-primary leading-[1.1]"
              >
                The <span className="italic font-light text-gallery-gold font-serif">Collection</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="font-body-lg text-[15px] md:text-[16px] text-on-surface-variant/95 leading-relaxed border-l-2 border-gallery-gold/30 pl-5 mb-8"
              >
                A highly structured directory of <span className="text-primary font-semibold">{stats.total}</span> curated corporate-grade assets across <span className="text-primary font-semibold">{stats.collections}</span> distinct themes. Programmed for flexible rotational workspaces.
              </motion.p>
            </div>

            {/* Catalog Info Footer Badge (Desktop only) */}
            <div className="hidden lg:block pt-6 border-t border-outline/5 mt-auto">
              <div className="flex items-center justify-between text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-widest">
                <span>System Status</span>
                <span className="text-gallery-gold font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gallery-gold animate-pulse" />
                  Active Registry
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Carousel (8-Columns) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-8 relative z-10"
          >
            <HeroCarousel artworks={allArtworks.filter(a => a.originalArtwork?.replacementValue >= 50000)} />
          </motion.div>
        </div>

        {/* Collection Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16 flex flex-wrap gap-2 border-b border-outline/10 pb-6 overflow-x-auto hide-scrollbar"
        >
          <button
            onClick={() => setActiveTab('all')}
            className={`font-label-caps text-[10px] uppercase tracking-[0.1em] px-6 py-2.5 whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-primary text-paper-white shadow-[0_2px_10px_rgba(0,0,0,0.1)]'
                : 'text-on-surface-variant hover:text-gallery-gold hover:bg-paper-white/50 border border-transparent hover:border-gallery-gold/20'
            }`}
          >
            All Works ({stats.total})
          </button>
          {collections.map(collection => (
            <button
              key={collection.id}
              onClick={() => setActiveTab(collection.id)}
              className={`font-label-caps text-[10px] uppercase tracking-[0.1em] px-6 py-2.5 whitespace-nowrap transition-all duration-300 cursor-pointer ${
                activeTab === collection.id
                  ? 'bg-primary text-paper-white shadow-[0_2px_10px_rgba(0,0,0,0.1)]'
                  : 'text-on-surface-variant hover:text-gallery-gold hover:bg-paper-white/50 border border-transparent hover:border-gallery-gold/20'
              }`}
            >
              {collection.name} ({collection.count})
            </button>
          ))}
        </motion.div>

        {/* Artworks Grid */}
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8"
          >
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="break-inside-avoid">
                <SkeletonArtworkCard />
              </div>
            ))}
          </motion.div>
        ) : displayedArtworks.length === 0 ? (
          <div className="w-full flex items-center justify-center py-24">
            <p className="font-body-md text-on-surface-variant">No artworks found in this collection</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8"
          >
            {displayedArtworks.map((art, idx) => (
              <ArtworkCard key={art.id} artwork={art} index={idx} />
            ))}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
