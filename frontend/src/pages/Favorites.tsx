import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { fetchArtworkById, getArtworkImagePath, Artwork } from '../services/artworkService';
import { CollectionArtwork } from '../lib/collectionsData';
import ArtworkCard from '../components/ArtworkCard';

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [favoriteArtworks, setFavoriteArtworks] = useState<CollectionArtwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      const artworksData = await Promise.all(
        favorites.map(async (id) => {
          const art = await fetchArtworkById(id);
          if (!art) return null;
          return {
            id: art.id,
            name: art.title,
            size: art.dimensions || 'Variable',
            fileName: '',
            localPath: getArtworkImagePath(art),
            tier: 'medium' as any,
            originalArtwork: art,
          } as CollectionArtwork;
        })
      );
      setFavoriteArtworks(artworksData.filter(Boolean) as CollectionArtwork[]);
      setLoading(false);
    };

    loadFavorites();
  }, [favorites]);

  return (
    <div className="bg-[#FBF9F4] text-[#221E1B] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#C5A059]/30 pt-[100px] md:pt-[130px]">
      <TopNavBar />
      
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-6 md:px-12 py-12 md:py-16">
        <div>
          <section className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-[#221E1B]/10 pb-6 gap-6">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.35em] font-mono text-[#C5A059] uppercase block font-bold">
                Private Collection Archive
              </span>
              <h1 className="font-serif text-3xl md:text-5xl tracking-tight text-[#221E1B] font-normal">
                Curated Saved Works
              </h1>
            </div>

            {favoriteArtworks.length > 0 && (
              <button 
                onClick={() => {
                  favoriteArtworks.forEach(art => {
                    addToCart({
                      artworkId: art.id,
                      name: art.name,
                      price: art.originalArtwork?.replacementValue || 0,
                      type: 'full',
                      imageUrl: art.localPath
                    });
                  });
                  navigate('/cart');
                }}
                className="pill-button pill-button-gold shadow-lg cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                Transfer All to Portfolio Cart
              </button>
            )}
          </section>
          
          {loading ? (
             <div className="flex justify-center py-24">
               <div className="w-10 h-10 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin" />
             </div>
          ) : favorites.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl p-16 md:p-24 rounded-3xl border border-[#221E1B]/10 text-center shadow-sm max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full border border-[#221E1B]/10 bg-[#EDE7DE]/60 flex items-center justify-center mx-auto mb-6 text-[#221E1B]/40">
                <span className="material-symbols-outlined text-[30px]">favorite_border</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-[#221E1B] mb-3 font-normal">
                No Masterworks Saved Yet
              </h2>
              <p className="text-sm text-[#221E1B]/60 mb-8 max-w-md mx-auto">
                Bookmark artworks as you explore our curatorial suites to compare dimensions and request private preview viewings.
              </p>
              <Link to="/collections" className="pill-button pill-button-espresso text-xs">
                Explore Collections
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {favoriteArtworks.map((artwork, idx) => (
                <div key={artwork.id} className="relative group">
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFavorite(artwork.id); }}
                    className="absolute top-4 right-4 z-40 bg-white/95 backdrop-blur-md p-2.5 rounded-full text-[#8C4A3E] hover:bg-[#8C4A3E] hover:text-white transition-all shadow-md cursor-pointer opacity-0 group-hover:opacity-100 flex items-center justify-center"
                    title="Remove from Saved"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                  <ArtworkCard artwork={artwork} index={idx} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
