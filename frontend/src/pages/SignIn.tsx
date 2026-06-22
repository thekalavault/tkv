import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect');

  const handleNavigation = (role: string, emailStr: string) => {
    if (redirectUrl) {
      navigate(redirectUrl);
    } else if (role === 'admin' || emailStr.toLowerCase().includes('admin')) {
      navigate('/admin');
    } else {
      // Redirect customers to Collections to pick artworks (Onboarding flow)
      navigate('/collections');
    }
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError('');
    
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      handleNavigation(email.toLowerCase().includes('admin') ? 'admin' : 'customer', userCredential.user.email || '');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password. Do you need to create an account?');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Try signing in.');
      } else {
        setError(err.message || 'Authentication failed');
      }
      setIsAuthenticating(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setError('');
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      handleNavigation((userCredential.user.email || '').toLowerCase().includes('admin') ? 'admin' : 'customer', userCredential.user.email || '');
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setError(err.message || 'Google Authentication failed');
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="bg-paper-white text-primary font-body-md selection:bg-gallery-gold/30 h-screen w-screen flex flex-col lg:flex-row overflow-hidden">
      
      { /* Left Panel - Visual Identity */ }
      <div className="w-full lg:w-1/2 relative h-[30vh] lg:h-screen flex flex-col justify-between p-8 md:p-12 lg:p-16 z-10 bg-matte-black shadow-2xl">
        <div className="absolute inset-0 overflow-hidden">
           <img 
              alt="Premium Gallery Space" 
              className="w-full h-full object-cover opacity-50 grayscale mix-blend-luminosity" 
              src="https://images.unsplash.com/photo-1577720580479-7d839d829c73?auto=format&fit=crop&q=80&w=2500" 
          />
        </div>
        <div className="relative z-10 w-max">
          <Link to="/" className="font-display-lg text-[20px] md:text-[26px] text-paper-white uppercase tracking-[0.15em] font-medium leading-none whitespace-nowrap hover:text-gallery-gold transition-colors">
              THE KALA VAULT
          </Link>
        </div>
        <div className="relative z-10 hidden md:block max-w-lg">
            <p className="font-label-caps text-[11px] text-gallery-gold tracking-[0.2em] mb-4 uppercase">Exhibition Access</p>
            <h2 className="font-display-lg text-4xl lg:text-5xl text-paper-white font-normal leading-snug drop-shadow-lg">
                Curating masterpieces for the discerning collector.
            </h2>
        </div>
      </div>

      { /* Right Panel - Authentication Container */ }
      <div className="w-full lg:w-1/2 h-[70vh] lg:h-screen overflow-y-auto flex items-center justify-center p-6 md:p-12 lg:p-24 relative z-20 bg-paper-white">
        
        <div className="w-full max-w-sm transition-all duration-500 ease-in-out">
          <div className="mb-12 text-center md:text-left">
            <h1 className="font-display-lg text-4xl text-primary mb-3 tracking-tight">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h1>
            <p className="font-body-md text-on-surface-variant text-[15px] leading-relaxed">
              {isSignUp 
                ? 'Register to curate your portfolio and acquire masterpieces.' 
                : 'Access your curated portfolios and private acquisitions.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-label-caps uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-8">
            <div className="group relative">
              <label className="font-label-caps text-[11px] uppercase tracking-widest text-primary/70 mb-2 block">
                Email Address
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-outline/30 focus:border-primary py-2 font-body-md text-primary outline-none transition-colors"
                required
              />
            </div>

            <div className="group relative">
              <label className="font-label-caps text-[11px] uppercase tracking-widest text-primary/70 mb-2 block">
                Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-outline/30 focus:border-primary py-2 font-body-md text-primary outline-none transition-colors tracking-widest"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 border border-outline/50 group-hover:border-primary flex items-center justify-center transition-colors">
                        <div className="w-2 h-2 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    </div>
                    <span className="font-label-caps text-[11px] text-primary/70 group-hover:text-primary transition-colors uppercase">Remember Me</span>
                </label>
                {!isSignUp && (
                  <a href="#" className="font-label-caps text-[11px] text-primary/70 hover:text-primary transition-colors uppercase">
                      Forgot Password?
                  </a>
                )}
            </div>

            <div className="pt-6 space-y-5">
              <button 
                type="submit" 
                disabled={isAuthenticating}
                className="w-full bg-primary text-paper-white py-4 font-label-caps text-[11px] tracking-[0.2em] uppercase hover:bg-gallery-gold transition-all duration-300 disabled:opacity-50 mt-2 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.3)]"
              >
                {isAuthenticating ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-outline/20"></div>
                <span className="flex-shrink-0 mx-4 font-label-caps text-[9px] text-primary/40 uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-outline/20"></div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isAuthenticating}
                className="w-full border border-outline/30 text-primary font-label-caps text-[11px] uppercase tracking-[0.2em] py-4 hover:border-primary hover:bg-subtle-smoke transition-all duration-300 disabled:opacity-80 flex justify-center items-center gap-3 cursor-pointer"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4 opacity-80" />
                Continue with Google
              </button>
              
              <div className="text-center pt-8">
                <p className="font-body-md text-[13px] text-primary/70">
                  {isSignUp ? 'Already have an account? ' : 'Need an account? '}
                  <button 
                    type="button" 
                    onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                    className="font-display-md text-[14px] text-primary hover:text-gallery-gold transition-colors ml-1 pb-0.5 border-b-2 border-primary hover:border-gallery-gold"
                  >
                    {isSignUp ? 'Sign In' : 'Create one'}
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
