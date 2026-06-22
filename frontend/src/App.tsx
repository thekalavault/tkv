/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import Lenis from "lenis";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerDashboard from "./pages/dashboard/CustomerDashboard";
import SignIn from "./pages/SignIn";
import ArtworkDetail from "./pages/ArtworkDetail";
import Manifesto from "./pages/Manifesto";
import Services from "./pages/Services";
import Subscriptions from "./pages/Subscriptions";
import Inquiry from "./pages/Inquiry";
import Collections from "./pages/Collections";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";

export default function App() {
  const { pathname } = useLocation();

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      lerp: 0.05,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/artwork/:id" element={<ArtworkDetail />} />
            <Route path="/manifesto" element={<Manifesto />} />
            <Route path="/services" element={<Services />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/inquire" element={<Inquiry />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

