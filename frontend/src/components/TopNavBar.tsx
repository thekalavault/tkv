import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { TkvMonogramSvg } from './KalaVaultLogo';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

export default function TopNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoImgError, setLogoImgError] = useState(false);

  const location = useLocation();
  const { user: currentUser, dbUser } = useAuth();
  const { items: cartItems } = useCart();
  const { favorites } = useFavorites();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Collections', path: '/collections' },
    { name: 'Services', path: '/services' },
    { name: 'Subscriptions', path: '/subscriptions' },
    { name: 'Manifesto', path: '/manifesto' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        } ${
          isScrolled 
            ? 'py-2 px-4 md:px-8' 
            : 'py-2.5 md:py-3.5 px-4 md:px-8'
        }`}
      >
        <div 
          className={`max-w-[1360px] mx-auto rounded-full transition-all duration-400 ${
            isScrolled 
              ? 'bg-[#FCFAF6]/98 backdrop-blur-2xl border border-[#C5A059]/40 shadow-[0_10px_35px_rgba(30,16,12,0.08)] px-5 md:px-7 py-2' 
              : 'bg-[#FCFAF6]/92 backdrop-blur-xl border border-[#C5A059]/30 shadow-[0_4px_24px_rgba(30,16,12,0.04)] px-6 md:px-8 py-2.5'
          } flex items-center justify-between gap-4`}
        >
          
          {/* Left Side: Brand Logo & Title */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0 cursor-pointer select-none"
          >
            {/* Custom Logo with authentic brand image */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.25 }}
              className="shrink-0 flex items-center justify-center"
            >
              <img 
                src="/assets/logo.jpeg" 
                alt="The Kala Vault Logo"
                className="h-9 sm:h-10 w-9 sm:w-10 rounded-md object-cover border border-[#C5A059]/40 shadow-xs transition-transform duration-300" 
              />
            </motion.div>

            {/* Brand Title */}
            <div className="flex items-center text-left justify-center">
              <span className="font-brand text-[20px] sm:text-[22px] md:text-[24px] font-bold tracking-[0.14em] uppercase text-[#1E1412] group-hover:text-[#7B2431] transition-colors leading-none">
                THE KALA VAULT
              </span>
            </div>
          </Link>

          {/* Right Side: Navigation Links & Actions */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-4 justify-end shrink-0">
            
            {/* Nav Links */}
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-cinzel text-[11.5px] xl:text-[12px] font-bold tracking-[0.16em] uppercase px-4 py-1.5 rounded-full transition-all duration-300 whitespace-nowrap ${
                    active
                      ? 'bg-[#7B2431] text-[#FAF6F0] shadow-sm border border-[#DFC07D]/40'
                      : 'text-[#1E1412]/80 hover:text-[#7B2431] hover:bg-[#7B2431]/08'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* User Actions or Sign In Button */}
            {currentUser ? (
              <div className="flex items-center gap-2.5 shrink-0 ml-1">
                {/* Profile */}
                <Link
                  to={['admin', 'account_manager', 'operations'].includes(dbUser?.role?.name || '') ? "/admin" : "/customer"}
                  title="Account Dashboard"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#7B2431] bg-[#FAF6F0] border border-[#C5A059]/35 hover:bg-[#7B2431] hover:text-[#FAF6F0] hover:border-[#7B2431] transition-all duration-300 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">person</span>
                </Link>
                
                {/* Favorites */}
                <Link 
                  to="/favorites" 
                  title="Saved Favorites"
                  className="relative w-8 h-8 rounded-full flex items-center justify-center text-[#7B2431] bg-[#FAF6F0] border border-[#C5A059]/35 hover:bg-[#7B2431] hover:text-[#FAF6F0] hover:border-[#7B2431] transition-all duration-300 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">favorite</span>
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#7B2431] text-[#FAF6F0] text-[9px] font-bold min-w-[15px] h-[15px] flex items-center justify-center rounded-full px-1 shadow-xs border border-[#DFC07D]/60">
                      {favorites.length}
                    </span>
                  )}
                </Link>

                {/* Bag */}
                <Link 
                  to="/cart" 
                  className="flex items-center gap-1.5 bg-[#7B2431] hover:bg-[#8F2C3C] text-[#FAF6F0] px-3.5 py-1.5 rounded-full border border-[#DFC07D]/40 transition-all duration-300 shadow-xs font-cinzel text-[11px] uppercase font-bold tracking-wider whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#DFC07D]">shopping_bag</span>
                  <span>BAG</span>
                  <span className="bg-black/25 text-[#DFC07D] px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                    {cartItems.length}
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                to="/signin"
                className="font-cinzel text-[11.5px] xl:text-[12px] font-bold tracking-[0.18em] uppercase px-6 py-2 rounded-full bg-[#7B2431] hover:bg-[#8F2C3C] text-[#FAF6F0] border border-[#DFC07D]/40 shadow-xs active:scale-95 transition-all duration-300 whitespace-nowrap shrink-0 ml-1 inline-flex items-center justify-center text-center leading-none"
              >
                SIGN IN
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(true)}
              aria-label="Toggle navigation menu"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#7B2431]/10 border border-[#C5A059]/35 text-[#7B2431] hover:bg-[#7B2431] hover:text-[#FAF6F0] transition-all duration-300"
            >
              <span className="material-symbols-outlined text-lg">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-[#FCFAF6]/98 backdrop-blur-2xl flex flex-col px-6 py-8 text-[#1E1412]"
          >
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-[#C5A059]/30">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                <TkvMonogramSvg size={28} theme="gold" />
                <div className="flex items-center text-left">
                  <span className="font-brand text-lg sm:text-xl font-bold tracking-[0.14em] uppercase text-[#1E1412]">
                    THE KALA VAULT
                  </span>
                </div>
              </Link>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-[#7B2431]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#7B2431] hover:bg-[#7B2431] hover:text-[#FAF6F0] transition-all duration-300"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-4 items-center justify-center flex-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`font-cinzel text-lg uppercase tracking-[0.18em] font-bold px-8 py-3 rounded-full transition-all duration-300 w-full max-w-xs text-center ${
                    isActive(link.path) 
                      ? 'bg-[#7B2431] text-[#FAF6F0] border border-[#DFC07D]/40 shadow-sm' 
                      : 'text-[#1E1412]/80 hover:text-[#7B2431] hover:bg-[#7B2431]/08'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
                {currentUser ? (
                  <Link 
                    to={['admin', 'account_manager', 'operations'].includes(dbUser?.role?.name || '') ? "/admin" : "/customer"} 
                    className="font-cinzel text-[13px] font-bold uppercase tracking-[0.18em] text-[#FAF6F0] bg-[#7B2431] hover:bg-[#8F2C3C] border border-[#DFC07D]/40 px-8 py-3.5 rounded-full text-center shadow-md transition-all duration-300"
                  >
                    ACCOUNT DASHBOARD
                  </Link>
                ) : (
                  <Link 
                    to="/signin" 
                    className="font-cinzel text-[13px] font-bold uppercase tracking-[0.18em] text-[#FAF6F0] bg-[#7B2431] hover:bg-[#8F2C3C] border border-[#DFC07D]/40 px-8 py-3.5 rounded-full text-center shadow-md transition-all duration-300"
                  >
                    SIGN IN
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
