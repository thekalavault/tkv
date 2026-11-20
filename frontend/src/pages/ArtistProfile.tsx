import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MapPin, 
  Layers, 
  ArrowRight, 
  Maximize2, 
  CheckCircle2, 
  Heart, 
  ShoppingBag,
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  Share2
} from 'lucide-react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { getArtistBySlug, getAllArtists, getArtworksForArtist, ArtistProfile as ArtistProfileType } from '../data/artistsData';
import { Artwork, LOCAL_ARTWORKS } from '../services/artworkService';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

export default function ArtistProfile() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const currentSlug = slug || 'shagun-agarwal';
  const [artist, setArtist] = useState<ArtistProfileType>(() => {
    return getArtistBySlug(currentSlug) || getArtistBySlug('shagun-agarwal')!;
  });

  useEffect(() => {
    const fresh = getArtistBySlug(currentSlug) || getArtistBySlug('shagun-agarwal')!;
    setArtist(fresh);

    const handleUpdate = () => {
      const updated = getArtistBySlug(currentSlug) || getArtistBySlug('shagun-agarwal')!;
      setArtist(updated);
    };

    window.addEventListener('kalavault_artists_updated', handleUpdate);
    return () => window.removeEventListener('kalavault_artists_updated', handleUpdate);
  }, [currentSlug]);

  const artworks: Artwork[] = useMemo(() => {
    return getArtworksForArtist(artist.name, LOCAL_ARTWORKS);
  }, [artist.name]);

  const [activeSeriesTab, setActiveSeriesTab] = useState<string>('all');
  const [selectedArtworkForModal, setSelectedArtworkForModal] = useState<Artwork | null>(null);
  const [inquirySuccess, setInquirySuccess] = useState<boolean>(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const filteredArtworks = useMemo(() => {
    if (activeSeriesTab === 'all') return artworks;
    return artworks.filter(art => {
      const cur = (art.metadata?.thematicCuration || '').toLowerCase();
      const ser = (art.metadata?.series || '').toLowerCase();
      return cur.includes(activeSeriesTab) || ser.includes(activeSeriesTab);
    });
  }, [artworks, activeSeriesTab]);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setInquiryForm({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${artist.name} | The Kala Vault`,
        text: `Explore fine art sculptures and reliefs by ${artist.name} (${artist.studioName}).`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Artist monograph link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#1E1412] selection:bg-[#C5A059]/30 selection:text-[#4A0E17]">
      <TopNavBar />

      {/* Header Breadcrumb & Title */}
      <section className="relative pt-32 pb-8 md:pt-40 md:pb-10 bg-gradient-to-b from-[#F7F3EB] to-[#FCFAF6] border-b border-[#C5A059]/20">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12">
          
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-cinzel text-[#4A0E17] mb-4 font-bold">
            <Link to="/artists" className="hover:underline">Resident Artists</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[#1E1412]/60">{artist.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-cinzel uppercase tracking-[0.24em] text-[#C5A059] font-bold block mb-1">
                {artist.studioName || 'Studio Monograph'}
              </span>
              <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#1E1412] uppercase tracking-tight">
                {artist.name}
              </h1>
              <p className="font-cormorant italic text-base sm:text-lg text-[#1E1412]/75 mt-1">
                {artist.title} • {artist.studioLocation || 'India'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={shareProfile}
                className="px-4 py-2 bg-white hover:bg-[#F5EFEB] border border-stone-300 rounded-full text-xs font-cinzel uppercase font-bold text-[#1E1412] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5 text-[#4A0E17]" />
                <span>Share Profile</span>
              </button>

              <a
                href="#inquire"
                className="px-5 py-2 bg-[#4A0E17] hover:bg-[#6E1825] text-[#FAF6F0] rounded-full text-xs font-cinzel uppercase font-bold tracking-wider transition-colors shadow-xs"
              >
                Inquire With Studio
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Artist Profile Spotlight Card */}
      <section className="py-10 md:py-14 bg-[#FCFAF6]">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12">
          
          <div className="bg-white rounded-3xl border border-[#C5A059]/30 shadow-[0_10px_35px_rgba(30,16,12,0.06)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              
              {/* Portrait Visual */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex justify-center bg-gradient-to-br from-[#FAF6F0] to-[#F5EFEB]">
                <div className="relative w-full max-w-[360px] aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#C5A059]/40 shadow-lg group">
                  <img 
                    src={artist.portraitImage} 
                    alt={artist.name} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-[#C5A059]/30 text-center">
                    <p className="font-cinzel text-xs font-bold text-[#4A0E17] uppercase tracking-wider">
                      {artist.name}
                    </p>
                    <p className="font-sans text-[11px] text-[#1E1412]/70 font-medium">
                      {artist.studioName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Overview */}
              <div className="lg:col-span-7 p-6 sm:p-10 lg:pl-6 space-y-5">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#4A0E17] text-[10px] font-cinzel tracking-widest uppercase font-bold">
                  <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{artist.experienceYears} Studio Practice</span>
                </div>

                <p className="font-cormorant italic text-lg sm:text-xl text-[#1E1412]/90 leading-relaxed border-l-2 border-[#C5A059] pl-4 bg-[#FAF6F0] py-3 pr-3 rounded-r-lg">
                  “{artist.quote}”
                </p>

                <p className="text-sm font-sans text-[#1E1412]/80 leading-relaxed">
                  {artist.bio}
                </p>

                {/* 4 Clean Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {artist.stats?.map((st, i) => (
                    <div key={i} className="p-3 bg-[#FAF6F0] rounded-xl border border-stone-200">
                      <span className="font-cinzel text-lg font-bold text-[#4A0E17] block">{st.value}</span>
                      <span className="font-cinzel text-[10px] uppercase text-[#1E1412]/70 tracking-wider block mt-0.5">{st.label}</span>
                    </div>
                  ))}
                </div>

                {/* Artist Social / Profile Links */}
                <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-stone-200">
                  {artist.contact.instagram && (
                    <span className="text-xs font-mono text-stone-600">
                      Instagram: <strong className="text-[#4A0E17] font-semibold">{artist.contact.instagram}</strong>
                    </span>
                  )}
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Mapped Artworks Catalog */}
      <section className="py-12 md:py-16 bg-[#FCFAF6] border-t border-stone-200">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-cinzel uppercase tracking-[0.22em] text-[#4A0E17] font-bold block mb-1">
                Studio Collection
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase text-[#1E1412]">
                Artworks by {artist.name} ({artworks.length})
              </h2>
              <p className="font-cormorant italic text-sm text-[#1E1412]/70 mt-1">
                Select any piece to inspect details, dimensions, and rotational lease options.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-cinzel uppercase tracking-wider font-semibold">
              <button
                onClick={() => setActiveSeriesTab('all')}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeSeriesTab === 'all'
                    ? 'bg-[#4A0E17] text-white font-bold shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-300'
                }`}
              >
                All Works ({artworks.length})
              </button>
            </div>
          </div>

          {/* Grid of Artwork Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredArtworks.map((art, idx) => {
              const fav = isFavorite(art.id);
              const imgUrl = art.localImagePath || art.images?.[0]?.fileKey || '';

              return (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: (idx % 4) * 0.05 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-[#C5A059] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Artwork Image Container */}
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
                        <span className="font-mono text-[11px]">{art.dimensions || 'Gallery piece'}</span>
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

        </div>
      </section>

      {/* Clean Studio Details: Exhibitions & Philosophy */}
      {((artist.exhibitions && artist.exhibitions.length > 0) || (artist.philosophy && artist.philosophy.length > 0)) && (
        <section className="py-12 md:py-16 bg-[#F7F3EB] border-t border-stone-200">
          <div className="max-w-[1360px] mx-auto px-6 md:px-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Exhibitions */}
              {artist.exhibitions && artist.exhibitions.length > 0 && (
                <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-xs font-cinzel uppercase tracking-wider text-[#4A0E17] font-bold">
                    <Calendar className="w-4 h-4 text-[#C5A059]" />
                    <span>Exhibitions &amp; Curation History</span>
                  </div>

                  <div className="space-y-3">
                    {artist.exhibitions.map((ex, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-[#FCFAF6] border border-stone-200 text-xs">
                        <h5 className="font-bold font-cinzel text-[#1E1412]">{ex.venue}</h5>
                        <p className="text-stone-600 font-sans mt-0.5 leading-relaxed">{ex.curatorialFocus}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Studio Philosophy */}
              {artist.philosophy && artist.philosophy.length > 0 && (
                <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-xs font-cinzel uppercase tracking-wider text-[#4A0E17] font-bold">
                    <BookOpen className="w-4 h-4 text-[#C5A059]" />
                    <span>Studio Philosophy &amp; Pedagogy</span>
                  </div>

                  <div className="space-y-3">
                    {artist.philosophy.map((ph, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-[#FCFAF6] border border-stone-200 text-xs">
                        <span className="text-[10px] uppercase font-bold text-[#C5A059] block font-cinzel">
                          {ph.type === 'studio_practice' ? 'Practice' : 'Masterclass'}
                        </span>
                        <h5 className="font-bold font-cinzel text-[#4A0E17] mt-0.5">{ph.title}</h5>
                        <p className="text-stone-600 font-sans mt-0.5 leading-relaxed">{ph.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>
      )}

      {/* Studio Inquiry Section */}
      <section id="inquire" className="py-12 md:py-16 bg-[#FCFAF6] border-t border-stone-200">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12">
          
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-[#C5A059]/40 shadow-sm">
            <div className="text-center mb-6">
              <span className="text-xs font-cinzel uppercase tracking-[0.2em] text-[#C5A059] font-bold block mb-1">
                Studio Communications
              </span>
              <h3 className="font-cinzel text-2xl font-bold uppercase text-[#1E1412]">
                Inquire With {artist.name}
              </h3>
              <p className="text-xs font-sans text-stone-600 mt-1">
                Direct inquiry with {artist.studioName || 'the studio'} and our vault curatorial concierge.
              </p>
            </div>

            {inquirySuccess ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
                <h5 className="font-cinzel text-sm font-bold text-emerald-900">Inquiry Received</h5>
                <p className="text-xs text-emerald-700">Thank you. The studio will respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-cinzel uppercase text-stone-600 block mb-1 font-bold">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.name}
                      onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      placeholder="e.g. Alistair Vance"
                      className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-[#4A0E17]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-cinzel uppercase text-stone-600 block mb-1 font-bold">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={inquiryForm.email}
                      onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      placeholder="collector@residence.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-[#4A0E17]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-cinzel uppercase text-stone-600 block mb-1 font-bold">Message or Commission Request</label>
                  <textarea
                    rows={3}
                    required
                    value={inquiryForm.message}
                    onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    placeholder="Inquiry details regarding available originals or custom architectural commissions..."
                    className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-[#4A0E17]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#4A0E17] hover:bg-[#6E1825] text-white font-cinzel text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Send Inquiry to {artist.studioName || artist.name}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
