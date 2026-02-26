# DART Photo Assets

This folder contains high-quality images of DART stations, trains, and facilities.

## Folder Structure

```
dart/
├── hero/          # Homepage hero images (1920x1080 or larger)
├── stations/      # Station interiors and platforms
├── trains/        # DART light rail trains
└── before-after/  # Cleaning/maintenance comparisons
```

## Priority Photos Needed

### 1. Hero Image (Homepage)
- **File**: `hero/dart-train-hero.jpg`
- **Specs**: 2400px wide minimum, landscape orientation
- **Subject**: Clean DART light rail train at modern station OR sleek station interior
- **Examples**:
  - DART train pulling into Union Station
  - Modern platform at Pearl/Arts District Station
  - AT&T Stadium station exterior

### 2. Stations
- Union Station (main hub)
- AT&T Stadium station (World Cup venue)
- Pearl/Arts District (modern, clean)
- DFW Airport station
- Interior platforms during peak hours
- Escalators, ticketing areas, clean facilities

### 3. Trains
- DART light rail exterior (side profile)
- Interior of clean, modern train car
- Train at platform (passengers boarding)
- Multiple trains at maintenance yard (optional)

### 4. Before/After (for case studies)
- Station platforms: dirty vs. clean
- Restroom facilities: before/after maintenance
- Ticketing area: before/after cleaning
- Train interior: before/after deep clean

## Photo Guidelines

- **Resolution**: 1920px+ wide for web use
- **Format**: .jpg (compressed) or .webp (preferred)
- **Lighting**: Well-lit, natural or professional lighting
- **Composition**: Follow rule of thirds, avoid busy/cluttered shots
- **Quality**: Sharp, in-focus, professional appearance
- **Rights**: Must have usage rights for commercial website

## How to Get Photos

1. **DART Media Relations**
   - Contact: media@dart.org
   - Request press kit/media assets
   - Explain: Website for FIFA 2026 readiness proposal

2. **Personal Photography**
   - Visit during off-peak hours
   - Get permission from DART if shooting commercial
   - Use iPhone 12+ or professional camera

3. **Temporary Placeholders**
   - Currently using Unsplash transit photos
   - Replace ASAP with authentic DART imagery

## Once You Have Photos

1. Place files in appropriate folders
2. Name files descriptively: `union-station-platform.jpg`
3. Update image paths in React components:

```tsx
// In src/app/page.tsx
<div className="absolute inset-0 bg-[url('/images/dart/hero/dart-train-hero.jpg')] bg-cover bg-center"></div>
```

## Status

- [ ] Hero image
- [ ] Station photos (5-10)
- [ ] Train photos (3-5)
- [ ] Before/after sets (2-3)
