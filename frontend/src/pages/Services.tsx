import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function Services() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      number: "01",
      title: "Direct Buying",
      description: "Build a permanent legacy with exclusive pieces that tell your unique story beautifully. Select and acquire masterpieces to establish an enduring corporate or private art collection.",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200"
    },
    {
      number: "02",
      title: "Smart Subscriptions",
      description: "Keep your walls fresh and exciting with flexible art rental and seasonal refresh plans. Maintain a living gallery that responds to your environment, with rotating curation schedules.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
    },
    {
      number: "03",
      title: "Expert Curation",
      description: "Our specialized consultants find the perfect match for your interior style and brand identity. We analyze layouts, lighting, architectural details, and corporate goals to build custom proposals.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
    }
  ];

  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start end", "end start"] });
  const yImage = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <div className="bg-paper-white text-primary font-body-lg overflow-x-hidden min-h-screen selection:bg-gallery-gold/30 flex flex-col">
      <TopNavBar />

      <main className="pt-[160px] md:pt-[240px] pb-32 flex-grow" ref={scrollRef}>
        <section className="px-8 md:px-16 max-w-[1600px] mx-auto mb-32 flex flex-col items-center text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl relative z-10"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-gallery-gold/40"></div>
              <span className="font-label-caps text-[10px] uppercase tracking-[0.4em] text-gallery-gold">Support Protocol</span>
              <div className="h-[1px] w-12 bg-gallery-gold/40"></div>
            </div>
            <h1 className="font-display-lg text-6xl md:text-8xl lg:text-[7rem] text-primary tracking-tighter mb-8 leading-[0.9]">
              Elevated<br /><span className="text-gallery-gold italic font-headline-md tracking-normal">Care</span>
            </h1>
            <p className="font-headline-md italic text-on-surface-variant text-2xl md:text-3xl max-w-2xl mx-auto font-light">
              Comprehensive logistics, managed with the highest degree of discretion and architectural precision.
            </p>
          </motion.div>
        </section>

        <section className="px-8 md:px-16 w-full max-w-[1400px] mx-auto py-12 md:py-24 relative overflow-hidden">
          <div className="flex flex-col mb-16 md:mb-24 text-center items-center">
            <span className="font-label-caps text-[10px] uppercase tracking-[0.4em] text-gallery-gold mb-6 block">Our Protocol</span>
            <h2 className="font-display-lg text-5xl md:text-7xl text-primary tracking-tight">The Framework</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 lg:gap-y-24 w-full">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`flex flex-col group ${index % 3 === 1 ? 'lg:mt-16' : ''} ${index % 3 === 2 ? 'lg:mt-32' : ''}`}
              >
                <div className="relative overflow-hidden mb-8 w-full aspect-[4/5] bg-subtle-smoke">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  <div className="absolute inset-4 border border-paper-white/30 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"></div>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display-lg text-primary text-3xl md:text-4xl tracking-tight group-hover:text-gallery-gold transition-colors duration-500">
                    {service.title}
                  </h3>
                  <span className="font-display-lg text-3xl md:text-4xl text-gallery-gold/30 group-hover:text-gallery-gold transition-colors duration-500 tracking-tighter leading-none">
                    {service.number}
                  </span>
                </div>

                <div className="flex flex-col mt-auto w-11/12">
                  <div className="h-[1px] w-12 bg-gallery-gold/40 mb-6 group-hover:w-full group-hover:bg-gallery-gold transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"></div>
                  <p className="font-body-md text-on-surface-variant leading-relaxed font-light text-base md:text-sm lg:text-base">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-8 md:px-16 max-w-[1400px] mx-auto mt-24 relative border-t border-gallery-gold/20 pt-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24"
          >
            <div>
              <span className="font-label-caps text-[10px] uppercase tracking-[0.4em] text-gallery-gold mb-6 block">Legal</span>
              <h2 className="font-display-lg text-4xl md:text-5xl text-primary tracking-tight mb-8">
                Commitment to <br /> <span className="italic text-gallery-gold font-headline-md tracking-normal">Transparency</span>
              </h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed font-light text-base max-w-md">
                We uphold the highest standards of confidentiality, security, and ethical practice. Read our comprehensive policies detailing our operational framework and your rights as a client.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-10 md:pl-16 md:border-l border-gallery-gold/20">
              <Link to="/terms" className="group flex items-center justify-between cursor-pointer">
                <div>
                  <h3 className="font-display-md text-2xl text-primary mb-2 group-hover:text-gallery-gold transition-colors">Terms & Conditions</h3>
                  <p className="font-body-md text-on-surface-variant font-light text-sm">Review our leasing, acquisition, and curation agreements.</p>
                </div>
                <span className="material-symbols-outlined text-gallery-gold group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </Link>
              <div className="h-[1px] w-full bg-gallery-gold/10"></div>
              <Link to="/privacy" className="group flex items-center justify-between cursor-pointer">
                <div>
                  <h3 className="font-display-md text-2xl text-primary mb-2 group-hover:text-gallery-gold transition-colors">Privacy Policy</h3>
                  <p className="font-body-md text-on-surface-variant font-light text-sm">Understand how we manage and protect your personal information.</p>
                </div>
                <span className="material-symbols-outlined text-gallery-gold group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="px-8 md:px-16 max-w-[1600px] mx-auto mt-32 mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-full bg-primary py-24 md:py-32 px-10 md:px-20 text-center flex flex-col items-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gallery-gold/5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gallery-gold/20 to-transparent pointer-events-none blur-3xl opacity-50" />

            <span className="font-label-caps text-[10px] uppercase tracking-[0.4em] text-gallery-gold mb-8 block relative z-10">Next Steps</span>
            <h2 className="font-display-lg text-4xl md:text-6xl text-white tracking-tight mb-12 relative z-10 max-w-3xl">
              Ready to refine the way you experience space?
            </h2>
            <Link to="/inquire" className="relative z-10 flex items-center justify-center gap-4 bg-gallery-gold border border-gallery-gold py-6 px-12 font-label-caps text-[12px] uppercase tracking-[0.2em] transition-all hover:bg-white hover:border-white text-primary w-full md:w-auto group/btn focus:outline-none">
              <span>Initiate Consultation</span>
              <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </motion.div>
        </section>
      </main>

      { /* Footer */}
      <Footer />
    </div>
  );
}
