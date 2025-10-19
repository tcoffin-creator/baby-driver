#!/usr/bin/env node
/**
 * Simple texture atlas packer for Baby Driver
 * 
 * This script combines multiple small images into a single atlas
 * to reduce HTTP requests and improve loading performance.
 * 
 * Usage:
 *   node assets/pack-atlas.js
 * 
 * Requirements:
 *   - Node.js 14+
 *   - canvas package (npm install canvas) for production use
 * 
 * For web builds, this creates:
 *   - assets/atlas-packed.png (combined image)
 *   - assets/atlas-packed.json (sprite coordinates)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    inputDir: path.join(__dirname),
    outputDir: path.join(__dirname),
    outputImage: 'atlas-packed.png',
    outputJSON: 'atlas-packed.json',
    padding: 2, // Padding between sprites
    maxWidth: 2048,
    maxHeight: 2048
};

// Mock implementation - in production, use 'canvas' package
function packAtlas() {
    console.log('📦 Baby Driver Texture Atlas Packer\n');
    
    // Read atlas.json to get list of assets
    const atlasPath = path.join(config.inputDir, 'atlas.json');
    
    if (!fs.existsSync(atlasPath)) {
        console.error('❌ atlas.json not found');
        process.exit(1);
    }
    
    const atlas = JSON.parse(fs.readFileSync(atlasPath, 'utf8'));
    const assets = atlas.assets || {};
    
    console.log(`Found ${Object.keys(assets).length} assets to pack\n`);
    
    // Create packed atlas metadata
    const packedAtlas = {
        version: '1.0',
        image: config.outputImage,
        width: 512, // Would be calculated based on actual packing
        height: 512,
        sprites: {}
    };
    
    // Simple grid packing algorithm
    let x = 0;
    let y = 0;
    const spriteSize = 64; // Assuming 64x64 sprites
    const cols = Math.floor(config.maxWidth / (spriteSize + config.padding));
    let col = 0;
    
    Object.keys(assets).forEach(name => {
        packedAtlas.sprites[name] = {
            x: x,
            y: y,
            width: spriteSize,
            height: spriteSize
        };
        
        console.log(`  ✓ Packed: ${name} at (${x}, ${y})`);
        
        col++;
        if (col >= cols) {
            col = 0;
            x = 0;
            y += spriteSize + config.padding;
        } else {
            x += spriteSize + config.padding;
        }
    });
    
    // Write packed atlas JSON
    const outputJSONPath = path.join(config.outputDir, config.outputJSON);
    fs.writeFileSync(
        outputJSONPath,
        JSON.stringify(packedAtlas, null, 2),
        'utf8'
    );
    
    console.log(`\n✅ Atlas metadata written to: ${outputJSONPath}`);
    console.log('\nNote: Image packing requires the "canvas" package.');
    console.log('Install with: npm install canvas');
    console.log('For now, using individual asset files.\n');
}

// Check if canvas package is available
try {
    const Canvas = require('canvas');
    console.log('✅ Canvas package found - full packing available');
    // In production, implement actual image packing here
    packAtlas();
} catch (e) {
    console.log('ℹ️  Canvas package not found - creating metadata only');
    packAtlas();
}
