import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import TopNavBar from '../components/TopNavBar';

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  return (
    <div className="bg-paper-white text-primary min-h-screen flex flex-col font-body-md overflow-x-hidden selection:bg-gallery-gold/30">
      <TopNavBar />
      <main className="flex-1 mt-24 max-w-[1600px] w-full mx-auto px-6 md:px-12 py-16">
        <div className="reveal">
          <section className="space-y-2 mb-10 border-b border-gallery-gold/20 pb-4">
            <span className="font-label-caps text-[10px] tracking-widest text-gallery-gold uppercase block">CURATED</span>
            <h3 className="font-display-md text-4xl tracking-tight text-primary">Your Favorites</h3>
          </section>
          {favorites.length === 0 ? (
            <div className="bg-subtle-smoke p-12 border border-gallery-gold/20 text-center">
              <p className="font-body-md text-primary/60 mb-6">You have not saved any artworks yet.</p>
              <Link to="/customer?tab=catalog" className="px-8 py-3 bg-primary text-white font-label-caps text-[11px] tracking-widest uppercase hover:bg-gallery-gold transition-colors inline-block">
                Explore Collections
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map(id => (
                <div key={id} className="relative bg-white border border-outline/10 shadow-sm flex flex-col p-4 group cursor-pointer" onClick={() => navigate(`/artwork/${id}`)}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFavorite(id); }}
                    className="absolute top-6 right-6 z-10 bg-white/80 p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">heart_broken</span>
                  </button>
                  <p className="font-label-caps text-[10px] text-gallery-gold mb-2 text-center mt-4">Artwork ID: {id}</p>
                  <p className="font-body-md text-center text-primary/60 mb-4">Click to view details</p>
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
