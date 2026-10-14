import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchArtworks, getArtworkImagePath, sanitizeArtworkImageUrl, invalidateArtworkCache, Artwork } from '../../../services/artworkService';
import RobustArtworkImage from '../../../components/RobustArtworkImage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function CatalogManager({ currentUser }: { currentUser: any }) {
  const queryClient = useQueryClient();
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
  const [previewArtwork, setPreviewArtwork] = useState<Artwork | null>(null);
  const [activePreviewImageIndex, setActivePreviewImageIndex] = useState(0);

  // Close preview modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (previewArtwork) setPreviewArtwork(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewArtwork]);

  // Reset active image when selected preview artwork changes
  useEffect(() => {
    setActivePreviewImageIndex(0);
  }, [previewArtwork]);

  // Duration Pricing
  const [price3Months, setPrice3Months] = useState<number | ''>('');
  const [price6Months, setPrice6Months] = useState<number | ''>('');
  const [price9Months, setPrice9Months] = useState<number | ''>('');
  const [price12Months, setPrice12Months] = useState<number | ''>('');

  // Upload state
  const [uploadingForArtworkId, setUploadingForArtworkId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { data, isLoading: artworksLoading } = useQuery({
    queryKey: ['admin-artworks'],
    queryFn: () => fetchArtworks(1, 500),
    enabled: !!currentUser
  });

  const artworks = data?.items || [];

  const handleSaveArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!sku || !title || !description || rentalPriceCents === '' || replacementValue === '') {
      setError('Please fill in all required fields (SKU, Title, Description, Rental Price, Replacement Value)');
      return;
    }

    const currentArt = artworks.find(a => a.id === editingArtworkId);
    const hasExistingImages = editingArtworkId && currentArt?.images?.length > 0;

    if (!hasExistingImages && selectedFiles.length === 0) {
      setError('Please upload at least one image for the artwork.');
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

      const savedData = await response.json();
      const artworkId = editingArtworkId || savedData.id;

      if (selectedFiles.length > 0 && artworkId) {
        for (const file of selectedFiles) {
          const imgResponse = await fetch(`${API_BASE_URL}/api/v1/artworks/${artworkId}/images`, {
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

          if (imgResponse.ok) {
            const { uploadUrl } = await imgResponse.json();
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
              console.error('Failed to upload file content to R2/Mock');
            }
          }
        }
      }

      setSuccessMessage(editingArtworkId ? 'Artwork updated successfully!' : 'Artwork created successfully!');
      resetForm();
      setIsModalOpen(false);
      
      // Invalidate frontend cache and TanStack queries so entire website updates immediately
      invalidateArtworkCache();
      queryClient.invalidateQueries({ queryKey: ['admin-artworks'] });
      
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

  const generateNextSku = (currentArtworks: any[]) => {
    const totalCount = Array.isArray(currentArtworks) ? currentArtworks.length : 0;
    let maxNumber = totalCount;

    if (Array.isArray(currentArtworks)) {
      currentArtworks.forEach(art => {
        if (art.sku && typeof art.sku === 'string') {
          const match = art.sku.match(/(\d+)/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNumber && num < 100000) {
              maxNumber = num;
            }
          }
        }
      });
    }

    const nextNumber = Math.max(totalCount + 1, maxNumber + 1);
    return `TKV-${String(nextNumber).padStart(4, '0')}`;
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
    setPrice12Months('');
    setSelectedFiles([]);
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
      
      queryClient.invalidateQueries({ queryKey: ['admin-artworks'] });
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

  const handleDeleteArtwork = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) return;
    
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const token = currentUser ? await currentUser.getIdToken() : '';
      const response = await fetch(`${API_BASE_URL}/api/v1/artworks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to delete artwork');
      }

      setSuccessMessage('Artwork deleted successfully!');
      if (editingArtworkId === id) {
        resetForm();
        setIsModalOpen(false);
      }
      
      invalidateArtworkCache(id);
      queryClient.invalidateQueries({ queryKey: ['admin-artworks'] });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error occurred while deleting artwork.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (artworkId: string, imageId: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    setError('');
    setSuccessMessage('');
    try {
      const token = currentUser ? await currentUser.getIdToken() : '';
      const response = await fetch(`${API_BASE_URL}/api/v1/artworks/${artworkId}/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to delete image');
      }

      setSuccessMessage('Image deleted successfully!');
      
      invalidateArtworkCache(artworkId);
      queryClient.invalidateQueries({ queryKey: ['admin-artworks'] });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error occurred while deleting image.');
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
      {!isModalOpen && (
      <section>
        <div className="flex justify-between items-end mb-8 border-b border-gallery-gold/20 pb-4">
          <div>
            <h4 className="font-display-md text-3xl sm:text-4xl tracking-tight text-primary flex flex-wrap items-baseline gap-3">
              Artwork Tracking
              <span className="text-sm sm:text-base font-cinzel text-gallery-gold font-bold px-2.5 py-0.5 bg-gallery-gold/10 border border-gallery-gold/30 rounded-xs">
                {artworks.length} Masterworks in Inventory
              </span>
            </h4>
          </div>
          <button 
            onClick={() => { 
              resetForm(); 
              setSku(generateNextSku(artworks)); 
              setIsModalOpen(true); 
            }}
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
              {artworksLoading ? (
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
                  const resolvedImgPath = getArtworkImagePath(art);
                  const imageFallbacks = art.images?.map((img: any) => img.fileKey).filter(Boolean) || [];
                  return (
                    <tr key={art.id} className="hover:bg-white transition-all group flex-row">
                      <td className="p-6">
                        <div className="flex items-center gap-6">
                          {/* Mini Image Thumbnail with click-to-preview */}
                          <div 
                            onClick={() => setPreviewArtwork(art)}
                            className="w-16 h-16 bg-white overflow-hidden group-hover:ring-2 group-hover:ring-gallery-gold/50 transition-all border border-gallery-gold/20 shrink-0 cursor-pointer shadow-xs relative group/thumb rounded-xs"
                            title="Click to preview artwork"
                          >
                            <RobustArtworkImage 
                              src={resolvedImgPath} 
                              fallbackUrls={imageFallbacks}
                              seed={art.id || art.title}
                              alt={art.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110" 
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity text-white">
                              <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </div>
                          </div>
                          
                          {/* Title & SKU with click-to-preview */}
                          <div className="cursor-pointer" onClick={() => setPreviewArtwork(art)}>
                            <p className="font-display-md text-xl leading-tight mb-1 group-hover:text-gallery-gold transition-colors tracking-tight flex items-center gap-2">
                              {art.title}
                              <span className="material-symbols-outlined text-[15px] text-gallery-gold/70 opacity-0 group-hover:opacity-100 transition-opacity">
                                visibility
                              </span>
                            </p>
                            <p className="font-label-caps text-[10px] tracking-widest text-primary/50 uppercase">{art.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 align-middle">
                        <p className="font-body-md text-base text-primary">{art.artist || 'Unknown Artist'}</p>
                        <p className="font-label-caps text-[10px] tracking-widest text-gallery-gold uppercase mt-1">
                          ₹{(art.rentalPriceCents || 0).toLocaleString('en-IN')}/mo
                        </p>
                      </td>
                      <td className="p-6 text-right align-middle">
                        <div className="flex gap-2.5 justify-end">
                          <button 
                            onClick={() => setPreviewArtwork(art)}
                            className="px-3 py-1.5 text-[10px] bg-white border border-gallery-gold/60 text-gallery-gold font-label-caps tracking-widest uppercase hover:bg-gallery-gold hover:text-white transition-all cursor-pointer shadow-xs flex items-center gap-1"
                            title="Preview artwork details"
                          >
                            <span className="material-symbols-outlined text-[13px]">visibility</span>
                            Preview
                          </button>
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
                          <button 
                            onClick={() => handleDeleteArtwork(art.id)}
                            className="px-3 py-1.5 text-[10px] bg-red-500/10 text-red-500 border border-red-500/30 font-label-caps tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                          >
                            Delete
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
      )}

      { /* Catalog Intake Form View */ }
      {isModalOpen && (
        <div className="w-full flex justify-center pb-24">
          <div className="bg-white border border-gallery-gold/20 shadow-[0_20px_50px_rgba(212,175,55,0.05)] relative w-full max-w-4xl flex flex-col mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gallery-gold/5 to-transparent pointer-events-none rounded-bl-full" />
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-primary hover:text-gallery-gold cursor-pointer z-20"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="p-8 pb-4 shrink-0 border-b border-gallery-gold/10 relative z-10">
              <div className="flex justify-between items-start">
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
            </div>
        
            <div className="p-8 flex-1 relative z-10">
              <form id="artwork-form" className="space-y-8" onSubmit={handleSaveArtwork}>
                {editingArtworkId && currentEditingArtwork?.images?.length > 0 && (
                  <div className="mb-8">
                    <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-4 block uppercase">CURRENT IMAGES GALLERY</label>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                      {currentEditingArtwork.images.map((img: any) => {
                        const url = sanitizeArtworkImageUrl(img.fileKey, img.id);
                        return (
                          <div key={img.id} className="w-24 h-24 shrink-0 relative group">
                            <RobustArtworkImage src={url} alt="artwork" className="w-full h-full object-cover border border-gallery-gold/20" />
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(editingArtworkId, img.id)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md z-10"
                            >
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-8">
                  <div className="col-span-2 border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
                    <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">UPLOAD IMAGES *</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          setSelectedFiles(Array.from(e.target.files));
                        }
                      }}
                      className="w-full bg-transparent focus:outline-none focus:ring-0 font-body-md text-base text-primary/80" 
                    />
                    {selectedFiles.length > 0 && (
                      <p className="text-xs text-primary/60 mt-2">{selectedFiles.length} file(s) selected</p>
                    )}
                  </div>

                  <div className="col-span-2 md:col-span-1 border-b border-primary/20 hover:border-gallery-gold focus-within:border-gallery-gold transition-colors pb-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-label-caps text-[9px] tracking-widest text-primary/60 block uppercase">
                        BARCODE / INVENTORY SKU *
                      </label>
                      <button
                        type="button"
                        onClick={() => setSku(generateNextSku(artworks))}
                        className="text-[9.5px] font-cinzel text-gallery-gold hover:text-primary tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-colors font-bold"
                        title="Generate next sequential barcode SKU based on total inventory"
                      >
                        <span className="material-symbols-outlined text-[13px]">autorenew</span>
                        Auto-Assign Sku
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        className="w-full bg-transparent focus:outline-none focus:ring-0 font-mono text-lg font-semibold placeholder:text-primary/30 text-primary" 
                        placeholder="e.g. TKV-0104" 
                        type="text" 
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        required
                      />
                      <span className="font-mono text-[10px] px-2 py-0.5 bg-gallery-gold/10 text-gallery-gold border border-gallery-gold/30 shrink-0 uppercase tracking-widest font-bold">
                        BARCODE
                      </span>
                    </div>
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
              </form>
            </div>

            <div className="p-6 shrink-0 border-t border-gallery-gold/10 bg-subtle-smoke/30 flex justify-end gap-6">
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
                form="artwork-form"
                className="px-10 py-3 font-label-caps text-[10px] tracking-widest uppercase bg-primary text-white hover:bg-gallery-gold relative transition-colors cursor-pointer shadow-sm" 
                type="submit"
              >
                {editingArtworkId ? 'UPDATE ARTWORK' : 'SAVE TO VAULT'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ─────────────────────────────────────────────────────────────────────────────
          INTERACTIVE ARTWORK INSPECTION & PREVIEW MODAL
          ───────────────────────────────────────────────────────────────────────────── */}
      {previewArtwork && (() => {
        const images = previewArtwork.images && previewArtwork.images.length > 0
          ? previewArtwork.images.map((img: any) => ({
              url: sanitizeArtworkImageUrl(img.fileKey, previewArtwork.id),
              label: img.label || (img.variant === 'insitu' ? 'In-Situ Room View' : 'Gallery Perspective')
            }))
          : [{
              url: getArtworkImagePath(previewArtwork),
              label: 'Frontal Exhibition View'
            }];

        const currentDisplayImage = images[activePreviewImageIndex]?.url || images[0].url;

        return (
          <div 
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-200 overflow-y-auto"
            onClick={() => setPreviewArtwork(null)}
          >
            <div 
              className="bg-[#FAF6F0] text-[#1E1412] border border-[#C5A059]/40 shadow-2xl relative w-full max-w-5xl flex flex-col my-auto max-h-[92vh] overflow-hidden rounded-xs"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#C5A059]/25 flex items-center justify-between bg-[#FAF6F0] shrink-0">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-[#4A0E17] font-bold px-2 py-0.5 bg-[#4A0E17]/10 border border-[#4A0E17]/20 uppercase">
                    {previewArtwork.sku || 'TKV-ASSET'}
                  </span>
                  <span className="font-cinzel text-[11px] tracking-[0.25em] text-[#C5A059] uppercase font-bold hidden sm:inline">
                    CURATORIAL INSPECTION DOSSIER
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-cinzel uppercase tracking-widest px-2.5 py-1 font-bold ${
                    previewArtwork.status === 'rented' 
                      ? 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
                      : previewArtwork.status === 'reserved'
                      ? 'bg-blue-500/15 text-blue-800 border border-blue-500/30'
                      : 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/30'
                  }`}>
                    {previewArtwork.status || 'AVAILABLE'}
                  </span>
                  <button 
                    onClick={() => setPreviewArtwork(null)}
                    className="text-[#1E1412]/60 hover:text-[#4A0E17] transition-colors cursor-pointer p-1 flex items-center gap-1 font-sans text-xs"
                    title="Close (Esc)"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                    <span className="hidden sm:inline text-[10px] font-mono opacity-60">ESC</span>
                  </button>
                </div>
              </div>

              {/* Modal Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
                {/* Left Column: Visual Showcase */}
                <div className="lg:col-span-7 bg-[#1A0E12] p-6 sm:p-8 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-[#C5A059]/20 relative">
                  <div className="absolute inset-0 bg-radial-gradient from-[#4A0E17]/20 to-transparent pointer-events-none" />
                  
                  {/* Main Stage Image */}
                  <div className="w-full flex-1 flex items-center justify-center min-h-[300px] sm:min-h-[380px] p-2 relative z-10">
                    <div className="relative shadow-2xl p-2 bg-[#25151A] border border-[#C5A059]/40 max-w-full">
                      <RobustArtworkImage 
                        src={currentDisplayImage}
                        fallbackUrls={images.map(i => i.url)}
                        seed={previewArtwork.id}
                        alt={previewArtwork.title}
                        className="max-h-[360px] sm:max-h-[420px] w-auto h-auto object-contain mx-auto transition-transform duration-300 select-none"
                      />
                    </div>
                  </div>

                  {/* Thumbnail Ribbon if multiple images exist */}
                  {images.length > 1 && (
                    <div className="w-full pt-4 mt-2 border-t border-[#C5A059]/20 flex items-center justify-center gap-3 overflow-x-auto relative z-10">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePreviewImageIndex(idx)}
                          className={`w-14 h-14 shrink-0 overflow-hidden border transition-all cursor-pointer relative ${
                            activePreviewImageIndex === idx 
                              ? 'border-[#DFC07D] ring-2 ring-[#DFC07D]/40 scale-105' 
                              : 'border-[#C5A059]/30 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <RobustArtworkImage 
                            src={img.url}
                            seed={`${previewArtwork.id}-${idx}`}
                            alt={img.label}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="w-full pt-3 flex items-center justify-between text-[10px] font-mono text-[#FAF6F0]/60 relative z-10">
                    <span className="flex items-center gap-1.5 text-[#DFC07D]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                      VERIFIED HIGH-RES ASSET
                    </span>
                    <span>
                      VIEW {activePreviewImageIndex + 1} OF {images.length}
                    </span>
                  </div>
                </div>

                {/* Right Column: Specifications & Curatorial Details */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
                  <div className="space-y-5">
                    <div>
                      <span className="font-cinzel text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold block mb-1">
                        {previewArtwork.category || 'PAINTING'}
                      </span>
                      <h3 className="font-display-md text-2xl sm:text-3xl text-primary font-bold tracking-tight leading-tight">
                        {previewArtwork.title}
                      </h3>
                      <p className="font-body-md text-base text-gallery-gold font-medium mt-1">
                        {previewArtwork.artist || 'Authenticated Master Artist'}
                      </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-2 gap-3 p-4 bg-white border border-[#C5A059]/30 rounded-xs shadow-xs">
                      <div>
                        <span className="font-cinzel text-[9px] tracking-widest text-primary/60 uppercase block">MONTHLY LEASE</span>
                        <p className="font-mono text-xl text-primary font-bold mt-0.5">
                          ₹{(previewArtwork.rentalPriceCents || 0).toLocaleString('en-IN')}
                          <span className="text-xs font-sans font-normal text-primary/60">/mo</span>
                        </p>
                      </div>
                      <div className="border-l border-[#C5A059]/20 pl-3">
                        <span className="font-cinzel text-[9px] tracking-widest text-primary/60 uppercase block">REPLACEMENT VALUE</span>
                        <p className="font-mono text-xl text-gallery-gold font-bold mt-0.5">
                          ₹{(previewArtwork.replacementValue || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Specifications Matrix */}
                    <div className="space-y-2 border-t border-[#C5A059]/20 pt-4 text-xs">
                      <div className="flex justify-between py-1 border-b border-primary/5">
                        <span className="font-cinzel text-[10px] tracking-widest text-primary/60 uppercase font-semibold">Medium</span>
                        <span className="font-sans text-primary font-medium">{previewArtwork.medium || 'Oil on Fine Canvas'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-primary/5">
                        <span className="font-cinzel text-[10px] tracking-widest text-primary/60 uppercase font-semibold">Dimensions</span>
                        <span className="font-mono text-primary font-medium">{previewArtwork.dimensions || 'Custom Framing'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-primary/5">
                        <span className="font-cinzel text-[10px] tracking-widest text-primary/60 uppercase font-semibold">Year Created</span>
                        <span className="font-mono text-primary font-medium">{previewArtwork.yearCreated || '2024'}</span>
                      </div>
                      {previewArtwork.style && (
                        <div className="flex justify-between py-1 border-b border-primary/5">
                          <span className="font-cinzel text-[10px] tracking-widest text-primary/60 uppercase font-semibold">Style</span>
                          <span className="font-sans text-primary font-medium">{previewArtwork.style}</span>
                        </div>
                      )}
                    </div>

                    {/* Description & Narrative */}
                    <div>
                      <span className="font-cinzel text-[10px] tracking-widest text-primary/60 uppercase font-semibold block mb-1.5">
                        CURATORIAL NARRATIVE &amp; PROVENANCE
                      </span>
                      <p className="text-xs text-primary/80 leading-relaxed font-sans bg-white/70 p-3 border border-primary/10 rounded-xs max-h-32 overflow-y-auto">
                        {previewArtwork.description || 'Certified museum-grade original masterwork held within The Kala Vault physical archives.'}
                      </p>
                    </div>
                  </div>

                  {/* Modal Actions */}
                  <div className="pt-4 border-t border-[#C5A059]/25 flex flex-wrap items-center gap-3">
                    <a
                      href={`/artwork/${previewArtwork.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 px-4 bg-primary text-white hover:bg-gallery-gold transition-colors font-cinzel text-[11px] tracking-widest uppercase font-bold text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Public Page</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                    <button
                      onClick={() => {
                        const targetArt = previewArtwork;
                        setPreviewArtwork(null);
                        startEdit(targetArt);
                      }}
                      className="py-2.5 px-4 bg-white border border-gallery-gold/60 text-primary hover:bg-gallery-gold hover:text-white transition-colors font-cinzel text-[11px] tracking-widest uppercase font-bold cursor-pointer"
                    >
                      Edit Asset
                    </button>
                    <button
                      onClick={() => setPreviewArtwork(null)}
                      className="py-2.5 px-4 text-primary/70 hover:text-primary transition-colors font-cinzel text-[11px] tracking-widest uppercase cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
