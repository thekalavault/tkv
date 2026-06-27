import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { auth } from '../lib/firebase';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (id: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [synced, setSynced] = useState(false);

  // Load from local storage initially
  useEffect(() => {
    const saved = localStorage.getItem('kalavault_favorites');
    if (saved && !synced) {
      setFavorites(JSON.parse(saved));
    }
  }, [synced]);

  // Sync with backend on login
  useEffect(() => {
    const syncBackend = async () => {
      if (!user) {
        setSynced(false);
        return;
      }
      
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;

        // Fetch user favorites from backend
        const res = await fetch(`${API_BASE_URL}/api/v1/favorites`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          const backendIds = data.map((fav: any) => fav.artworkId);
          
          // Merge local and backend favorites
          const localSaved = localStorage.getItem('kalavault_favorites');
          let localFavs: string[] = [];
          if (localSaved) {
             localFavs = JSON.parse(localSaved);
          }
          
          const merged = Array.from(new Set([...backendIds, ...localFavs]));
          
          // Push local ones to backend that aren't there yet
          for (const id of localFavs) {
            if (!backendIds.includes(id)) {
               await fetch(`${API_BASE_URL}/api/v1/favorites`, {
                  method: 'POST',
                  headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ artworkId: id })
               });
            }
          }

          setFavorites(merged);
          localStorage.setItem('kalavault_favorites', JSON.stringify(merged));
          setSynced(true);
        }
      } catch (err) {
        console.error('Failed to sync favorites', err);
      }
    };

    syncBackend();
  }, [user]);


  const addFavorite = async (id: string) => {
    setFavorites((prev) => {
      if (!prev.includes(id)) {
        const next = [...prev, id];
        localStorage.setItem('kalavault_favorites', JSON.stringify(next));
        return next;
      }
      return prev;
    });

    if (user) {
      try {
        const token = await auth.currentUser?.getIdToken();
        await fetch(`${API_BASE_URL}/api/v1/favorites`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ artworkId: id })
        });
      } catch (err) {
        console.error('Failed to add favorite to backend', err);
      }
    }
  };

  const removeFavorite = async (id: string) => {
    setFavorites((prev) => {
      const next = prev.filter(fId => fId !== id);
      localStorage.setItem('kalavault_favorites', JSON.stringify(next));
      return next;
    });

    if (user) {
      try {
        const token = await auth.currentUser?.getIdToken();
        await fetch(`${API_BASE_URL}/api/v1/favorites/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Failed to remove favorite from backend', err);
      }
    }
  };

  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
