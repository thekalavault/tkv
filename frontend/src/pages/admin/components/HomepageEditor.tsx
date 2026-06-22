import React from 'react';

export default function HomepageEditor() {
  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-8 border-b border-gallery-gold/20 pb-4">
        <div>
          <h3 className="font-label-caps text-[10px] text-gallery-gold tracking-[0.3em] uppercase mb-2">CONTENT MANAGEMENT</h3>
          <h4 className="font-display-md text-4xl tracking-tight text-primary">Homepage Editor</h4>
        </div>
        <button className="bg-primary text-white py-3 px-6 font-label-caps text-[11px] tracking-widest uppercase transition-all hover:bg-gallery-gold flex items-center justify-center gap-2 cursor-pointer shadow-sm">
          <span className="material-symbols-outlined text-[16px]">save</span>
          Publish Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Hero Section Manager */}
        <div className="bg-white p-8 border border-gallery-gold/20 shadow-sm flex flex-col gap-6">
          <h5 className="font-label-caps text-[11px] tracking-widest uppercase text-primary border-b border-gallery-gold/10 pb-2">Hero Section</h5>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">Hero Heading</label>
              <input 
                type="text" 
                className="w-full bg-transparent border-b border-primary/20 focus:border-gallery-gold py-2 font-body-md text-primary outline-none transition-colors"
                defaultValue="Curating masterpieces for the discerning collector."
              />
            </div>
            <div>
              <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">Hero Subtext</label>
              <textarea 
                className="w-full bg-transparent border-b border-primary/20 focus:border-gallery-gold py-2 font-body-md text-primary outline-none transition-colors resize-none"
                defaultValue="Explore our exclusive vault of contemporary and classic artworks available for acquisition or lease."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Carousel Manager */}
        <div className="bg-white p-8 border border-gallery-gold/20 shadow-sm flex flex-col gap-6">
          <h5 className="font-label-caps text-[11px] tracking-widest uppercase text-primary border-b border-gallery-gold/10 pb-2">Featured Carousel Images</h5>
          
          <div className="flex flex-col gap-4">
            {/* Mock Image 1 */}
            <div className="flex items-center justify-between p-4 bg-subtle-smoke border border-gallery-gold/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white border border-gallery-gold/20 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=200" alt="mock" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-label-caps text-[10px] tracking-widest uppercase text-primary">Slide 1</p>
                  <p className="font-body-md text-xs text-primary/60">hero-banner-1.jpg</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-primary/50 hover:text-primary"><span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span></button>
                <button className="text-primary/50 hover:text-primary"><span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span></button>
                <button className="text-red-500/50 hover:text-red-500 ml-2"><span className="material-symbols-outlined text-[18px]">delete</span></button>
              </div>
            </div>

            {/* Mock Image 2 */}
            <div className="flex items-center justify-between p-4 bg-subtle-smoke border border-gallery-gold/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white border border-gallery-gold/20 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1577720580479-7d839d829c73?auto=format&fit=crop&q=80&w=200" alt="mock" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-label-caps text-[10px] tracking-widest uppercase text-primary">Slide 2</p>
                  <p className="font-body-md text-xs text-primary/60">abstract-collection.jpg</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-primary/50 hover:text-primary"><span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span></button>
                <button className="text-primary/50 hover:text-primary"><span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span></button>
                <button className="text-red-500/50 hover:text-red-500 ml-2"><span className="material-symbols-outlined text-[18px]">delete</span></button>
              </div>
            </div>

            <button className="w-full py-4 border border-dashed border-gallery-gold/40 text-gallery-gold hover:bg-gallery-gold/5 font-label-caps text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
              Add New Slide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
