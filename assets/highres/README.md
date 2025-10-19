# High-Resolution Assets

This directory contains high-resolution assets for displays with devicePixelRatio >= 2 (Retina displays, high-DPI screens).

## Asset Guidelines

- Use SVG format when possible for infinite scalability
- For raster images, provide 2x resolution versions
- Keep file sizes reasonable (< 100KB per asset)
- Use PNG with transparency for vehicle and sign sprites

## Asset Structure

```
assets/highres/
├── vehicles/
│   ├── player-car.svg
│   ├── npc-car-*.svg
│   └── ...
├── signs/
│   ├── stop-sign.svg
│   ├── yield-sign.svg
│   └── ...
├── traffic-lights/
│   ├── traffic-light.svg
│   └── ...
└── road/
    ├── straight-tile.svg
    ├── curve-tile.svg
    └── ...
```

## Placeholder SVG Examples

### Player Car (player-car.svg)
```xml
<svg width="80" height="120" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="20" width="60" height="90" fill="#4CAF50" rx="10"/>
  <rect x="15" y="20" width="50" height="30" fill="#2E7D32" rx="5"/>
  <rect x="20" y="25" width="40" height="10" fill="#90CAF9"/>
  <circle cx="20" cy="100" r="8" fill="#000"/>
  <circle cx="60" cy="100" r="8" fill="#000"/>
</svg>
```

### Stop Sign (stop-sign.svg)
```xml
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="50,5 85,20 100,50 85,80 50,95 15,80 0,50 15,20" fill="#FF0000" stroke="#FFF" stroke-width="4"/>
  <text x="50" y="60" text-anchor="middle" fill="#FFF" font-size="24" font-weight="bold" font-family="Arial">STOP</text>
</svg>
```

### Traffic Light (traffic-light.svg)
```xml
<svg width="60" height="160" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="10" width="50" height="140" fill="#222" rx="10"/>
  <circle cx="30" cy="40" r="18" fill="#440000" id="red"/>
  <circle cx="30" cy="80" r="18" fill="#444400" id="yellow"/>
  <circle cx="30" cy="120" r="18" fill="#004400" id="green"/>
</svg>
```

### Road Tile - Straight (straight-tile.svg)
```xml
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#333"/>
  <line x1="100" y1="0" x2="100" y2="200" stroke="#FFFF00" stroke-width="4" stroke-dasharray="20,15"/>
</svg>
```

### Road Tile - Curve (curve-tile.svg)
```xml
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#333"/>
  <path d="M 0 100 Q 50 50 100 0" stroke="#FFFF00" stroke-width="4" stroke-dasharray="20,15" fill="none"/>
</svg>
```

### Road Tile - Intersection (intersection-tile.svg)
```xml
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#555"/>
  <!-- Crosswalk stripes -->
  <rect x="0" y="10" width="20" height="8" fill="#FFF"/>
  <rect x="30" y="10" width="20" height="8" fill="#FFF"/>
  <rect x="60" y="10" width="20" height="8" fill="#FFF"/>
  <rect x="90" y="10" width="20" height="8" fill="#FFF"/>
  <rect x="120" y="10" width="20" height="8" fill="#FFF"/>
  <rect x="150" y="10" width="20" height="8" fill="#FFF"/>
  <rect x="180" y="10" width="20" height="8" fill="#FFF"/>
</svg>
```

## Usage

The loader system (`src/loader-highres.js`) automatically selects these assets when:
- `window.devicePixelRatio >= 2`
- Assets exist in this directory
- Falls back to standard assets if high-res versions are missing

## Adding New Assets

1. Create your asset (SVG preferred)
2. Place it in the appropriate subdirectory
3. Keep consistent naming with standard assets
4. Test on both standard and high-DPI displays

## Performance Notes

- SVG assets are cached by the browser
- Use `<use>` tags for repeated elements
- Optimize SVG paths with tools like SVGO
- Test performance on mobile devices
