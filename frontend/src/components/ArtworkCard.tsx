import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'; // Not needed but kept for other potential uses if any, actually I'll just remove the import in the next block.
import { ArtworkTierBadge } from './ArtworkTierInfo';
import { CollectionArtwork } from '../lib/collectionsData';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';

interface ArtworkCardProps {
  artwork: CollectionArtwork;
  index?: number;
  key?: any;
}

export default function ArtworkCard({ artwork, index = 0 }: ArtworkCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);

  const getStartingPrice = () => {
    const orig = artwork.originalArtwork;
    if (!orig) return Math.round(15000 * 0.012); // fallback
    let minPrice = orig.rentalPriceCents ? orig.rentalPriceCents : Math.round((orig.replacementValue || 15000) * 0.012);
    
    if ((orig as any).metadata?.pricingTiers) {
      const prices = Object.values((orig as any).metadata.pricingTiers).map(p => Number(p)).filter(p => !isNaN(p));
      if (prices.length > 0) {
        minPrice = Math.min(minPrice, ...prices);
      }
    }
    return minPrice;
  };

  const hasTiers = (artwork.originalArtwork as any)?.metadata?.pricingTiers && Object.keys((artwork.originalArtwork as any).metadata.pricingTiers).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.05 }}
      className="group cursor-pointer flex flex-col break-inside-avoid mb-6 md:mb-8"
      onClick={() => navigate(`/artwork/${artwork.id}`)}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="relative overflow-hidden bg-stone-200 shadow-sm hover:shadow-xl transition-shadow duration-700 no-select">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-stone-200/50 animate-pulse z-0" />
        )}
        <img
          className={`w-full h-auto object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center group-hover:scale-115 no-drag relative z-10 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          alt={artwork.name}
          src={artwork.localPath}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onDragStart={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Tiled watermark repeating overlay - remains slightly visible on hover */}
        <div className="watermark-tiled opacity-100 group-hover:opacity-35 transition-opacity duration-500" />


        {/* Shadow gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

        {/* Golden frame effect - fades out on hover */}
        <div className="absolute inset-0 border-[0.15cm] border-[#cca550] shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] z-20 pointer-events-none mix-blend-multiply opacity-90 transition-opacity duration-500 group-hover:opacity-0" />
        <div className="absolute inset-0 border-[0.15cm] border-gallery-gold z-20 pointer-events-none shadow-[inset_0_4px_15px_rgba(0,0,0,0.5),0_10px_30px_rgba(0,0,0,0.3)] opacity-80 transition-opacity duration-500 group-hover:opacity-0" />
        
        {/* Like Button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent navigation
            if (!user) {
              navigate('/signin');
              return;
            }
            if (isFavorite(artwork.id)) {
              removeFavorite(artwork.id);
            } else {
              addFavorite(artwork.id);
            }
          }}
          className={`absolute top-4 right-4 z-30 p-2 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg cursor-pointer ${
            isFavorite(artwork.id) ? 'bg-primary/90 text-white' : 'bg-white/80 text-primary hover:bg-white hover:text-gallery-gold'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isFavorite(artwork.id) ? 'favorite' : 'favorite_border'}
          </span>
        </button>
      </div>

      <div className="mt-4 pt-3 border-t border-gallery-gold/10 flex justify-between items-center gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display-sm text-[16px] font-semibold text-primary tracking-tight group-hover:text-gallery-gold transition-colors duration-300 truncate leading-tight">
            {artwork.name}
          </h3>
          <span className="text-[9px] font-label-caps tracking-widest text-on-surface-variant/60 uppercase block mt-1">
            Value: ₹{(artwork.originalArtwork?.replacementValue || 15000).toLocaleString('en-IN')}
          </span>
        </div>
        <div className="text-right flex flex-col items-end justify-center flex-shrink-0">
          <span className="text-[10px] font-bold font-label-caps tracking-wider text-gallery-gold bg-gallery-gold/5 px-2 py-0.5 rounded border border-gallery-gold/15 shadow-[0_2px_8px_rgba(212,175,55,0.04)]">
            {hasTiers ? 'From ' : ''}₹{getStartingPrice().toLocaleString('en-IN')}/mo
          </span>
          <span className="text-[8px] font-label-caps tracking-widest text-on-surface-variant/50 uppercase mt-0.5 block">
            Lease
          </span>
        </div>
      </div>
    </motion.div>
  );
}
