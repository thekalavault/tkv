import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Artwork, getArtworkImagePath, LOCAL_ARTWORKS } from '../services/artworkService';

interface MuseumArtworkCarouselProps {
  artworks?: Artwork[];
  loading?: boolean;
}

export default function MuseumArtworkCarousel({ artworks = [], loading = false }: MuseumArtworkCarouselProps) {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Guarantee valid artworks list and limit to exactly fifteen artworks
  const displayArtworks = ((artworks && artworks.length > 0) ? artworks : LOCAL_ARTWORKS).slice(0, 15);
  
  // Double the list for seamless continuous infinite marquee feel
  const duplicatedArtworks = [...displayArtworks, ...displayArtworks];

  // Auto-scroll loop: smooth continuous scroll with pause on hover
  useEffect(() => {
    const track = trackRef.current;
    if (!track || loading) return;

    let animationFrameId: number;
    const speed = 0.75; // pixels per frame

    const step = () => {
      if (!isPaused && track) {
        track.scrollLeft += speed;
        // If reached half the scroll width (end of first set), reset to start seamlessly
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft -= track.scrollWidth / 2;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, loading, duplicatedArtworks.length]);

  const scrollManual = (direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    const scrollAmount = 340;
    trackRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div 
      className="relative w-full group/carousel select-none py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setHoveredId(null);
      }}
    >
      
      {/* Navigation Arrow Left */}
      <button
        onClick={() => scrollManual('left')}
        aria-label="Previous artwork"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#1A0F0B]/90 backdrop-blur-md border border-[#DFC07D]/60 text-[#DFC07D] hover:bg-[#7B2431] hover:text-white hover:border-[#7B2431] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer opacity-70 group-hover/carousel:opacity-100"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Navigation Arrow Right */}
      <button
        onClick={() => scrollManual('right')}
        aria-label="Next artwork"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#1A0F0B]/90 backdrop-blur-md border border-[#DFC07D]/60 text-[#DFC07D] hover:bg-[#7B2431] hover:text-white hover:border-[#7B2431] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer opacity-70 group-hover/carousel:opacity-100"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Edge Blur Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#F5EFEB] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#F5EFEB] to-transparent z-10 pointer-events-none" />

      {/* Horizontal Carousel Track */}
      <div
        ref={trackRef}
        className="w-full overflow-x-auto scrollbar-none py-6 px-8 flex items-center gap-7 sm:gap-9 will-change-scroll"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedArtworks.map((art, idx) => {
          const imageUrl = getArtworkImagePath(art);
          const uniqueKey = `${art.id}-${idx}`;
          const isHovered = hoveredId === uniqueKey;

          return (
            <div
              key={uniqueKey}
              className="flex-shrink-0 relative cursor-pointer transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02]"
              onMouseEnter={() => setHoveredId(uniqueKey)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => navigate(`/artwork/${art.id}`)}
            >
              {/* Museum-Grade Framed Painting in Original Format */}
              <div className={`p-2.5 sm:p-3 bg-gradient-to-br from-[#2D1B13] via-[#1A0E09] to-[#120704] rounded-[4px] border border-[#523324] transition-all duration-300 relative flex flex-col items-center justify-center ${
                isHovered
                  ? 'shadow-[0_28px_60px_rgba(26,13,8,0.55)] ring-2 ring-[#DFC07D]'
                  : 'shadow-[0_14px_32px_rgba(0,0,0,0.28)]'
              }`}>
                
                {/* Gallery Spotlight Glow on Hover */}
                <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-24 bg-radial from-[#DFC07D]/35 via-[#DFC07D]/10 to-transparent pointer-events-none transition-opacity duration-500 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`} />

                {/* Fine Gold Fillet Slip */}
                <div className="p-[2px] bg-gradient-to-tr from-[#9E7D38] via-[#DFC07D] to-[#9E7D38] shadow-xs w-full flex items-center justify-center">
                  
                  {/* Archival Off-White Mat Board */}
                  <div className="p-2.5 sm:p-3 bg-[#F8F5F0] shadow-inner flex items-center justify-center">
                    
                    {/* The Pure Painting Canvas Displayed in Original Format with Object-Contain (NO CROPPING OR SQUISHING) */}
                    <div className="relative overflow-hidden bg-[#120704] flex items-center justify-center min-w-[200px] sm:min-w-[230px] min-h-[260px] sm:min-h-[300px] max-h-[320px] sm:max-h-[360px]">
                      <img
                        src={imageUrl}
                        alt={art.title}
                        loading="lazy"
                        className="max-h-[290px] sm:max-h-[330px] w-auto max-w-[250px] sm:max-w-[290px] object-contain block mx-auto transition-transform duration-500 ease-out"
                        style={{
                          transform: isHovered ? 'scale(1.02)' : 'scale(1)'
                        }}
                      />
                      
                      {/* Tru-Vue Museum Glass Sheen */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                      {/* On-Hover Brass Pop-Up Plaque Overlay */}
                      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#120805]/95 via-[#1E0F0A]/90 to-transparent pt-8 pb-2.5 px-3 flex flex-col justify-end text-center transition-all duration-300 ease-out ${
                        isHovered 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-2 pointer-events-none'
                      }`}>
                        <div className="bg-gradient-to-r from-[#D4AF37]/20 via-[#DFC07D]/30 to-[#D4AF37]/20 border border-[#DFC07D]/70 p-1.5 rounded-xs backdrop-blur-xs shadow-md">
                          <h3 className="font-cinzel text-[10.5px] font-bold text-[#FCFAF6] tracking-wider truncate uppercase drop-shadow-sm">
                            {art.title}
                          </h3>
                          <p className="font-cormorant italic text-[11px] text-[#DFC07D] tracking-wide truncate mt-0.5 font-medium">
                            {art.artist || 'Master Archival Edition'}
                          </p>
                          <div className="mt-0.5 flex items-center justify-center gap-1 text-[8px] font-cinzel text-[#DFC07D]/90 uppercase tracking-widest">
                            <Eye className="w-2.5 h-2.5" />
                            <span>View Masterwork</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
