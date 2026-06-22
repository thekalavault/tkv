# 🚀 Quick Start Guide

## Starting the Development Server

### Frontend Only
```bash
cd frontend
npm install          # if not already done
npm run dev          # Starts at http://localhost:5173
```

### Full Stack (with Backend)
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev          # Runs on port 3000

# Terminal 2: Frontend  
cd frontend
npm install
npm run dev          # Runs on port 5173
```

## Testing Collections & Artwork

### Collections Page
```
Navigate to: http://localhost:5173/collections
```

**What to see:**
- 38 artworks displayed in masonry grid
- Stats header showing: Small(2), Medium(9), Large(17), Architectural(10)
- Collection filter tabs at top
- Images loading progressively with watermarks
- Golden frame effect around each image

**Interactions:**
- Click collection tabs to filter
- Click any artwork to open detail page
- Watch images load as you scroll

### Artwork Detail Page
```
Navigate to: http://localhost:5173/artwork/art-0
```

**What to see:**
- Large image on left with watermark
- Artwork info on right (name, artist, description)
- Pricing breakdown section
- Related artworks grid at bottom
- Previous/Next navigation buttons

**Features:**
- Golden frame effect on main image
- CTA buttons (Inquire for Rental, Request Information)
- Metadata (medium, condition, provenance)
- Previous/Next artwork navigation

---

## File Locations

### Artwork Images
```
frontend/public/assets/artworks/
├── (15k)ImperialNoir.jpeg
├── (15k)Summer_sLaughter.jpeg
├── (20k)NeonMuse.png
├── (20k)Urban Siren.png
├── ... (38 total files)
```

### Code Files
```
Collections Page:     frontend/src/pages/Collections.tsx
Artwork Detail:       frontend/src/pages/ArtworkDetail.tsx
Artwork Card:         frontend/src/components/ArtworkCard.tsx
Custom Hooks:         frontend/src/hooks/*.ts
Detail Service:       frontend/src/services/artworkDetailService.ts
Collections Data:     frontend/src/lib/collectionsData.ts
```

---

## Performance Tips

### If slow on first load:
1. Images are cached on first load
2. Try refreshing (images use browser cache after first visit)
3. Watermarks apply only when visible (scroll to trigger)
4. Check DevTools Network tab to see watermarking performance

### To optimize further:
1. Use `npm run build` to create optimized production bundle
2. Deploy with static asset compression
3. Consider CDN for image delivery
4. Enable gzip compression on server

---

## Troubleshooting

### Collections page shows empty
- ✅ Check `/frontend/public/assets/artworks/` has 38 image files
- ✅ Verify file names match exactly (case-sensitive on Linux/Mac)

### Images not loading
- ✅ Ensure public assets folder was copied correctly
- ✅ Check browser DevTools Network tab for 404 errors
- ✅ Verify URL encoding works (spaces → %20)

### Watermarks missing
- ✅ Canvas API may be blocked on some domains
- ✅ Check browser console for CORS errors
- ✅ Fallback to original image if watermarking fails

### Detail page shows "Not Found"
- ✅ Artwork ID must match format: "art-0", "art-1", etc.
- ✅ Only IDs 0-37 exist (38 total artworks)
- ✅ Try: `/artwork/art-0` through `/artwork/art-37`

---

## Browser Compatibility

Tested and working on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements:**
- ES2020+ support
- Intersection Observer API
- Canvas API
- Modern CSS Grid/Flexbox

---

## Build Commands

```bash
# Development with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
tsc --noEmit

# Linting (if configured)
npm run lint
```

---

## Environment Variables

Currently using default values:
```
VITE_API_URL=http://localhost:3000
```

For production, set:
```
VITE_API_URL=https://your-api-domain.com
```

---

## Key Features at a Glance

| Feature | Status | Location |
|---------|--------|----------|
| Collections Grid | ✅ Active | `/collections` |
| Artwork Detail | ✅ Active | `/artwork/:id` |
| Lazy Loading | ✅ Active | ArtworkCard.tsx |
| Watermarking | ✅ Active | services/artworkService.ts |
| Golden Frames | ✅ Active | TailwindCSS styling |
| Responsive Design | ✅ Active | TailwindCSS responsive |
| Tab Navigation | ✅ Active | Collections.tsx |
| Next/Prev Nav | ✅ Active | ArtworkDetail.tsx |
| Related Artworks | ✅ Active | artworkDetailService.ts |
| Auto Pricing | ✅ Active | rentalPricing.ts |

---

## Need Help?

Check:
1. `IMPLEMENTATION_SUMMARY.md` - Full feature overview
2. Component source files - Inline documentation
3. Browser DevTools Console - Error messages
4. Network tab - API/Image loading issues

All code is TypeScript with JSDoc comments for clarity.
