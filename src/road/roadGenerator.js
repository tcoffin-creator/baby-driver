/**
 * Road generator with tile/grid-based system
 * Supports straight roads, curves, and intersections
 */

import { TileType, createTile } from './roadTiles.js';

export class RoadGenerator {
    constructor(config = {}) {
        this.tileSize = config.tileSize || 200;
        this.width = config.width || 3; // tiles wide
        this.initialLength = config.initialLength || 10; // initial tiles
        this.tiles = [];
        this.nextY = 0;
    }
    
    generate() {
        // Generate initial road tiles
        for (let i = 0; i < this.initialLength; i++) {
            this.addNextTile();
        }
        return this.tiles;
    }
    
    addNextTile() {
        const y = this.nextY;
        this.nextY += this.tileSize;
        
        // Randomly choose tile type with weighted probabilities
        const rand = Math.random();
        let type, rotation = 0;
        
        if (rand < 0.5) {
            // 50% straight road
            type = TileType.STRAIGHT;
        } else if (rand < 0.7) {
            // 20% curve
            type = Math.random() < 0.5 ? TileType.CURVE_LEFT : TileType.CURVE_RIGHT;
            rotation = Math.floor(Math.random() * 4) * 90;
        } else if (rand < 0.85) {
            // 15% T-intersection
            type = TileType.T_INTERSECTION;
            rotation = Math.floor(Math.random() * 4) * 90;
        } else {
            // 15% cross intersection
            type = TileType.CROSS_INTERSECTION;
        }
        
        const tile = createTile(type, 0, -y, rotation);
        this.tiles.push(tile);
        return tile;
    }
    
    update(offset) {
        // Remove tiles that have scrolled off screen
        this.tiles = this.tiles.filter(tile => {
            const screenY = tile.y + offset;
            return screenY < 800; // Keep some buffer
        });
        
        // Add new tiles as needed
        while (this.tiles.length < this.initialLength) {
            this.addNextTile();
        }
    }
    
    getTileAt(worldY) {
        // Find tile containing this world Y coordinate
        return this.tiles.find(tile => {
            const tileStart = tile.y;
            const tileEnd = tile.y + this.tileSize;
            return worldY >= tileStart && worldY < tileEnd;
        });
    }
    
    getIntersections() {
        return this.tiles.filter(tile => tile.isIntersection());
    }
    
    getCurves() {
        return this.tiles.filter(tile => tile.isCurve());
    }
}
