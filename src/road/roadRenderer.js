/**
 * Road Renderer
 * Renders road tiles, lane markings, crosswalks, and stop lines
 */

import { TileType } from './roadTiles.js';

export class RoadRenderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.roadColor = '#333';
        this.laneMarkingColor = '#ffff00';
        this.crosswalkColor = '#ffffff';
        this.stopLineColor = '#ffffff';
    }
    
    /**
     * Render a single road tile
     */
    renderTile(tile, offsetY = 0) {
        const ctx = this.ctx;
        const drawY = tile.y + offsetY;
        
        // Only render if visible
        if (drawY + tile.height < -100 || drawY > ctx.canvas.height / (window.devicePixelRatio || 1) + 100) {
            return;
        }
        
        switch(tile.type) {
            case TileType.STRAIGHT:
                this.drawStraightTile(tile, drawY);
                break;
            case TileType.CURVE_LEFT:
                this.drawCurveTile(tile, drawY, 'left');
                break;
            case TileType.CURVE_RIGHT:
                this.drawCurveTile(tile, drawY, 'right');
                break;
            case TileType.T_JUNCTION:
                this.drawTJunctionTile(tile, drawY);
                break;
            case TileType.CROSS:
                this.drawCrossTile(tile, drawY);
                break;
        }
    }
    
    /**
     * Draw straight road tile
     */
    drawStraightTile(tile, drawY) {
        const ctx = this.ctx;
        const laneWidth = tile.width / 3;
        
        // Road background
        ctx.fillStyle = this.roadColor;
        ctx.fillRect(tile.x, drawY, tile.width, tile.height);
        
        // Lane markings
        ctx.strokeStyle = this.laneMarkingColor;
        ctx.lineWidth = 3;
        ctx.setLineDash([20, 15]);
        
        // Left lane divider
        ctx.beginPath();
        ctx.moveTo(tile.x + laneWidth, drawY);
        ctx.lineTo(tile.x + laneWidth, drawY + tile.height);
        ctx.stroke();
        
        // Right lane divider
        ctx.beginPath();
        ctx.moveTo(tile.x + laneWidth * 2, drawY);
        ctx.lineTo(tile.x + laneWidth * 2, drawY + tile.height);
        ctx.stroke();
        
        ctx.setLineDash([]);
        
        // Road edges
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(tile.x, drawY);
        ctx.lineTo(tile.x, drawY + tile.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(tile.x + tile.width, drawY);
        ctx.lineTo(tile.x + tile.width, drawY + tile.height);
        ctx.stroke();
    }
    
    /**
     * Draw curve tile
     */
    drawCurveTile(tile, drawY, direction) {
        const ctx = this.ctx;
        
        // Road background
        ctx.fillStyle = this.roadColor;
        ctx.fillRect(tile.x, drawY, tile.width, tile.height);
        
        // Draw curved lane marking
        ctx.strokeStyle = this.laneMarkingColor;
        ctx.lineWidth = 3;
        ctx.setLineDash([20, 15]);
        
        ctx.beginPath();
        const startX = direction === 'left' ? tile.x + tile.width / 2 : tile.x + tile.width / 2;
        const controlX = direction === 'left' ? tile.x : tile.x + tile.width;
        const endX = direction === 'left' ? tile.x : tile.x + tile.width;
        
        ctx.moveTo(startX, drawY);
        ctx.quadraticCurveTo(controlX, drawY + tile.height / 2, endX, drawY + tile.height);
        ctx.stroke();
        
        ctx.setLineDash([]);
    }
    
    /**
     * Draw T-junction tile
     */
    drawTJunctionTile(tile, drawY) {
        const ctx = this.ctx;
        
        // Road background (lighter for intersection)
        ctx.fillStyle = '#555';
        ctx.fillRect(tile.x, drawY, tile.width, tile.height);
        
        // Draw crosswalk at top
        this.drawCrosswalk(tile.x, drawY + 10, tile.width);
        
        // Draw stop line
        this.drawStopLine(tile.x, drawY + 30, tile.width);
    }
    
    /**
     * Draw crossroads tile
     */
    drawCrossTile(tile, drawY) {
        const ctx = this.ctx;
        
        // Road background (lighter for intersection)
        ctx.fillStyle = '#555';
        ctx.fillRect(tile.x, drawY, tile.width, tile.height);
        
        // Draw crosswalks on all sides
        this.drawCrosswalk(tile.x, drawY + 10, tile.width);
        this.drawCrosswalk(tile.x, drawY + tile.height - 20, tile.width);
        
        // Draw stop lines
        this.drawStopLine(tile.x, drawY + 30, tile.width);
        this.drawStopLine(tile.x, drawY + tile.height - 35, tile.width);
    }
    
    /**
     * Draw crosswalk markings
     */
    drawCrosswalk(x, y, width) {
        const ctx = this.ctx;
        ctx.fillStyle = this.crosswalkColor;
        
        for (let i = 0; i < width; i += 20) {
            ctx.fillRect(x + i, y, 10, 8);
        }
    }
    
    /**
     * Draw stop line
     */
    drawStopLine(x, y, width) {
        const ctx = this.ctx;
        ctx.strokeStyle = this.stopLineColor;
        ctx.lineWidth = 6;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.stroke();
    }
    
    /**
     * Render all tiles
     */
    renderTiles(tiles, offsetY = 0) {
        tiles.forEach(tile => {
            this.renderTile(tile, offsetY);
        });
    }
    
    /**
     * Render lane markings for a simple road
     */
    renderSimpleRoad(width, height, laneCount = 3) {
        const ctx = this.ctx;
        const laneWidth = width / laneCount;
        
        // Road background
        ctx.fillStyle = this.roadColor;
        ctx.fillRect(0, 0, width, height);
        
        // Lane markings
        ctx.strokeStyle = this.laneMarkingColor;
        ctx.lineWidth = 3;
        ctx.setLineDash([20, 15]);
        
        for (let i = 1; i < laneCount; i++) {
            ctx.beginPath();
            ctx.moveTo(laneWidth * i, 0);
            ctx.lineTo(laneWidth * i, height);
            ctx.stroke();
        }
        
        ctx.setLineDash([]);
        
        // Road edges
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 5;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(width, 0);
        ctx.lineTo(width, height);
        ctx.stroke();
    }
    
    /**
     * Set rendering colors
     */
    setColors(colors) {
        if (colors.road) this.roadColor = colors.road;
        if (colors.laneMarking) this.laneMarkingColor = colors.laneMarking;
        if (colors.crosswalk) this.crosswalkColor = colors.crosswalk;
        if (colors.stopLine) this.stopLineColor = colors.stopLine;
    }
}
