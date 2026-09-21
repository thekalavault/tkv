import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { auth, googleProvider } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { ArrowLeft, Eye, EyeOff, Check, AlertCircle, Mail, Lock, User } from 'lucide-react';
import { TkvMonogramSvg } from '../components/KalaVaultLogo';

export default function SignIn() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect');

  const isInitialSignUp = location.pathname === '/signup' || searchParams.get('mode') === 'signup';
  const [isSignUp, setIsSignUp] = useState(isInitialSignUp);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    if (location.pathname === '/signup') {
      setIsSignUp(true);
    } else if (location.pathname === '/signin') {
      setIsSignUp(false);
    }
  }, [location.pathname]);

  const handleNavigation = (role: string, emailStr: string) => {
    if (redirectUrl) {
      navigate(redirectUrl);
    } else if (role === 'admin' || emailStr.toLowerCase() === 'admin@thekalavault.com') {
      navigate('/admin');
    } else {
      navigate('/collections');
    }
  };

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError('');
    
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (fullName && userCredential.user) {
          try {
            await updateProfile(userCredential.user, { displayName: fullName });
          } catch (e) {
            console.error("Could not set display name", e);
          }
        }
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      let role = 'customer';
      try {
        const token = await userCredential.user.getIdToken();
        const response = await fetch('http://localhost:4000/api/v1/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          role = data.role?.name || 'customer';
        }
      } catch (e) {
        console.error("Could not fetch profile for routing", e);
      }

      handleNavigation(['admin', 'account_manager', 'operations'].includes(role) ? 'admin' : 'customer', userCredential.user.email || '');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password credentials. Please verify and try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email address already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication encountered an unexpected error.');
      }
      setIsAuthenticating(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setError('');
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      let role = 'customer';
      try {
        const token = await userCredential.user.getIdToken();
        const response = await fetch('http://localhost:4000/api/v1/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          role = data.role?.name || 'customer';
        }
      } catch (e) {
        console.error("Could not fetch profile for routing", e);
      }
      handleNavigation(['admin', 'account_manager', 'operations'].includes(role) ? 'admin' : 'customer', userCredential.user.email || '');
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setError(err.message || 'Google Authentication failed');
      setIsAuthenticating(false);
    }
  };

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Could not send reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF6F0] text-[#1E1412] h-screen w-screen flex flex-col lg:flex-row overflow-hidden selection:bg-[#C5A059]/30 font-sans">
      
      {/* Left Panel: Curatorial Presentation */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative h-full flex-col justify-between p-10 xl:p-14 z-10 bg-[#160D0F] text-[#FAF6F0] overflow-hidden border-r border-[#C5A059]/20">
        
        {/* Background Atmosphere Image */}
        <div className="absolute inset-0 z-0">
          <img 
            alt="Private Gallery Vault" 
            className="w-full h-full object-cover opacity-25 filter brightness-105 contrast-110" 
            src="https://images.unsplash.com/photo-1577720580479-7d839d829c73?auto=format&fit=crop&q=85&w=2400" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#160D0F] via-[#160D0F]/90 to-[#160D0F]/60" />
        </div>

        {/* Top: Return Navigation */}
        <div className="relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2.5 text-xs font-cinzel uppercase tracking-[0.22em] text-[#FAF6F0]/80 hover:text-[#DFC07D] transition-colors font-bold group"
          >
            <ArrowLeft className="w-4 h-4 text-[#DFC07D] group-hover:-translate-x-1 transition-transform" />
            <span>Return to Gallery</span>
          </Link>
        </div>

        {/* Middle: Editorial Collector Statement */}
        <div className="relative z-10 max-w-md my-auto py-4">
          
          {/* Authentic Brand Logo */}
          <div className="mb-6 inline-flex items-center justify-center">
            <img 
              src="/assets/logo.jpeg" 
              alt="The Kala Vault" 
              className="w-14 h-14 rounded-lg object-cover border border-[#C5A059]/40 shadow-md"
            />
          </div>

          <h1 className="font-brand text-2xl xl:text-3xl font-bold text-[#FAF6F0] leading-snug mb-3 tracking-normal">
            Curating rare masterworks for discerning collectors.
          </h1>

          <p className="text-[#FAF6F0]/75 text-[13.5px] leading-relaxed mb-8 font-light">
            Access private salon viewings, verified museum provenance dossiers, and white-glove curatorial logistics across India and global estates.
          </p>

          {/* Minimal Clean Benefit Pillars */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-start gap-3.5">
              <span className="font-mono text-xs text-[#DFC07D] font-bold mt-0.5">01</span>
              <div>
                <p className="text-xs font-cinzel uppercase tracking-[0.16em] text-[#FAF6F0] font-bold">Unlisted Salon Previews</p>
                <p className="text-[12px] text-[#FAF6F0]/65 mt-0.5 leading-relaxed">Early acquisition rights on newly accessioned private vault works.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="font-mono text-xs text-[#DFC07D] font-bold mt-0.5">02</span>
              <div>
                <p className="text-xs font-cinzel uppercase tracking-[0.16em] text-[#FAF6F0] font-bold">Immutable Provenance</p>
                <p className="text-[12px] text-[#FAF6F0]/65 mt-0.5 leading-relaxed">Cryptographically certified certificates signed by leading conservators.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="font-mono text-xs text-[#DFC07D] font-bold mt-0.5">03</span>
              <div>
                <p className="text-xs font-cinzel uppercase tracking-[0.16em] text-[#FAF6F0] font-bold">White-Glove Delivery</p>
                <p className="text-[12px] text-[#FAF6F0]/65 mt-0.5 leading-relaxed">Museum-grade, climate-controlled transit with insured private courier.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-[11px] font-mono text-[#FAF6F0]/40 tracking-wider">
          © {new Date().getFullYear()} The Kala Vault. All Rights Reserved.
        </div>
      </div>

      {/* Right Panel: Clean, Bold, Modern Form */}
      <div className="w-full lg:w-[55%] xl:w-[58%] h-full flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 py-6 bg-[#FAF6F0] relative overflow-y-auto lg:overflow-hidden">
        
        {/* Mobile Header Top Navigation */}
        <div className="lg:hidden w-full max-w-[420px] mb-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-cinzel uppercase tracking-[0.2em] text-[#1E1412]/80 hover:text-[#7B2431] font-bold"
          >
            <ArrowLeft className="w-4 h-4 text-[#7B2431]" />
            <span>Return to Gallery</span>
          </Link>
        </div>

        <div className="w-full max-w-[420px] my-auto bg-[#FCFAF6] p-8 sm:p-10 rounded-2xl border border-[#C5A059]/35 shadow-[0_10px_35px_rgba(30,16,12,0.06)]">
          
          {/* Smooth Rounded Segmented Toggle Switcher */}
          <div className="mb-7">
            <div className="p-1 bg-[#EDE4D5] rounded-full flex relative max-w-[290px] mx-auto border border-[#DFC07D]/40">
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setError(''); }}
                className={`relative flex-1 py-2 text-[11.5px] font-cinzel uppercase tracking-[0.16em] font-bold text-center transition-colors duration-200 z-10 cursor-pointer rounded-full ${
                  !isSignUp ? 'text-[#FAF6F0]' : 'text-[#1E1412]/70 hover:text-[#7B2431]'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => { setIsSignUp(true); setError(''); }}
                className={`relative flex-1 py-2 text-[11.5px] font-cinzel uppercase tracking-[0.16em] font-bold text-center transition-colors duration-200 z-10 cursor-pointer rounded-full ${
                  isSignUp ? 'text-[#FAF6F0]' : 'text-[#1E1412]/70 hover:text-[#7B2431]'
                }`}
              >
                Create Account
              </button>

              {/* Sliding Active Pill in Cherry Cola */}
              <motion.div
                className="absolute top-1 bottom-1 bg-[#7B2431] rounded-full shadow-xs"
                initial={false}
                animate={{
                  left: isSignUp ? '50%' : '4px',
                  right: isSignUp ? '4px' : '50%'
                }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          {/* Header Title & Subtitle */}
          <div className="text-center mb-6">
            <h2 className="font-brand text-2xl sm:text-[28px] text-[#1E1412] font-bold tracking-tight">
              {isSignUp ? 'Join the Vault' : 'Welcome Back'}
            </h2>
            <p className="text-[#1E1412]/70 text-[13px] mt-1.5 leading-relaxed font-light">
              {isSignUp
                ? 'Establish your collector profile to acquire and archive masterworks.'
                : 'Access your private portfolio, acquired works, and active salons.'}
            </p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 rounded-xl bg-[#7B2431]/10 border border-[#7B2431]/25 text-[#7B2431] text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#7B2431]" />
                <span className="leading-relaxed text-[12px]">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Auth Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* Full Name field for Sign Up */}
            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="block text-[11px] font-cinzel uppercase tracking-[0.14em] text-[#1E1412] font-bold">
                    Collector Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-[#1E1412]/40" />
                    <input 
                      type="text" 
                      placeholder="e.g. Vikramaditya Singhania"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-[#DDD3C4] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1E1412] placeholder-[#1E1412]/35 outline-none focus:border-[#7B2431] focus:ring-2 focus:ring-[#7B2431]/15 transition-all"
                      required={isSignUp}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-cinzel uppercase tracking-[0.14em] text-[#1E1412] font-bold">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-[#1E1412]/40" />
                <input 
                  type="email" 
                  placeholder="collector@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#DDD3C4] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1E1412] placeholder-[#1E1412]/35 outline-none focus:border-[#7B2431] focus:ring-2 focus:ring-[#7B2431]/15 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-cinzel uppercase tracking-[0.14em] text-[#1E1412] font-bold">
                  Password
                </label>
                {!isSignUp && (
                  <button 
                    type="button"
                    onClick={() => { setShowForgotModal(true); setResetEmail(email); setError(''); setResetSent(false); }}
                    className="text-[10.5px] font-cinzel uppercase tracking-[0.14em] text-[#7B2431] hover:text-[#C5A059] transition-colors font-bold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-[#1E1412]/40" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-[#DDD3C4] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1E1412] placeholder-[#1E1412]/35 outline-none focus:border-[#7B2431] focus:ring-2 focus:ring-[#7B2431]/15 transition-all font-mono tracking-wider"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#1E1412]/40 hover:text-[#7B2431] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div 
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded-md border transition-colors flex items-center justify-center ${
                    rememberMe ? 'bg-[#7B2431] border-[#7B2431] text-white' : 'border-[#C5A059]/60 bg-white'
                  }`}
                >
                  {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-[11px] text-[#1E1412] font-cinzel uppercase tracking-[0.12em] font-bold">
                  Keep Session Active
                </span>
              </label>
              
              {isSignUp && (
                <span className="text-[11px] text-[#1E1412]/50">
                  By joining, you agree to Terms
                </span>
              )}
            </div>

            {/* Submit Button in Cherry Cola */}
            <button 
              type="submit" 
              disabled={isAuthenticating}
              className="w-full bg-[#7B2431] hover:bg-[#8F2C3C] active:scale-[0.99] text-[#FAF6F0] py-3 rounded-xl font-cinzel text-xs tracking-[0.18em] uppercase font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer text-center mt-3 border border-[#DFC07D]/30"
            >
              {isAuthenticating ? (
                <span>Verifying Credentials...</span>
              ) : (
                <span>{isSignUp ? 'Create Collector Account' : 'Authenticate & Enter Vault'}</span>
              )}
            </button>

            {/* Hairline Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[#DDD3C4]"></div>
              <span className="flex-shrink-0 mx-3 font-cinzel text-[10px] text-[#1E1412]/50 uppercase tracking-[0.2em] font-bold">
                Or Continue With
              </span>
              <div className="flex-grow border-t border-[#DDD3C4]"></div>
            </div>

            {/* Google Authentication */}
            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isAuthenticating}
              className="w-full bg-white hover:bg-[#FAF6F0] border border-[#DDD3C4] text-[#1E1412] font-cinzel text-xs uppercase tracking-[0.16em] font-bold py-2.5 rounded-xl transition-all disabled:opacity-60 flex justify-center items-center gap-3 cursor-pointer shadow-2xs active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.96 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google Account</span>
            </button>

          </form>

        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FCFAF6] border border-[#C5A059]/40 p-6 sm:p-8 rounded-2xl max-w-md w-full relative text-[#1E1412] shadow-2xl"
            >
              <div className="mb-4">
                <div className="w-10 h-10 rounded-full bg-[#7B2431]/10 flex items-center justify-center text-[#7B2431] mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-cinzel text-xl text-[#1E1412] font-bold">Reset Vault Password</h3>
                <p className="text-xs text-[#1E1412]/70 mt-1 leading-relaxed">
                  Enter your registered collector email address and we will dispatch a secure link to reset your credentials.
                </p>
              </div>

              {resetSent ? (
                <div className="text-center py-3">
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs mb-4 leading-relaxed">
                    A password recovery link has been dispatched to <strong className="font-mono">{resetEmail}</strong>. Please check your inbox and spam folder.
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full bg-[#7B2431] text-[#FAF6F0] py-2.5 rounded-xl font-cinzel text-xs uppercase tracking-widest hover:bg-[#8F2C3C] transition-colors font-bold cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-cinzel uppercase tracking-[0.14em] text-[#1E1412] font-bold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="collector@domain.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full bg-white border border-[#DDD3C4] rounded-xl px-4 py-2.5 text-xs text-[#1E1412] placeholder-[#1E1412]/35 outline-none focus:border-[#7B2431] focus:ring-2 focus:ring-[#7B2431]/15"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 border border-[#DDD3C4] py-2.5 rounded-xl font-cinzel text-xs uppercase tracking-widest text-[#1E1412]/70 hover:bg-[#FAF6F0] transition-colors font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 bg-[#7B2431] hover:bg-[#8F2C3C] text-[#FAF6F0] py-2.5 rounded-xl font-cinzel text-xs uppercase tracking-widest transition-colors disabled:opacity-50 font-bold cursor-pointer"
                    >
                      {resetLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
