/**
 * Road Generator
 * Generates tile-based roads with intersections for vehicle pathfinding
 */

import { RoadTile, TileType } from './roadTiles.js';

export class RoadGenerator {
    constructor(width, height, tileSize = 200) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.grid = [];
        this.tiles = [];
        this.intersections = [];
    }
    
    /**
     * Generate a simple road layout
     */
    generateSimpleRoad(length = 10) {
        this.tiles = [];
        this.intersections = [];
        
        const centerX = Math.floor(this.width / 2 - this.tileSize / 2);
        
        // Create straight road tiles
        for (let i = 0; i < length; i++) {
            const y = i * this.tileSize;
            const tile = new RoadTile(TileType.STRAIGHT, centerX, y);
            this.tiles.push(tile);
            
            // Add intersection every few tiles
            if (i > 0 && i % 4 === 0) {
                const intersectionTile = new RoadTile(TileType.CROSS, centerX, y);
                this.tiles[this.tiles.length - 1] = intersectionTile;
                this.intersections.push(intersectionTile);
            }
        }
        
        return this.tiles;
    }
    
    /**
     * Generate procedural road with curves and intersections
     */
    generateProceduralRoad(length = 15) {
        this.tiles = [];
        this.intersections = [];
        
        const centerX = Math.floor(this.width / 2 - this.tileSize / 2);
        let currentY = 0;
        
        for (let i = 0; i < length; i++) {
            let tileType = TileType.STRAIGHT;
            
            // Randomly place intersections
            if (i > 2 && i < length - 2 && Math.random() < 0.2) {
                tileType = Math.random() < 0.5 ? TileType.T_JUNCTION : TileType.CROSS;
            }
            // Add occasional curves
            else if (i > 0 && i < length - 1 && Math.random() < 0.15) {
                tileType = Math.random() < 0.5 ? TileType.CURVE_LEFT : TileType.CURVE_RIGHT;
            }
            
            const tile = new RoadTile(tileType, centerX, currentY);
            this.tiles.push(tile);
            
            if (tileType === TileType.T_JUNCTION || tileType === TileType.CROSS) {
                this.intersections.push(tile);
            }
            
            currentY += this.tileSize;
        }
        
        return this.tiles;
    }
    
    /**
     * Generate grid-based road layout
     */
    generateGrid(gridWidth = 3, gridHeight = 5) {
        this.tiles = [];
        this.intersections = [];
        this.grid = [];
        
        // Initialize grid
        for (let y = 0; y < gridHeight; y++) {
            this.grid[y] = [];
            for (let x = 0; x < gridWidth; x++) {
                this.grid[y][x] = null;
            }
        }
        
        // Place tiles
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const tileX = x * this.tileSize;
                const tileY = y * this.tileSize;
                
                // Determine tile type based on position
                let tileType = TileType.STRAIGHT;
                
                // Center column is main road
                if (x === Math.floor(gridWidth / 2)) {
                    if (y === 0 || y === gridHeight - 1) {
                        tileType = TileType.STRAIGHT;
                    } else if (Math.random() < 0.3) {
                        tileType = TileType.CROSS;
                    } else {
                        tileType = TileType.STRAIGHT;
                    }
                } else {
                    // Other tiles are mostly empty
                    tileType = TileType.EMPTY;
                }
                
                const tile = new RoadTile(tileType, tileX, tileY);
                this.grid[y][x] = tile;
                
                if (tileType !== TileType.EMPTY) {
                    this.tiles.push(tile);
                    
                    if (tileType === TileType.CROSS || tileType === TileType.T_JUNCTION) {
                        this.intersections.push(tile);
                    }
                }
            }
        }
        
        return this.tiles;
    }
    
    /**
     * Get tile at specific coordinates
     */
    getTileAt(x, y) {
        return this.tiles.find(tile => tile.contains(x, y));
    }
    
    /**
     * Get all intersection tiles
     */
    getIntersections() {
        return this.intersections;
    }
    
    /**
     * Get all tiles
     */
    getTiles() {
        return this.tiles;
    }
    
    /**
     * Get lane centers for pathfinding
     */
    getLaneCenters() {
        const centers = [];
        this.tiles.forEach(tile => {
            if (tile.lanes && tile.lanes.centers) {
                centers.push(...tile.lanes.centers);
            }
        });
        return centers;
    }
    
    /**
     * Find path between two points (simple pathfinding)
     */
    findPath(startX, startY, endX, endY) {
        const startTile = this.getTileAt(startX, startY);
        const endTile = this.getTileAt(endX, endY);
        
        if (!startTile || !endTile) return null;
        
        // Simple path: return lane centers between start and end
        const path = [];
        const laneCenters = this.getLaneCenters();
        
        // Filter lane centers between start and end Y coordinates
        const minY = Math.min(startY, endY);
        const maxY = Math.max(startY, endY);
        
        laneCenters.forEach(center => {
            if (center.y >= minY && center.y <= maxY) {
                path.push(center);
            }
        });
        
        // Sort by Y coordinate
        path.sort((a, b) => a.y - b.y);
        
        return path;
    }
    
    /**
     * Export road layout
     */
    export() {
        return {
            tiles: this.tiles.map(tile => tile.toJSON()),
            intersections: this.intersections.map(tile => tile.toJSON()),
            width: this.width,
            height: this.height,
            tileSize: this.tileSize
        };
    }
    
    /**
     * Import road layout
     */
    import(data) {
        this.width = data.width;
        this.height = data.height;
        this.tileSize = data.tileSize;
        this.tiles = data.tiles.map(tileData => RoadTile.fromJSON(tileData));
        this.intersections = data.intersections.map(tileData => RoadTile.fromJSON(tileData));
    }
}
