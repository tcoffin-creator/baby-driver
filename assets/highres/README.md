# High-Resolution Assets Directory

This directory contains high-resolution (2x) assets for displays with devicePixelRatio >= 2 (Retina displays, high-DPI screens).

## Placeholder Assets

The current assets are small SVG placeholders. Replace them with actual high-quality PNG or SVG artwork as needed.

## Asset Requirements

### Vehicle Assets
- `car.png` - Player car sprite (recommended: 80x120px @ 2x = 160x240px)
- `traffic_car.png` - AI traffic vehicles

### Road Tiles
- `road_straight.png` - Straight road segment
- `road_curve.png` - Curved road segment for turns
- `road_t_intersection.png` - T-intersection tile
- `road_cross.png` - 4-way intersection (crossroads)

### Traffic Control
- `traffic_light.png` - Traffic light with pole (recommended: 60x160px @ 2x)
- `stop_sign.png` - Stop sign octagon (recommended: 100x100px @ 2x)
- `crosswalk.png` - Crosswalk stripe pattern

## Usage

The asset loader (`src/loader-highres.js`) automatically:
1. Detects `devicePixelRatio >= 2`
2. Loads assets from this directory when available
3. Falls back to `assets/` directory if highres version not found

## File Format Recommendations

- **Vector graphics (SVG)**: Best for signs, UI elements (resolution-independent)
- **PNG with transparency**: Good for vehicles, complex graphics
- **Keep file sizes reasonable**: Target < 100KB per asset for web performance
- **Use appropriate compression**: Run PNG files through optimization tools

## Integration Notes

When replacing placeholders:
1. Maintain aspect ratios expected by the game code
2. Use transparency for non-rectangular sprites
3. Center important content in the sprite bounds
4. Test on both standard and high-DPI displays

## Texture Atlas (Future)

For optimal performance with many assets, consider:
- Combining multiple sprites into a single atlas
- Using the `assets:pack` build script (see package.json)
- Generating a JSON atlas definition
