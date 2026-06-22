import { Link } from 'react-router-dom';
import KalaVaultLogo from './KalaVaultLogo';

export default function Footer() {
  return (
    <footer className="w-full bg-paper-white border-t border-gallery-gold/25 mt-auto relative overflow-hidden">
      {/* Editorial top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gallery-gold/30 to-transparent" />
      
      <div className="px-margin-mobile md:px-margin-desktop py-20 w-full max-w-[1600px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Brand Signature & Contact details (5-Columns) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4 flex flex-col items-center lg:items-start">
              <Link 
                to="/" 
                className="hover:opacity-90 transition-opacity duration-300 block"
              >
                <KalaVaultLogo variant="alternate" theme="dark" />
              </Link>
              <p className="font-body-md text-on-surface-variant leading-relaxed text-sm max-w-sm mt-4 text-center lg:text-left">
                Elevating corporate flagships and private residences through museum-grade art leasing, rotation, and bespoke curation.
              </p>
            </div>
            
            {/* Fine line divider */}
            <div className="w-12 h-px bg-gallery-gold/30" />
            
            {/* Contact Card Details */}
            <div className="space-y-5">
              <div className="flex gap-4 items-start group">
                <span className="material-symbols-outlined text-[18px] text-gallery-gold mt-0.5 transition-transform duration-300 group-hover:scale-110">
                  location_on
                </span>
                <div>
                  <span className="font-label-caps text-[8.5px] uppercase block tracking-[0.15em] text-primary/40 mb-1 font-bold">HEADQUARTERS</span>
                  <p className="text-xs text-primary leading-relaxed">
                    Unit No. 309, 3rd Floor, Tower A,<br />
                    SAS Tower, Sector 38, Gurugram,<br />
                    Haryana - 122018
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <a 
                  href="tel:8855828748" 
                  className="flex gap-4 items-start group text-xs w-fit" 
                  title="Call Us"
                >
                  <span className="material-symbols-outlined text-[18px] text-gallery-gold mt-0.5 transition-transform duration-300 group-hover:scale-110">
                    phone
                  </span>
                  <div>
                    <span className="font-label-caps text-[8.5px] uppercase block tracking-[0.15em] text-primary/40 mb-0.5 font-bold">TELEPHONE</span>
                    <span className="font-mono text-primary group-hover:text-gallery-gold transition-colors font-medium">+91 88558 28748</span>
                  </div>
                </a>

                <a 
                  href="mailto:contact@thekalavault.com" 
                  className="flex gap-4 items-start group text-xs w-fit" 
                  title="Email Us"
                >
                  <span className="material-symbols-outlined text-[18px] text-gallery-gold mt-0.5 transition-transform duration-300 group-hover:scale-110">
                    mail
                  </span>
                  <div>
                    <span className="font-label-caps text-[8.5px] uppercase block tracking-[0.15em] text-primary/40 mb-0.5 font-bold">DIRECT INQUIRIES</span>
                    <span className="font-mono text-primary group-hover:text-gallery-gold transition-colors font-medium">contact@thekalavault.com</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          {/* Right Columns: Premium Navigation Directory (7-Columns) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-12 lg:pt-2 w-full">
            <div className="space-y-6">
              <p className="font-label-caps text-[10px] tracking-[0.2em] text-primary uppercase font-bold">DISCOVER</p>
              <ul className="space-y-4 font-body-md text-on-surface-variant text-sm">
                <li>
                  <Link className="hover:text-gallery-gold hover:translate-x-1 transition-all duration-300 block w-fit" to="/collections">
                    Art Collections
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gallery-gold hover:translate-x-1 transition-all duration-300 block w-fit" to="/manifesto">
                    The Manifesto
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gallery-gold hover:translate-x-1 transition-all duration-300 block w-fit" to="/subscriptions">
                    Subscriptions
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <p className="font-label-caps text-[10px] tracking-[0.2em] text-primary uppercase font-bold">SERVICES</p>
              <ul className="space-y-4 font-body-md text-on-surface-variant text-sm">
                <li>
                  <Link className="hover:text-gallery-gold hover:translate-x-1 transition-all duration-300 block w-fit" to="/services">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gallery-gold hover:translate-x-1 transition-all duration-300 block w-fit" to="/inquire">
                    Corporate Curation
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gallery-gold hover:translate-x-1 transition-all duration-300 block w-fit" to="/inquire">
                    Private Inquiries
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <p className="font-label-caps text-[10px] tracking-[0.2em] text-primary uppercase font-bold">CONNECT</p>
              <ul className="space-y-4 font-body-md text-on-surface-variant text-sm">
                <li>
                  <Link className="hover:text-gallery-gold hover:translate-x-1 transition-all duration-300 block w-fit" to="/inquire">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gallery-gold hover:translate-x-1 transition-all duration-300 block w-fit" to="/signin">
                    Client Portal
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <p className="font-label-caps text-[10px] tracking-[0.2em] text-primary uppercase font-bold">LEGAL</p>
              <ul className="space-y-4 font-body-md text-on-surface-variant text-sm">
                <li>
                  <Link className="hover:text-gallery-gold hover:translate-x-1 transition-all duration-300 block w-fit" to="/terms">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gallery-gold hover:translate-x-1 transition-all duration-300 block w-fit" to="/privacy">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
        </div>

        {/* Footer Bottom Line */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gallery-gold/15 pt-8 gap-6 mt-16 text-center sm:text-left">
          <p className="font-label-caps tracking-[0.15em] text-primary/45 uppercase text-[9px] md:text-[10px]">
            © {new Date().getFullYear()} THE KALA VAULT. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 font-label-caps text-[9px] tracking-widest text-primary/40">
            <a href="#" className="hover:text-gallery-gold transition-colors duration-300">INSTAGRAM</a>
            <a href="#" className="hover:text-gallery-gold transition-colors duration-300">LINKEDIN</a>
            <a href="#" className="hover:text-gallery-gold transition-colors duration-300">TWITTER</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
