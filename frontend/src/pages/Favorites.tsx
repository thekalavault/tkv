import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import TopNavBar from '../components/TopNavBar';
import { fetchArtworkById, Artwork } from '../services/artworkService';
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
            localPath: art.localImagePath || '',
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
    <div className="bg-paper-white text-primary min-h-screen flex flex-col font-body-md overflow-x-hidden selection:bg-gallery-gold/30">
      <TopNavBar />
      <main className="flex-1 mt-24 max-w-[1600px] w-full mx-auto px-6 md:px-12 py-16">
        <div className="reveal">
          <section className="flex justify-between items-end mb-10 border-b border-gallery-gold/20 pb-4">
            <div className="space-y-2">
              <span className="font-label-caps text-[10px] tracking-widest text-gallery-gold uppercase block">CURATED</span>
              <h3 className="font-display-md text-4xl tracking-tight text-primary">Your Favorites</h3>
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
                className="bg-primary text-white font-label-caps text-[11px] tracking-widest uppercase px-6 py-3 hover:bg-gallery-gold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                Add All to Cart
              </button>
            )}
          </section>
          
          {loading ? (
             <div className="flex justify-center p-12">
               <div className="w-8 h-8 border-2 border-gallery-gold/30 border-t-gallery-gold rounded-full animate-spin" />
             </div>
          ) : favorites.length === 0 ? (
            <div className="bg-subtle-smoke p-12 border border-gallery-gold/20 text-center">
              <p className="font-body-md text-primary/60 mb-6">You have not saved any artworks yet.</p>
              <Link to="/collections" className="px-8 py-3 bg-primary text-white font-label-caps text-[11px] tracking-widest uppercase hover:bg-gallery-gold transition-colors inline-block">
                Explore Collections
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoriteArtworks.map((artwork, idx) => (
                <div key={artwork.id} className="relative group">
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFavorite(artwork.id); }}
                    className="absolute top-4 right-4 z-40 bg-white/80 p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm cursor-pointer opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-[18px]">heart_broken</span>
                  </button>
                  <ArtworkCard artwork={artwork} index={idx} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="w-full px-12 py-12 flex flex-col items-center justify-center bg-paper-white border-t border-gallery-gold/20 mt-auto">
        <p className="font-label-caps text-[9px] tracking-widest uppercase text-primary/40">© 2026 The Kala Vault. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
