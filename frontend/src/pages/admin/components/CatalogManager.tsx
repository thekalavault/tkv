import React, { useState, useRef, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function CatalogManager({ currentUser }: { currentUser: any }) {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Intake Form states
  const [sku, setSku] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [artist, setArtist] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [style, setStyle] = useState('');
  const [medium, setMedium] = useState('');
  const [yearCreated, setYearCreated] = useState<number | ''>('');
  const [dimensions, setDimensions] = useState('');
  const [category, setCategory] = useState('painting');
  const [status, setStatus] = useState('available');
  const [rentalPriceCents, setRentalPriceCents] = useState<number | ''>('');
  const [replacementValue, setReplacementValue] = useState<number | ''>('');
  const [editingArtworkId, setEditingArtworkId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Duration Pricing
  const [price3Months, setPrice3Months] = useState<number | ''>('');
  const [price6Months, setPrice6Months] = useState<number | ''>('');
  const [price9Months, setPrice9Months] = useState<number | ''>('');
  const [price12Months, setPrice12Months] = useState<number | ''>('');

  // Upload state
  const [uploadingForArtworkId, setUploadingForArtworkId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      loadArtworks();
    }
  }, [currentUser]);

  const loadArtworks = async () => {
    setLoading(true);
    try {
      const token = currentUser ? await currentUser.getIdToken() : '';
      const response = await fetch(`${API_BASE_URL}/api/v1/artworks?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setArtworks(data.items || []);
      } else {
        console.warn('Failed to load artworks from backend.');
      }
    } catch (err) {
      console.error('Error fetching artworks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!sku || !title || !description || rentalPriceCents === '' || replacementValue === '') {
      setError('Please fill in all required fields (SKU, Title, Description, Rental Price, Replacement Value)');
      return;
    }

    const payload = {
      sku,
      title,
      description,
      artist: artist || undefined,
      style: style || undefined,
      medium: medium || undefined,
      yearCreated: yearCreated !== '' ? Number(yearCreated) : undefined,
      dimensions: dimensions || undefined,
      category,
      status,
      ownerEmail: ownerEmail || undefined,
      rentalPriceCents: Number(rentalPriceCents),
      replacementValue: Number(replacementValue),
      metadata: {
        pricingTiers: {
          ...(price3Months !== '' && { '3': Number(price3Months) }),
          ...(price6Months !== '' && { '6': Number(price6Months) }),
          ...(price9Months !== '' && { '9': Number(price9Months) }),
          ...(price12Months !== '' && { '12': Number(price12Months) }),
        }
      }
    };

    try {
      const token = currentUser ? await currentUser.getIdToken() : '';
      const url = editingArtworkId 
        ? `${API_BASE_URL}/api/v1/artworks/${editingArtworkId}`
        : `${API_BASE_URL}/api/v1/artworks`;
      
      const response = await fetch(url, {
        method: editingArtworkId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to save artwork');
      }

      setSuccessMessage(editingArtworkId ? 'Artwork updated successfully!' : 'Artwork created successfully!');
      resetForm();
      setIsModalOpen(false);
      loadArtworks();
      
      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving artwork.');
    }
  };

  const startEdit = (artwork: any) => {
    setEditingArtworkId(artwork.id);
    setSku(artwork.sku || '');
    setTitle(artwork.title || '');
    setDescription(artwork.description || '');
    setArtist(artwork.artist || '');
    setStyle(artwork.style || '');
    setMedium(artwork.medium || '');
    setYearCreated(artwork.yearCreated || '');
    setDimensions(artwork.dimensions || '');
    setCategory(artwork.category || 'painting');
    setStatus(artwork.status || 'available');
    setOwnerEmail(artwork.owner?.email || ''); // Assuming owner might be populated, or we can just leave it blank if not populated in list
    setRentalPriceCents(artwork.rentalPriceCents || '');
    setReplacementValue(artwork.replacementValue || '');
    
    setPrice3Months(artwork.metadata?.pricingTiers?.['3'] || '');
    setPrice6Months(artwork.metadata?.pricingTiers?.['6'] || '');
    setPrice9Months(artwork.metadata?.pricingTiers?.['9'] || '');
    setPrice12Months(artwork.metadata?.pricingTiers?.['12'] || '');
    
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingArtworkId(null);
    setSku('');
    setTitle('');
    setDescription('');
    setArtist('');
    setStyle('');
    setMedium('');
    setYearCreated('');
    setDimensions('');
    setCategory('painting');
    setStatus('available');
    setOwnerEmail('');
    setRentalPriceCents('');
    setReplacementValue('');
    setPrice3Months('');
    setPrice6Months('');
    setPrice9Months('');
    setPrice12Months('');
  };

  const handleUploadImageClick = (artworkId: string) => {
    setUploadingForArtworkId(artworkId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length || !uploadingForArtworkId) return;

    setError('');
    setSuccessMessage('');
    setLoading(true);
    
    try {
      const token = currentUser ? await currentUser.getIdToken() : '';
      
      for (const file of files) {
        // 1. Get signed upload URL from backend
        const response = await fetch(`${API_BASE_URL}/api/v1/artworks/${uploadingForArtworkId}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            variant: 'gallery',
            mimeType: file.type || 'image/jpeg',
            order: 0,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to initiate image upload on backend.');
        }

        const { uploadUrl } = await response.json();

        // 2. Upload the file to the returned URL
        const uploadHeaders: Record<string, string> = {
          'Content-Type': file.type || 'image/jpeg',
        };
        
        const isMock = uploadUrl.startsWith('/');
        if (isMock) {
          uploadHeaders['Authorization'] = `Bearer ${token}`;
        }

        const uploadResp = await fetch(isMock ? `${API_BASE_URL}${uploadUrl}` : uploadUrl, {
          method: isMock ? 'POST' : 'PUT',
          headers: uploadHeaders,
          body: file,
        });

        if (!uploadResp.ok) {
          throw new Error('Failed to upload file content.');
        }
      }

      setSuccessMessage(files.length > 1 ? `${files.length} images uploaded successfully!` : 'Image uploaded successfully!');
      loadArtworks();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to upload image.');
    } finally {
      setUploadingForArtworkId(null);
      setLoading(false);
      if (e.target) e.target.value = '';
    }
  };

  const currentEditingArtwork = artworks.find(a => a.id === editingArtworkId);

  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto w-full">
      {/* Hidden file input for uploads */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        accept="image/*"
        multiple
      />

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-label-caps uppercase tracking-wider">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-label-caps uppercase tracking-wider">
          {successMessage}
        </div>
      )}

      { /* Artwork Status Tracking */ }
      <section>
        <div className="flex justify-between items-end mb-8 border-b border-gallery-gold/20 pb-4">
          <div>
            <h3 className="font-label-caps text-[10px] text-gallery-gold tracking-[0.3em] uppercase mb-2">OPERATIONAL FLOW</h3>
            <h4 className="font-display-md text-4xl tracking-tight text-primary">Artwork Tracking</h4>
          </div>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-primary text-white py-3 px-6 font-label-caps text-[11px] tracking-widest uppercase transition-all hover:bg-gallery-gold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Artwork
          </button>
        </div>
        
        <div className="bg-subtle-smoke border border-gallery-gold/20 p-0 overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gallery-gold/20 text-left bg-white">
                <th className="p-6 font-label-caps text-[10px] tracking-widest text-primary/60 uppercase">Asset Details</th>
                <th className="p-6 font-label-caps text-[10px] tracking-widest text-primary/60 uppercase">Details & Price</th>
                <th className="p-6 font-label-caps text-[10px] tracking-widest text-primary/60 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gallery-gold/10">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-primary/50 font-label-caps text-xs">
                    Syncing database records...
                  </td>
                </tr>
              ) : artworks.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-primary/50 font-label-caps text-xs">
                    No artworks registered. Use the Intake form to add one.
                  </td>
                </tr>
              ) : (
                artworks.map((art) => {
                  const imageUrl = art.images && art.images[0] 
                    ? (art.images[0].fileKey.startsWith('http') ? art.images[0].fileKey : `${API_BASE_URL}/uploads/${art.images[0].fileKey}`)
                    : 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=200';
                  return (
                    <tr key={art.id} className="hover:bg-white transition-all group flex-row">
                      <td className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white overflow-hidden group-hover:ring-1 group-hover:ring-gallery-gold/30 transition-all border border-gallery-gold/10">
                            <img alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={imageUrl} />
                          </div>
                          <div>
                            <p className="font-display-md text-xl leading-tight mb-1 group-hover:text-gallery-gold transition-colors tracking-tight">{art.title}</p>
                            <p className="font-label-caps text-[10px] tracking-widest text-primary/50 uppercase">{art.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 align-middle">
                        <p className="font-body-md text-base text-primary">{art.artist || 'Unknown Artist'}</p>
                        <p className="font-label-caps text-[10px] tracking-widest text-gallery-gold uppercase mt-1">
                          ₹{(art.rentalPriceCents).toLocaleString('en-IN')}/mo
                        </p>
                      </td>
                      <td className="p-6 text-right align-middle">
                        <div className="flex gap-3 justify-end">
                          <button 
                            onClick={() => handleUploadImageClick(art.id)}
                            className="px-3 py-1.5 text-[10px] bg-subtle-smoke border border-gallery-gold/30 text-primary font-label-caps tracking-widest uppercase hover:bg-gallery-gold hover:text-white transition-colors cursor-pointer"
                          >
                            Upload Pics
                          </button>
                          <button 
                            onClick={() => startEdit(art)}
                            className="px-3 py-1.5 text-[10px] bg-primary text-white font-label-caps tracking-widest uppercase hover:bg-gallery-gold transition-all cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      { /* Catalog Intake Form Modal */ }
      {isModalOpen && (
        <div className="fixed inset-0 z-50 p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white p-10 border border-gallery-gold/20 shadow-xl relative w-full max-w-4xl my-10 mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gallery-gold/5 to-transparent pointer-events-none rounded-bl-full" />
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-primary hover:text-gallery-gold cursor-pointer z-20"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <h4 className="font-display-md text-3xl tracking-tight text-primary">
              {editingArtworkId ? `Edit Artwork Info` : `Artwork Catalog Intake`}
            </h4>
            <p className="font-body-md text-primary/60 mt-2">
              {editingArtworkId ? `Modify properties for asset ID ${sku}` : `Register new assets into the primary vault database.`}
            </p>
          </div>
          <span className="material-symbols-outlined text-gallery-gold text-3xl font-light">inventory_2</span>
        </div>
        
        <form className="space-y-8 relative z-10" onSubmit={handleSaveArtwork}>
          
          {editingArtworkId && currentEditingArtwork?.images?.length > 0 && (
            <div className="mb-8">
              <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-4 block uppercase">CURRENT IMAGES GALLERY</label>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {currentEditingArtwork.images.map((img: any) => {
                  const url = img.fileKey.startsWith('http') ? img.fileKey : `${API_BASE_URL}/uploads/${img.fileKey}`;
                  return (
                    <div key={img.id} className="w-24 h-24 shrink-0 relative group">
                      <img src={url} alt="artwork" className="w-full h-full object-cover border border-gallery-gold/20" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-8">
            <div className="col-span-2 md:col-span-1 border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
              <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">BARCODE / SKU *</label>
              <input 
                className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-lg placeholder:text-primary/30" 
                placeholder="Scan or Enter SKU" 
                type="text" 
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1 border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
              <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">ARTWORK NAME *</label>
              <input 
                className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-lg placeholder:text-primary/30" 
                placeholder="Artwork Title" 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1 border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
              <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">ARTIST</label>
              <input 
                className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-lg placeholder:text-primary/30" 
                placeholder="Artist Name" 
                type="text" 
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
              />
            </div>
            <div className="col-span-2 md:col-span-1 border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
              <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">CATEGORY</label>
              <select 
                className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-lg text-primary outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="painting">Painting</option>
                <option value="sculpture">Sculpture</option>
                <option value="photography">Photography</option>
                <option value="mixed_media">Mixed Media</option>
                <option value="installation">Installation</option>
              </select>
            </div>
            <div className="col-span-2 md:col-span-1 border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
              <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">PRICING: BASE MONTHLY RENTAL (₹) *</label>
              <input 
                className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-lg placeholder:text-primary/30" 
                placeholder="e.g. 15000" 
                type="number" 
                value={rentalPriceCents}
                onChange={(e) => setRentalPriceCents(e.target.value !== '' ? Number(e.target.value) : '')}
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1 border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
              <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">PRICING: REPLACEMENT VALUE (₹) *</label>
              <input 
                className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-lg placeholder:text-primary/30" 
                placeholder="e.g. 1000000" 
                type="number" 
                value={replacementValue}
                onChange={(e) => setReplacementValue(e.target.value !== '' ? Number(e.target.value) : '')}
                required
              />
            </div>

            {/* Duration Pricing Tiers */}
            <div className="col-span-2 grid grid-cols-4 gap-4 p-4 bg-subtle-smoke/50 border border-gallery-gold/10">
              <div className="col-span-4 mb-2">
                <label className="font-label-caps text-[10px] tracking-widest text-primary uppercase">Duration-Based Pricing (₹) - Optional</label>
                <p className="text-xs text-primary/50 mt-1">Specify exact monthly prices for these durations. If left blank, defaults to base pricing.</p>
              </div>
              
              <div className="border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
                <label className="font-label-caps text-[8px] tracking-widest text-primary/60 mb-2 block uppercase">3 Months</label>
                <input 
                  className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-base placeholder:text-primary/30" 
                  placeholder="Price in ₹" type="number" 
                  value={price3Months} onChange={(e) => setPrice3Months(e.target.value !== '' ? Number(e.target.value) : '')}
                />
              </div>
              <div className="border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
                <label className="font-label-caps text-[8px] tracking-widest text-primary/60 mb-2 block uppercase">6 Months</label>
                <input 
                  className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-base placeholder:text-primary/30" 
                  placeholder="Price in ₹" type="number" 
                  value={price6Months} onChange={(e) => setPrice6Months(e.target.value !== '' ? Number(e.target.value) : '')}
                />
              </div>
              <div className="border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
                <label className="font-label-caps text-[8px] tracking-widest text-primary/60 mb-2 block uppercase">9 Months</label>
                <input 
                  className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-base placeholder:text-primary/30" 
                  placeholder="Price in ₹" type="number" 
                  value={price9Months} onChange={(e) => setPrice9Months(e.target.value !== '' ? Number(e.target.value) : '')}
                />
              </div>
              <div className="border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
                <label className="font-label-caps text-[8px] tracking-widest text-primary/60 mb-2 block uppercase">12 Months</label>
                <input 
                  className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-base placeholder:text-primary/30" 
                  placeholder="Price in ₹" type="number" 
                  value={price12Months} onChange={(e) => setPrice12Months(e.target.value !== '' ? Number(e.target.value) : '')}
                />
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
              <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">STYLE</label>
              <input 
                className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-lg placeholder:text-primary/30" 
                placeholder="e.g. Contemporary, Abstract" 
                type="text" 
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />
            </div>
            <div className="col-span-2 md:col-span-1 border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
              <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">MEDIUM</label>
              <input 
                className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-lg placeholder:text-primary/30" 
                placeholder="e.g. Oil on Canvas" 
                type="text" 
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
              />
            </div>
            <div className="col-span-2 md:col-span-1 border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
              <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">YEAR CREATED</label>
              <input 
                className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-lg placeholder:text-primary/30" 
                placeholder="e.g. 2024" 
                type="number" 
                value={yearCreated}
                onChange={(e) => setYearCreated(e.target.value !== '' ? Number(e.target.value) : '')}
              />
            </div>
            <div className="col-span-2 md:col-span-1 border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
              <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">DIMENSIONS & SIZE</label>
              <input 
                className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-lg placeholder:text-primary/30" 
                placeholder="e.g. 120 x 150 cm" 
                type="text" 
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
              />
            </div>
            <div className="col-span-2 md:col-span-1 border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
              <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">STATUS</label>
              <select 
                className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-lg text-primary outline-none"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="col-span-2 md:col-span-1 border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
              <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">ASSIGN TO CUSTOMER (EMAIL)</label>
              <input 
                className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-lg placeholder:text-primary/30" 
                placeholder="customer@email.com" 
                type="email" 
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
              />
            </div>
            <div className="col-span-2 border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
              <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">DESCRIPTION *</label>
              <textarea 
                className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-lg placeholder:text-primary/30 resize-none mt-1" 
                placeholder="Document style, narrative, or condition notes..." 
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-6 pt-6">
            {editingArtworkId && (
              <button 
                className="px-8 py-3 font-label-caps text-[10px] tracking-widest text-primary hover:text-gallery-gold transition-colors uppercase cursor-pointer" 
                type="button"
                onClick={resetForm}
              >
                CANCEL EDIT
              </button>
            )}
            <button 
              className="px-10 py-3 font-label-caps text-[10px] tracking-widest uppercase bg-primary text-white hover:bg-gallery-gold relative transition-colors cursor-pointer shadow-sm" 
              type="submit"
            >
              {editingArtworkId ? 'UPDATE ARTWORK' : 'SAVE TO VAULT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>
  );
}
