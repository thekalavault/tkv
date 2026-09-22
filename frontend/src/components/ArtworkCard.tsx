import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CollectionArtwork } from '../lib/collectionsData';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { getArtworkDetailById } from '../services/artworkDetailService';
import RobustArtworkImage from './RobustArtworkImage';

interface ArtworkCardProps {
  artwork: CollectionArtwork;
  index?: number;
  variant?: 'collections' | 'standard';
  key?: any;
}

const ArtworkCard = memo(function ArtworkCard({ 
  artwork, 
  index = 0,
  variant = 'standard'
}: ArtworkCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const getStartingPrice = () => {
    const orig = artwork.originalArtwork;
    if (!orig) return 15000;
    let minPrice = orig.rentalPriceCents ? orig.rentalPriceCents : Math.round((orig.replacementValue || 15000) * 0.012);
    
    if ((orig as any).metadata?.pricingTiers) {
      const prices = Object.values((orig as any).metadata.pricingTiers).map(p => Number(p)).filter(p => !isNaN(p));
      if (prices.length > 0) {
        minPrice = Math.min(minPrice, ...prices);
      }
    }
    return minPrice;
  };

  const getFullMrp = () => {
    const orig = artwork.originalArtwork;
    if (!orig) return 35000;
    if (orig.replacementValue && orig.replacementValue > 0) {
      return orig.replacementValue;
    }
    if (orig.rentalPriceCents && orig.rentalPriceCents > 0) {
      return Math.round(orig.rentalPriceCents / 0.012);
    }
    return 35000;
  };

  const hasTiers = (artwork.originalArtwork as any)?.metadata?.pricingTiers && Object.keys((artwork.originalArtwork as any).metadata.pricingTiers).length > 0;
  const startingPrice = getStartingPrice();
  const fullMrp = getFullMrp();
  const artistName = (artwork as any).artist || (artwork.originalArtwork as any)?.artist || 'Museum Archival Edition';

  const isCollectionsVariant = variant === 'collections';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "60px" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06 }}
      className={`group cursor-pointer flex flex-col items-center justify-between text-center w-full h-full transition-colors duration-300 ${
        isCollectionsVariant 
          ? 'p-2 sm:p-3' 
          : ''
      }`}
      onMouseEnter={() => getArtworkDetailById(artwork.id)}
      onClick={() => navigate(`/artwork/${artwork.id}`)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Artwork in Thin Luxury Wooden Frame Finish */}
      <div className="w-full flex-1 flex items-center justify-center p-2 min-h-[280px] sm:min-h-[320px] md:min-h-[360px] relative">
        
        {/* Thin Gallery Wooden Frame */}
        <div className="relative group/art inline-flex items-center justify-center p-[3px] bg-gradient-to-b from-[#3E2419] via-[#2A160F] to-[#1E0E08] border-[4px] sm:border-[5px] border-[#341B12] shadow-[0_12px_28px_rgba(26,13,8,0.28)] group-hover:shadow-[0_18px_38px_rgba(26,13,8,0.38)] group-hover:border-[#422317] transition-all duration-300">
          
          {/* Subtle Inner Gold Hairline Bevel */}
          <div className="relative p-[1px] bg-gradient-to-tr from-[#9E7D38]/60 via-[#DFC07D]/80 to-[#9E7D38]/60 shadow-inner overflow-hidden">
            <div className="bg-[#120704] flex items-center justify-center overflow-hidden min-w-[180px] min-h-[220px]">
              <RobustArtworkImage
                src={artwork.localPath}
                seed={artwork.id}
                alt={artwork.name}
                loading="lazy"
                decoding="async"
                className="max-h-[290px] sm:max-h-[330px] md:max-h-[370px] w-auto max-w-full object-contain block mx-auto transition-transform duration-300 group-hover:scale-[1.01] no-drag"
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
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
            aria-label="Add to favorites"
            className={`absolute top-2 right-2 z-30 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md ${
              isFavorite(artwork.id) 
                ? 'bg-[#7B2431] text-[#FAF6F0] border border-[#DFC07D]/60' 
                : 'bg-white/95 backdrop-blur-xs text-[#1E1412] hover:bg-[#7B2431] hover:text-[#FAF6F0] border border-[#C5A059]/40'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] sm:text-[15px]">
              {isFavorite(artwork.id) ? 'favorite' : 'favorite_border'}
            </span>
          </button>
        </div>
      </div>

      {/* Centered Luxury Typography Below Image */}
      {isCollectionsVariant ? (
        <div className="mt-4 flex flex-col items-center justify-center space-y-1 w-full px-2">
          {/* Artwork Title */}
          <h3 
            title={artwork.name}
            className="font-cinzel text-[13px] sm:text-[14px] font-bold text-[#1E1412] tracking-[0.16em] uppercase group-hover:text-[#4A0E17] transition-colors duration-200 truncate max-w-[280px]"
          >
            {artwork.name}
          </h3>

          {/* Author / Artist */}
          <p 
            title={artistName}
            className="font-cormorant italic text-[14px] sm:text-[15px] text-[#1E1412]/75 tracking-wide truncate max-w-[280px]"
          >
            {artistName}
          </p>

          {/* Lease Available & Full MRP */}
          <div className="pt-2 flex flex-col items-center space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-cinzel font-bold tracking-[0.24em] text-[#C5A059] uppercase">
              <span className="w-1.5 h-1.5 bg-[#C5A059]" />
              LEASE AVAILABLE
            </span>
            <span className="text-[12px] sm:text-[12.5px] font-sans text-[#1E1412]/70 font-medium tracking-wide">
              <span className="text-[10px] uppercase tracking-widest text-[#1E1412]/45 font-semibold mr-1">MRP</span>
              <span className="font-bold text-[#1E1412] text-[13px]">₹{fullMrp.toLocaleString('en-IN')}</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center justify-center space-y-1 w-full px-2">
          <h3 className="font-cinzel text-[13.5px] md:text-[14.5px] font-bold text-[#1E1412] tracking-[0.14em] uppercase group-hover:text-[#4A0E17] transition-colors duration-200 truncate w-full">
            {artwork.name}
          </h3>
          <p className="font-cormorant italic text-[13.5px] md:text-[14.5px] text-[#1E1412]/70 truncate w-full">
            {artistName}
          </p>
          <div className="pt-1">
            <span className="font-sans text-[11px] md:text-[11.5px] text-[#1E1412]/75 font-semibold tracking-wider uppercase">
              {hasTiers ? 'FROM ' : ''}
              <span className="text-[#C5A059] font-extrabold">₹{startingPrice.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-[#1E1412]/50 tracking-normal font-normal"> / MO</span>
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
});

export default ArtworkCard;
