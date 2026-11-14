import React, { useState, useEffect } from 'react';
import { 
  getAllArtists, 
  getArtistBySlug, 
  saveArtistProfile, 
  deleteArtistProfile, 
  resetArtistsToDefault, 
  ArtistProfile,
  getArtworksForArtist,
  ExhibitionMilestone,
  StudioPhilosophyPillar
} from '../../../data/artistsData';
import { LOCAL_ARTWORKS, Artwork } from '../../../services/artworkService';

export default function ArtistsManager() {
  const [artists, setArtists] = useState<ArtistProfile[]>(() => getAllArtists());
  const [selectedArtistId, setSelectedArtistId] = useState<string>(() => {
    const list = getAllArtists();
    return list[0]?.id || 'artist-rhishikesh-joshi';
  });
  
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'visuals' | 'contact' | 'stats' | 'curation' | 'exhibitions' | 'philosophy' | 'artworks'>('profile');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const currentArtist = artists.find(a => a.id === selectedArtistId) || artists[0];
  const [formData, setFormData] = useState<ArtistProfile>(currentArtist);

  useEffect(() => {
    if (currentArtist) {
      setFormData(currentArtist);
    }
  }, [selectedArtistId, artists]);

  const handleFieldChange = (field: keyof ArtistProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const handleStatChange = (index: number, key: 'label' | 'value' | 'sublabel', val: string) => {
    setFormData(prev => {
      const updated = [...prev.stats];
      updated[index] = {
        ...updated[index],
        [key]: val
      };
      return { ...prev, stats: updated };
    });
  };

  const handlePathwayChange = (index: number, key: 'title' | 'description', val: string) => {
    setFormData(prev => {
      const updated = [...prev.engagementPathways];
      updated[index] = {
        ...updated[index],
        [key]: val
      };
      return { ...prev, engagementPathways: updated };
    });
  };

  const handleExhibitionChange = (index: number, key: keyof ExhibitionMilestone, val: string) => {
    setFormData(prev => {
      const updated = [...prev.exhibitions];
      updated[index] = {
        ...updated[index],
        [key]: val
      };
      return { ...prev, exhibitions: updated };
    });
  };

  const handleAddExhibition = () => {
    setFormData(prev => ({
      ...prev,
      exhibitions: [
        ...prev.exhibitions,
        {
          title: 'New Exhibition Milestone',
          venue: 'Gallery / Art Center',
          curatorialFocus: 'Curatorial details regarding the featured body of work.'
        }
      ]
    }));
  };

  const handleRemoveExhibition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exhibitions: prev.exhibitions.filter((_, i) => i !== index)
    }));
  };

  const handlePhilosophyChange = (index: number, key: keyof StudioPhilosophyPillar, val: any) => {
    setFormData(prev => {
      const updated = [...prev.philosophy];
      updated[index] = {
        ...updated[index],
        [key]: val
      };
      return { ...prev, philosophy: updated };
    });
  };

  const handleAddPhilosophy = (type: 'studio_practice' | 'pedagogy') => {
    setFormData(prev => ({
      ...prev,
      philosophy: [
        ...prev.philosophy,
        {
          title: type === 'studio_practice' ? 'Material Technique' : 'Masterclass Series',
          type: type,
          description: 'Description of the sculptural technique, material philosophy, or teaching method.'
        }
      ]
    }));
  };

  const handleRemovePhilosophy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      philosophy: prev.philosophy.filter((_, i) => i !== index)
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const updatedList = saveArtistProfile(formData);
      setArtists(updatedList);
      setFeedbackMessage({
        type: 'success',
        text: `Artist "${formData.name}" profile saved and synchronized across The Kala Vault!`
      });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Failed to save artist profile.'
      });
    }
  };

  const handleAddNewArtist = () => {
    const newId = `artist-${Date.now()}`;
    const newArtist: ArtistProfile = {
      id: newId,
      slug: `new-artist-${Date.now().toString().slice(-4)}`,
      name: 'New Artist Name',
      studioName: 'Artist Studio',
      studioLocation: 'City, Country',
      title: 'Contemporary Fine Art',
      tagline: 'Distinctive Art & Spatial Exploration',
      quote: 'Art transforms space through materiality and emotion.',
      bio: 'Biographical overview describing the artist background, research, and exhibitions.',
      experienceYears: '5+ Years',
      mediaList: ['Mixed Media', 'Canvas'],
      primaryMediaSummary: 'Mixed Media, Fine Pigments',
      portraitImage: '/assets/artworks/rhishikesh_joshi/rhishikesh-joshi-portrait.jpg',
      coverImage: '/assets/artworks/rhishikesh_joshi/sculpture-hero-bronze-head.jpg',
      accentArtworks: [],
      contact: {
        email: 'artist@example.com',
        phone: '+91 9000000000',
        whatsapp: '919000000000',
        instagram: '@artiststudio',
        website: 'www.thekalavault.com'
      },
      stats: [
        { label: 'Studio Practice', value: '5+ Yrs', sublabel: 'Fine Art' },
        { label: 'Core Media', value: 'Mixed Media', sublabel: 'Contemporary' },
        { label: 'Location', value: 'India', sublabel: 'Original Studio' },
        { label: 'Curated Works', value: 'Active', sublabel: 'The Kala Vault' }
      ],
      curatorialNote: 'Original artworks and limited curations available for acquisition.',
      engagementPathways: [
        { title: 'Private Acquisitions', description: 'Original fine art acquisitions for collectors.' },
        { title: 'Commissions', description: 'Site-specific fine art commissions.' }
      ],
      thematicCurations: [],
      exhibitions: [],
      philosophy: [],
      featuredMasterworkId: '',
      isFeatured: false
    };

    const updatedList = saveArtistProfile(newArtist);
    setArtists(updatedList);
    setSelectedArtistId(newId);
    setFormData(newArtist);
    setFeedbackMessage({
      type: 'success',
      text: 'New artist created! Customize the profile below.'
    });
  };

  const handleDeleteArtist = () => {
    if (!window.confirm(`Are you sure you want to delete artist "${formData.name}"?`)) return;
    const updated = deleteArtistProfile(formData.id);
    setArtists(updated);
    if (updated.length > 0) {
      setSelectedArtistId(updated[0].id);
      setFormData(updated[0]);
    }
    setFeedbackMessage({
      type: 'success',
      text: 'Artist profile deleted.'
    });
  };

  const handleResetDefaults = () => {
    if (!window.confirm('Reset all artists to default vault profiles? Any local changes will be restored to initial catalog.')) return;
    const defs = resetArtistsToDefault();
    setArtists(defs);
    setSelectedArtistId(defs[0].id);
    setFormData(defs[0]);
    setFeedbackMessage({
      type: 'success',
      text: 'Artists restored to original catalog defaults.'
    });
  };

  const mappedArtworks = getArtworksForArtist(formData.name, LOCAL_ARTWORKS);

  return (
    <div className="space-y-8 max-w-[1240px] pb-16">
      
      {/* Top Banner & Artist Switcher */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#C5A059]/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-cinzel uppercase tracking-[0.22em] text-[#C5A059] font-bold mb-1">
            <span className="material-symbols-outlined text-[16px]">draw</span>
            <span>Vault Artists &amp; Profiles Management</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1E1412] tracking-tight uppercase">
            Artist Monograph Editor
          </h2>
          <p className="font-cormorant italic text-sm text-[#1E1412]/70 mt-1">
            Update biographical data, material philosophies, exhibitions, contact details, and mapped artworks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleAddNewArtist}
            className="px-4 py-2.5 rounded-full bg-[#4A0E17] hover:bg-[#6E1825] text-[#FAF6F0] font-cinzel text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Artist</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-cinzel text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            title="Restore catalog defaults"
          >
            Reset Defaults
          </button>

          <a
            href={`/artist/${formData.slug}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-full bg-[#C5A059]/15 hover:bg-[#C5A059]/25 border border-[#C5A059]/40 text-[#4A0E17] font-cinzel text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
          >
            <span>Live Monograph</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div className={`p-4 rounded-xl text-xs font-cinzel uppercase tracking-wider font-bold flex items-center justify-between border ${
          feedbackMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
            : 'bg-rose-50 text-rose-800 border-rose-300'
        }`}>
          <span>{feedbackMessage.text}</span>
          <button onClick={() => setFeedbackMessage(null)} className="cursor-pointer text-sm">✕</button>
        </div>
      )}

      {/* Select Active Artist Pills */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="font-cinzel text-xs uppercase tracking-wider text-[#1E1412]/60 mr-2 font-bold">Select Artist:</span>
        {artists.map(a => (
          <button
            key={a.id}
            onClick={() => setSelectedArtistId(a.id)}
            className={`px-4 py-2 rounded-full text-xs font-cinzel uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedArtistId === a.id
                ? 'bg-[#4A0E17] text-[#FAF6F0] shadow-md border border-[#C5A059]/40'
                : 'bg-white hover:bg-stone-100 text-[#1E1412]/75 border border-stone-200'
            }`}
          >
            <span>{a.name}</span>
            {a.isFeatured && (
              <span className="text-[9px] bg-[#C5A059] text-[#120B0A] px-1.5 py-0.5 rounded-full font-black">
                Featured
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Editor Sub-Tabs */}
      <div className="flex border-b border-stone-200 gap-2 overflow-x-auto hide-scrollbar text-xs font-cinzel uppercase tracking-wider font-bold">
        {[
          { id: 'profile', label: 'Biography & Focus', icon: 'person' },
          { id: 'visuals', label: 'Portraits & Media', icon: 'image' },
          { id: 'contact', label: 'Contact & QR', icon: 'contact_page' },
          { id: 'stats', label: 'Studio Metrics', icon: 'analytics' },
          { id: 'curation', label: 'Collector Pathways', icon: 'handshake' },
          { id: 'exhibitions', label: `Exhibitions (${formData.exhibitions?.length || 0})`, icon: 'history_edu' },
          { id: 'philosophy', label: `Philosophy (${formData.philosophy?.length || 0})`, icon: 'psychology' },
          { id: 'artworks', label: `Mapped Works (${mappedArtworks.length})`, icon: 'palette' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`py-3 px-4.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === tab.id
                ? 'border-[#4A0E17] text-[#4A0E17] bg-white rounded-t-lg'
                : 'border-transparent text-[#1E1412]/50 hover:text-[#1E1412]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Form Content Area */}
      <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">

        {/* TAB 1: General Profile */}
        {activeSubTab === 'profile' && (
          <div className="space-y-6">
            <h3 className="font-cinzel text-lg font-bold text-[#1E1412] uppercase tracking-wide border-b border-stone-200 pb-2">
              General Artist Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">Artist Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => handleFieldChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#4A0E17]"
                  placeholder="e.g. Rhishikesh Joshi"
                />
              </div>

              <div>
                <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={e => handleFieldChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm font-mono focus:outline-none focus:border-[#4A0E17]"
                  placeholder="e.g. rhishikesh-joshi"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">Studio Name</label>
                <input
                  type="text"
                  value={formData.studioName || ''}
                  onChange={e => handleFieldChange('studioName', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#4A0E17]"
                  placeholder="e.g. Sharv Art Studio"
                />
              </div>

              <div>
                <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">Studio Location</label>
                <input
                  type="text"
                  value={formData.studioLocation || ''}
                  onChange={e => handleFieldChange('studioLocation', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#4A0E17]"
                  placeholder="e.g. Vadgaonsheri, Pune, Maharashtra, India"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">Professional Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => handleFieldChange('title', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#4A0E17]"
                  placeholder="e.g. Fine Art & Spatial Sculpture"
                />
              </div>

              <div>
                <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">Signature Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => handleFieldChange('tagline', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#4A0E17]"
                  placeholder="e.g. Spatial Tactility & Raw Elemental Forms"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">Signature Artist Quote *</label>
              <textarea
                rows={2}
                value={formData.quote}
                onChange={e => handleFieldChange('quote', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm font-cormorant italic text-lg focus:outline-none focus:border-[#4A0E17]"
                placeholder="Moving beyond two-dimensional decoration, my pieces treat walls and pedestals as immersive textural topographies."
              />
            </div>

            <div>
              <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">Full Curatorial Biography *</label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={e => handleFieldChange('bio', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm leading-relaxed focus:outline-none focus:border-[#4A0E17]"
                placeholder="Detailed artist biography..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div>
                <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">Years of Practice</label>
                <input
                  type="text"
                  value={formData.experienceYears}
                  onChange={e => handleFieldChange('experienceYears', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#4A0E17]"
                  placeholder="e.g. 10+ Years"
                />
              </div>

              <div>
                <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">Primary Media Summary</label>
                <input
                  type="text"
                  value={formData.primaryMediaSummary}
                  onChange={e => handleFieldChange('primaryMediaSummary', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#4A0E17]"
                  placeholder="e.g. Clay, Silicate, Pulp, Resin"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="isFeaturedArtist"
                  checked={formData.isFeatured || false}
                  onChange={e => handleFieldChange('isFeatured', e.target.checked)}
                  className="w-5 h-5 accent-[#4A0E17] cursor-pointer"
                />
                <label htmlFor="isFeaturedArtist" className="text-xs font-cinzel uppercase text-[#1E1412] font-bold cursor-pointer">
                  Mark as Featured Artist
                </label>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Visual Assets */}
        {activeSubTab === 'visuals' && (
          <div className="space-y-6">
            <h3 className="font-cinzel text-lg font-bold text-[#1E1412] uppercase tracking-wide border-b border-stone-200 pb-2">
              Photographs &amp; Visual Cover Assets
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Portrait Image */}
              <div className="space-y-3">
                <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block font-bold">
                  Artist Portrait Photograph URL / Path
                </label>
                <input
                  type="text"
                  value={formData.portraitImage}
                  onChange={e => handleFieldChange('portraitImage', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-xs font-mono focus:outline-none focus:border-[#4A0E17]"
                  placeholder="/assets/artworks/rhishikesh_joshi/rhishikesh-joshi-portrait.jpg"
                />
                <div className="w-48 h-60 rounded-xl overflow-hidden border-2 border-[#C5A059] bg-stone-100 shadow-md">
                  <img
                    src={formData.portraitImage}
                    alt="Artist Portrait Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src = '/assets/logo.jpeg';
                    }}
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-3">
                <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block font-bold">
                  Hero Cover Sculpture Image URL / Path
                </label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={e => handleFieldChange('coverImage', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-xs font-mono focus:outline-none focus:border-[#4A0E17]"
                  placeholder="/assets/artworks/rhishikesh_joshi/sculpture-hero-bronze-head.jpg"
                />
                <div className="w-full h-60 rounded-xl overflow-hidden border-2 border-[#C5A059] bg-stone-100 shadow-md">
                  <img
                    src={formData.coverImage}
                    alt="Cover Sculpture Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src = '/assets/logo.jpeg';
                    }}
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: Contact & QR */}
        {activeSubTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="font-cinzel text-lg font-bold text-[#1E1412] uppercase tracking-wide border-b border-stone-200 pb-2">
              Official Studio Contact Card &amp; QR Code
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">Studio Email *</label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={e => handleContactChange('email', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#4A0E17]"
                  placeholder="jr.interio@gmail.com"
                />
              </div>

              <div>
                <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">Studio Phone Number</label>
                <input
                  type="text"
                  value={formData.contact.phone}
                  onChange={e => handleContactChange('phone', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#4A0E17]"
                  placeholder="+91 9890289326"
                />
              </div>

              <div>
                <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">WhatsApp Direct Number (digits only)</label>
                <input
                  type="text"
                  value={formData.contact.whatsapp}
                  onChange={e => handleContactChange('whatsapp', e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm font-mono focus:outline-none focus:border-[#4A0E17]"
                  placeholder="919890289326"
                />
              </div>

              <div>
                <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">Instagram Handle</label>
                <input
                  type="text"
                  value={formData.contact.instagram}
                  onChange={e => handleContactChange('instagram', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#4A0E17]"
                  placeholder="@sharvartstudio"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-200">
              <div>
                <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">Instagram QR Code Image URL</label>
                <input
                  type="text"
                  value={formData.contact.instagramQr || ''}
                  onChange={e => handleContactChange('instagramQr', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-xs font-mono focus:outline-none focus:border-[#4A0E17]"
                  placeholder="/assets/artworks/rhishikesh_joshi/sharv-art-studio-instagram-qr.jpg"
                />
                {formData.contact.instagramQr && (
                  <div className="mt-3 w-32 h-32 rounded-lg border border-stone-300 p-2 bg-white">
                    <img
                      src={formData.contact.instagramQr}
                      alt="QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">Studio Website / Portfolio URL</label>
                <input
                  type="text"
                  value={formData.contact.website || ''}
                  onChange={e => handleContactChange('website', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#4A0E17]"
                  placeholder="www.thekalavault.com"
                />
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: Studio Metrics */}
        {activeSubTab === 'stats' && (
          <div className="space-y-6">
            <h3 className="font-cinzel text-lg font-bold text-[#1E1412] uppercase tracking-wide border-b border-stone-200 pb-2">
              Studio Metrics &amp; Key Numbers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {formData.stats.map((st, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
                  <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#4A0E17] font-bold block">
                    Metric Card 0{idx + 1}
                  </span>

                  <div>
                    <label className="text-[11px] font-cinzel uppercase text-stone-600 block mb-1">Value (e.g. 10+ Yrs)</label>
                    <input
                      type="text"
                      value={st.value}
                      onChange={e => handleStatChange(idx, 'value', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-stone-300 text-sm font-bold text-[#4A0E17]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-cinzel uppercase text-stone-600 block mb-1">Label (e.g. Studio Practice)</label>
                    <input
                      type="text"
                      value={st.label}
                      onChange={e => handleStatChange(idx, 'label', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-stone-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-cinzel uppercase text-stone-600 block mb-1">Sublabel (e.g. Material Research)</label>
                    <input
                      type="text"
                      value={st.sublabel || ''}
                      onChange={e => handleStatChange(idx, 'sublabel', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-stone-300 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Collector Curation */}
        {activeSubTab === 'curation' && (
          <div className="space-y-6">
            <h3 className="font-cinzel text-lg font-bold text-[#1E1412] uppercase tracking-wide border-b border-stone-200 pb-2">
              Curatorial Notes &amp; Engagement Pathways
            </h3>

            <div>
              <label className="text-xs font-cinzel uppercase text-[#1E1412]/70 block mb-1.5 font-bold">
                Curatorial Note for Collectors &amp; Galleries
              </label>
              <textarea
                rows={3}
                value={formData.curatorialNote}
                onChange={e => handleFieldChange('curatorialNote', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm italic font-cormorant text-base focus:outline-none focus:border-[#4A0E17]"
                placeholder="Every sculpture in this portfolio represents an exploration..."
              />
            </div>

            <div className="space-y-4 pt-2">
              <span className="text-xs font-cinzel uppercase tracking-wider text-[#1E1412] font-bold block">
                Engagement Pathways (Acquisitions, Commissions, Curation)
              </span>

              {formData.engagementPathways.map((ep, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-cinzel uppercase text-stone-600 block mb-1 font-bold">Pathway Title</label>
                    <input
                      type="text"
                      value={ep.title}
                      onChange={e => handlePathwayChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-stone-300 text-xs font-bold text-[#4A0E17]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-cinzel uppercase text-stone-600 block mb-1 font-bold">Scope &amp; Description</label>
                    <input
                      type="text"
                      value={ep.description}
                      onChange={e => handlePathwayChange(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-stone-300 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 6: Exhibitions */}
        {activeSubTab === 'exhibitions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-cinzel text-lg font-bold text-[#1E1412] uppercase tracking-wide">
                Exhibitions &amp; Curation History
              </h3>
              <button
                type="button"
                onClick={handleAddExhibition}
                className="px-3 py-1.5 rounded-full bg-[#4A0E17] text-[#FAF6F0] font-cinzel text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>+ Add Exhibition</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.exhibitions?.map((ex, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-stone-200 bg-stone-50 space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#C5A059] font-bold">
                      Exhibition 0{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExhibition(idx)}
                      className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-cinzel uppercase text-stone-600 block mb-1">Feature Title</label>
                      <input
                        type="text"
                        value={ex.title}
                        onChange={e => handleExhibitionChange(idx, 'title', e.target.value)}
                        className="w-full px-3 py-2 rounded border border-stone-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-cinzel uppercase text-stone-600 block mb-1">Venue &amp; Location</label>
                      <input
                        type="text"
                        value={ex.venue}
                        onChange={e => handleExhibitionChange(idx, 'venue', e.target.value)}
                        className="w-full px-3 py-2 rounded border border-stone-300 text-xs text-[#4A0E17] font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-cinzel uppercase text-stone-600 block mb-1">Curatorial Focus</label>
                    <textarea
                      rows={2}
                      value={ex.curatorialFocus}
                      onChange={e => handleExhibitionChange(idx, 'curatorialFocus', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-stone-300 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 7: Philosophy & Pedagogy */}
        {activeSubTab === 'philosophy' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-cinzel text-lg font-bold text-[#1E1412] uppercase tracking-wide">
                Studio Philosophy &amp; Pedagogy Pillars
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddPhilosophy('studio_practice')}
                  className="px-3 py-1 rounded-full bg-[#C5A059] text-[#120B0A] font-cinzel text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  + Studio Practice
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPhilosophy('pedagogy')}
                  className="px-3 py-1 rounded-full bg-[#4A0E17] text-[#FAF6F0] font-cinzel text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  + Pedagogy Workshop
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {formData.philosophy?.map((ph, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-cinzel uppercase font-bold ${
                        ph.type === 'studio_practice' 
                          ? 'bg-[#C5A059]/20 text-[#9E7D38] border border-[#C5A059]/30' 
                          : 'bg-[#4A0E17]/20 text-[#4A0E17] border border-[#4A0E17]/30'
                      }`}>
                        {ph.type === 'studio_practice' ? 'Studio Practice' : 'Pedagogy & Workshops'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePhilosophy(idx)}
                      className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-cinzel uppercase text-stone-600 block mb-1">Pillar Title</label>
                      <input
                        type="text"
                        value={ph.title}
                        onChange={e => handlePhilosophyChange(idx, 'title', e.target.value)}
                        className="w-full px-3 py-2 rounded border border-stone-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-cinzel uppercase text-stone-600 block mb-1">Type</label>
                      <select
                        value={ph.type}
                        onChange={e => handlePhilosophyChange(idx, 'type', e.target.value as any)}
                        className="w-full px-3 py-2 rounded border border-stone-300 text-xs"
                      >
                        <option value="studio_practice">Studio Practice</option>
                        <option value="pedagogy">Pedagogy / Workshop</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-cinzel uppercase text-stone-600 block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={ph.description}
                      onChange={e => handlePhilosophyChange(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-stone-300 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 8: Mapped Artworks */}
        {activeSubTab === 'artworks' && (
          <div className="space-y-6">
            <div className="border-b border-stone-200 pb-2">
              <h3 className="font-cinzel text-lg font-bold text-[#1E1412] uppercase tracking-wide">
                Artworks Mapped to {formData.name} ({mappedArtworks.length})
              </h3>
              <p className="text-xs text-stone-600 mt-1 font-sans">
                These masterworks are automatically curated and displayed on this artist's monograph page.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mappedArtworks.map(art => (
                <div key={art.id} className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-stone-300 bg-stone-200 shrink-0">
                    <img
                      src={art.localImagePath || art.images?.[0]?.fileKey}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-cinzel text-xs font-bold text-[#1E1412] truncate">
                      {art.title}
                    </h5>
                    <p className="text-[11px] font-cormorant italic text-stone-600 truncate">
                      {art.medium}
                    </p>
                    <p className="text-[10px] font-mono text-[#4A0E17] font-semibold mt-0.5">
                      ₹{art.rentalPriceCents?.toLocaleString('en-IN')}/mo • Val: ₹{art.replacementValue?.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {mappedArtworks.length === 0 && (
              <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl">
                <p className="text-sm text-stone-500 font-cinzel">No artworks currently assigned to this artist.</p>
                <p className="text-xs text-stone-400 mt-1">Use the Catalog Manager tab to assign artworks to {formData.name}.</p>
              </div>
            )}
          </div>
        )}

        {/* Action Save Bar */}
        <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleDeleteArtist}
            className="px-4 py-2 text-xs font-cinzel uppercase text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-bold cursor-pointer"
          >
            Delete Artist
          </button>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-8 py-3 bg-[#4A0E17] hover:bg-[#6E1825] text-[#FAF6F0] font-cinzel text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Save Artist Details</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}

