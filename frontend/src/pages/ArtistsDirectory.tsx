import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MapPin, 
  Layers, 
  ExternalLink, 
  ArrowRight, 
  Heart, 
  ShoppingBag,
  Award,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  Share2
} from 'lucide-react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { getAllArtists, getArtworksForArtist, ArtistProfile } from '../data/artistsData';
import { Artwork, LOCAL_ARTWORKS } from '../services/artworkService';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

export default function ArtistsDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const [artists, setArtists] = useState<ArtistProfile[]>(() => getAllArtists());

  // Listen for admin changes from localStorage
  useEffect(() => {
    const handleUpdate = () => {
      setArtists(getAllArtists());
    };
    window.addEventListener('kalavault_artists_updated', handleUpdate);
    return () => window.removeEventListener('kalavault_artists_updated', handleUpdate);
  }, []);

  // Selected Artist slug from URL param or default to first artist
  const selectedSlug = searchParams.get('artist') || 'shagun-agarwal';
  const selectedArtist: ArtistProfile = useMemo(() => {
    return artists.find(a => a.slug === selectedSlug) || artists[0];
  }, [artists, selectedSlug]);

  // Selected artist's mapped artworks
  const artworks: Artwork[] = useMemo(() => {
    return getArtworksForArtist(selectedArtist.name, LOCAL_ARTWORKS);
  }, [selectedArtist.name]);

  // Series / Category filter for artworks
  const [artworkFilter, setArtworkFilter] = useState<string>('all');
  const [showFullDetails, setShowFullDetails] = useState<boolean>(false);
  const [contactSuccess, setContactSuccess] = useState<boolean>(false);

  const filteredArtworks = useMemo(() => {
    if (artworkFilter === 'all') return artworks;
    return artworks.filter(art => {
      const cur = (art.metadata?.thematicCuration || '').toLowerCase();
      const ser = (art.metadata?.series || '').toLowerCase();
      return cur.includes(artworkFilter) || ser.includes(artworkFilter);
    });
  }, [artworks, artworkFilter]);

  const selectArtist = (slug: string) => {
    setSearchParams({ artist: slug });
    setArtworkFilter('all');
    setShowFullDetails(false);
  };

  const shareArtist = () => {
    if (navigator.share) {
      navigator.share({
        title: `${selectedArtist.name} | The Kala Vault`,
        text: `Explore curated works by ${selectedArtist.name} on The Kala Vault.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Artist link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#1E1412] selection:bg-[#C5A059]/30 selection:text-[#4A0E17]">
      <TopNavBar />

      {/* Hero Header: Warm Off-White Gallery Ambiance */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 bg-gradient-to-b from-[#F7F3EB] to-[#FCFAF6] border-b border-[#C5A059]/20">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#4A0E17]/10 border border-[#4A0E17]/25 text-[#4A0E17] text-[11px] font-cinzel tracking-[0.24em] uppercase mb-4 font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>The Kala Vault Resident Artists</span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1E1412] uppercase">
            Artist Profiles &amp; Catalog
          </h1>

          <p className="mt-3 max-w-2xl mx-auto text-base sm:text-lg font-cormorant italic text-[#1E1412]/75">
            Discover our represented masters, explore their studio practice, and browse their certified original artworks.
          </p>

          {/* Clean Artist Selector Tabs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {artists.map(a => {
              const isSelected = a.slug === selectedArtist.slug;
              return (
                <button
                  key={a.id}
                  onClick={() => selectArtist(a.slug)}
                  className={`px-5 py-2.5 rounded-full text-xs font-cinzel uppercase tracking-[0.16em] font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-[#4A0E17] text-[#FAF6F0] shadow-md border border-[#4A0E17]'
                      : 'bg-white hover:bg-[#F0E9DC] text-[#1E1412]/80 border border-[#C5A059]/30 shadow-xs'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                  <span>{a.name}</span>
                  {a.isFeatured && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
                      isSelected ? 'bg-[#C5A059] text-[#120B0A]' : 'bg-[#4A0E17]/10 text-[#4A0E17]'
                    }`}>
                      Featured
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Selected Artist Profile Card */}
      <section className="py-12 md:py-16 bg-[#FCFAF6]">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12">
          
          <div className="bg-white rounded-3xl border border-[#C5A059]/30 shadow-[0_10px_35px_rgba(30,16,12,0.06)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              
              {/* Left Column: Authentic Portrait */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex justify-center bg-gradient-to-br from-[#FAF6F0] to-[#F5EFEB]">
                <div className="relative w-full max-w-[360px] aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#C5A059]/50 shadow-lg group">
                  <img 
                    src={selectedArtist.portraitImage} 
                    alt={selectedArtist.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Bottom Studio Tag */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-[#C5A059]/40 shadow-sm text-center">
                    <p className="font-cinzel text-xs font-bold text-[#4A0E17] uppercase tracking-wider">
                      {selectedArtist.studioName || 'Studio Director'}
                    </p>
                    <p className="font-sans text-[11px] text-[#1E1412]/70 font-medium">
                      {selectedArtist.studioLocation || 'India'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Bio & Core Info */}
              <div className="lg:col-span-7 p-6 sm:p-10 lg:pl-6 flex flex-col justify-center">
                
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#4A0E17] text-[10px] font-cinzel tracking-widest uppercase font-bold">
                    <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{selectedArtist.experienceYears} Studio Research</span>
                  </div>

                  <button
                    onClick={shareArtist}
                    className="p-2 rounded-full hover:bg-stone-100 text-[#1E1412]/60 hover:text-[#4A0E17] transition-colors cursor-pointer"
                    title="Share Profile"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E1412] uppercase tracking-tight">
                  {selectedArtist.name}
                </h2>

                <p className="font-cinzel text-xs sm:text-sm text-[#4A0E17] uppercase tracking-[0.2em] font-bold mt-1">
                  {selectedArtist.title}
                </p>

                {/* Primary Quote */}
                <p className="mt-4 text-base sm:text-lg font-cormorant italic text-[#1E1412]/85 leading-relaxed border-l-2 border-[#C5A059] pl-4 bg-[#FAF6F0] py-2 pr-3 rounded-r-lg">
                  “{selectedArtist.quote}”
                </p>

                {/* Concise Bio */}
                <p className="mt-4 text-xs sm:text-sm font-sans text-[#1E1412]/75 leading-relaxed">
                  {selectedArtist.bio}
                </p>

                {/* Meta Pills */}
                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-sans text-[#1E1412]/80">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF6F0] border border-stone-200">
                    <MapPin className="w-3.5 h-3.5 text-[#4A0E17]" />
                    <span>{selectedArtist.studioLocation}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF6F0] border border-stone-200">
                    <Layers className="w-3.5 h-3.5 text-[#4A0E17]" />
                    <span>{selectedArtist.primaryMediaSummary}</span>
                  </div>
                </div>

                {/* Studio Details Action */}
                <div className="mt-6 pt-5 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  {selectedArtist.contact.instagram && (
                    <span className="text-xs font-mono text-stone-600">
                      Instagram: <strong className="text-[#4A0E17] font-semibold">{selectedArtist.contact.instagram}</strong>
                    </span>
                  )}

                  <button
                    onClick={() => setShowFullDetails(!showFullDetails)}
                    className="px-4 py-2 rounded-full bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#4A0E17] font-cinzel text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer border border-[#C5A059]/30 ml-auto"
                  >
                    <span>{showFullDetails ? 'Hide Studio Details' : 'View Studio Details & Exhibitions'}</span>
                    {showFullDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

              </div>

            </div>

            {/* Expandable Studio Details & Exhibitions Drawer */}
            <AnimatePresence>
              {showFullDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-stone-200 bg-[#FAF6F0] p-6 sm:p-10 space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Column 1: Exhibitions */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 font-cinzel text-xs uppercase tracking-wider text-[#4A0E17] font-bold">
                        <Calendar className="w-4 h-4" />
                        <span>Exhibitions &amp; History</span>
                      </div>
                      <div className="space-y-3">
                        {selectedArtist.exhibitions?.slice(0, 4).map((ex, i) => (
                          <div key={i} className="p-3 bg-white rounded-xl border border-stone-200 text-xs">
                            <h5 className="font-bold text-[#1E1412] font-cinzel">{ex.venue}</h5>
                            <p className="text-stone-600 font-sans mt-0.5 leading-relaxed">{ex.curatorialFocus}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Studio Practice */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 font-cinzel text-xs uppercase tracking-wider text-[#4A0E17] font-bold">
                        <BookOpen className="w-4 h-4" />
                        <span>Studio Philosophy</span>
                      </div>
                      <div className="space-y-3">
                        {selectedArtist.philosophy?.slice(0, 3).map((ph, i) => (
                          <div key={i} className="p-3 bg-white rounded-xl border border-stone-200 text-xs">
                            <h5 className="font-bold text-[#4A0E17] font-cinzel">{ph.title}</h5>
                            <p className="text-stone-600 font-sans mt-0.5 leading-relaxed">{ph.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Collector Note & Contact */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 font-cinzel text-xs uppercase tracking-wider text-[#4A0E17] font-bold">
                        <Award className="w-4 h-4" />
                        <span>Acquisition Note</span>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-stone-200 text-xs font-sans space-y-3">
                        <p className="italic font-cormorant text-sm text-[#1E1412]/85 leading-relaxed">
                          “{selectedArtist.curatorialNote}”
                        </p>
                        <div className="pt-2 border-t border-stone-100 font-mono text-[11px] text-stone-600 space-y-1">
                          <div>Instagram: <span className="font-bold text-[#4A0E17]">{selectedArtist.contact.instagram}</span></div>
                          <div>Location: {selectedArtist.studioLocation}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </section>

      {/* Mapped Artworks Section: Clean Off-White Catalog Grid */}
      <section className="py-12 md:py-20 bg-[#FCFAF6] border-t border-stone-200">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-cinzel uppercase tracking-[0.22em] text-[#4A0E17] font-bold mb-1">
                <span>Certified Catalog</span>
              </div>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase text-[#1E1412]">
                Artworks by {selectedArtist.name} ({artworks.length})
              </h3>
              <p className="font-cormorant italic text-sm sm:text-base text-[#1E1412]/70 mt-1">
                Original sculptures and mixed media available for lease and outright acquisition.
              </p>
            </div>

            {/* Filter Pills for series (e.g. Cave Painting, Primal, Physiognomies, Micro) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-cinzel uppercase tracking-wider font-semibold">
              <button
                onClick={() => setArtworkFilter('all')}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  artworkFilter === 'all'
                    ? 'bg-[#4A0E17] text-white font-bold shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-300'
                }`}
              >
                All ({artworks.length})
              </button>
            </div>
          </div>

          {/* Artworks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredArtworks.map((art, idx) => {
              const fav = isFavorite(art.id);
              const imgUrl = art.localImagePath || art.images?.[0]?.fileKey || '';

              return (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: (idx % 4) * 0.05 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-[#C5A059] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image container */}
                  <div 
                    onClick={() => navigate(`/artwork/${art.id}`)}
                    className="relative aspect-[4/5] bg-stone-100 overflow-hidden cursor-pointer flex items-center justify-center p-3"
                  >
                    <img
                      src={imgUrl}
                      alt={art.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (fav) removeFavorite(art.id);
                        else addFavorite(art.id);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border ${
                        fav
                          ? 'bg-[#4A0E17] text-white border-[#4A0E17]'
                          : 'bg-white/90 text-stone-700 hover:text-[#4A0E17] border-stone-200 shadow-xs'
                      }`}
                      title={fav ? "Remove from Saved" : "Save Artwork"}
                    >
                      <Heart className={`w-4 h-4 ${fav ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h4 
                        onClick={() => navigate(`/artwork/${art.id}`)}
                        className="font-cinzel text-sm sm:text-base font-bold text-[#1E1412] group-hover:text-[#4A0E17] transition-colors truncate cursor-pointer"
                        title={art.title}
                      >
                        {art.title}
                      </h4>

                      <p className="text-xs font-cormorant italic text-stone-600 line-clamp-1 mt-0.5">
                        {art.medium}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-xs font-sans text-stone-500 pt-2 border-t border-stone-100">
                        <span className="font-mono text-[11px]">{art.dimensions || 'Dimensions on dossier'}</span>
                        <span className="font-cinzel font-bold text-[#4A0E17]">
                          ₹{art.rentalPriceCents?.toLocaleString('en-IN')}/mo
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
                      <Link
                        to={`/artwork/${art.id}`}
                        className="flex-1 py-2 text-center rounded-lg bg-[#FAF6F0] hover:bg-[#4A0E17] hover:text-[#FAF6F0] text-[#1E1412] font-cinzel text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        View Dossier
                      </Link>

                      <button
                        onClick={() => {
                          addItem(art);
                          navigate('/cart');
                        }}
                        className="p-2 rounded-lg bg-[#4A0E17] hover:bg-[#6E1825] text-[#FAF6F0] transition-colors cursor-pointer"
                        title="Add to Lease Cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </motion.div>
              );
            })}
          </div>

          {filteredArtworks.length === 0 && (
            <div className="py-16 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-white">
              <p className="font-cinzel text-base text-stone-600">No artworks found for this series filter.</p>
              <button
                onClick={() => setArtworkFilter('all')}
                className="mt-3 px-5 py-2 rounded-full bg-[#4A0E17] text-white font-cinzel text-xs uppercase font-bold"
              >
                Show All Works
              </button>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
}
