import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { auth } from '../lib/firebase';

export type CartItemType = 'full' | 'monthly_3' | 'monthly_6' | 'monthly_9' | 'monthly_12' | 'subscription';

export interface CartItem {
  id: string; // unique cart item id
  artworkId?: string;
  name: string;
  price: number;
  type: CartItemType;
  imageUrl?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kalavault_cart');
    if (saved && !synced) {
      setItems(JSON.parse(saved));
    }
  }, [synced]);

  useEffect(() => {
    const syncBackend = async () => {
      if (!user) {
        setSynced(false);
        return;
      }
      
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/v1/cart`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          const backendItems = data.map((item: any) => ({
             id: item.id,
             artworkId: item.artworkId,
             name: item.artwork ? `${item.artwork.title} (${item.type.replace('_', ' ')})` : 'Unknown Artwork',
             price: item.priceCents,
             type: item.type as CartItemType,
             imageUrl: item.artwork ? item.artwork.localImagePath : ''
          }));
          
          const localSaved = localStorage.getItem('kalavault_cart');
          let localItems: CartItem[] = [];
          if (localSaved) {
             localItems = JSON.parse(localSaved);
          }
          
          // Basic merge: keep backend, and append local ones that aren't synced
          const backendIds = new Set(data.map((item: any) => item.artworkId + '-' + item.type));
          const merged = [...backendItems];

          for (const local of localItems) {
            const key = local.artworkId + '-' + local.type;
            if (!backendIds.has(key)) {
               try {
                  const res = await fetch(`${API_BASE_URL}/api/v1/cart`, {
                    method: 'POST',
                    headers: { 
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                       artworkId: local.artworkId,
                       type: local.type,
                       priceCents: local.price
                    })
                  });
                  if (res.ok) {
                    const newItem = await res.json();
                    merged.push({ ...local, id: newItem.id });
                  }
               } catch (err) {}
            }
          }

          setItems(merged);
          localStorage.setItem('kalavault_cart', JSON.stringify(merged));
          setSynced(true);
        }
      } catch (err) {
        console.error('Failed to sync cart', err);
      }
    };

    syncBackend();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('kalavault_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    const localId = crypto.randomUUID();
    const newItem = { ...item, id: localId };

    setItems((prev) => {
      const next = [...prev, newItem];
      localStorage.setItem('kalavault_cart', JSON.stringify(next));
      return next;
    });

    if (user) {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`${API_BASE_URL}/api/v1/cart`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
             artworkId: item.artworkId,
             type: item.type,
             priceCents: item.price
          })
        });

        if (res.ok) {
          const created = await res.json();
          // Update the local id to backend id
          setItems(prev => prev.map(i => i.id === localId ? { ...i, id: created.id } : i));
        }
      } catch (err) {
        console.error('Failed to add to cart on backend', err);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    setItems((prev) => {
      const next = prev.filter(item => item.id !== id);
      localStorage.setItem('kalavault_cart', JSON.stringify(next));
      return next;
    });

    if (user) {
      try {
        const token = await auth.currentUser?.getIdToken();
        await fetch(`${API_BASE_URL}/api/v1/cart/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Failed to remove from cart backend', err);
      }
    }
  };

  const clearCart = async () => {
    setItems([]);
    localStorage.removeItem('kalavault_cart');

    if (user) {
      try {
        const token = await auth.currentUser?.getIdToken();
        await fetch(`${API_BASE_URL}/api/v1/cart`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Failed to clear cart backend', err);
      }
    }
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
