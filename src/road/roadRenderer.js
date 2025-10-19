/**
 * Road renderer
 * Draws road tiles, lane markings, crosswalks, and stop lines
 */

import { TileType } from './roadTiles.js';

export class RoadRenderer {
    constructor(ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.laneCount = 3;
        this.laneWidth = canvasWidth / this.laneCount;
    }
    
    drawRoad(tiles, offset) {
        // Background
        this.ctx.fillStyle = '#87CEEB'; // Sky blue
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Draw each tile
        tiles.forEach(tile => {
            const screenY = tile.y + offset;
            
            // Only draw visible tiles
            if (screenY < -300 || screenY > this.canvasHeight + 300) {
                return;
            }
            
            if (tile.isIntersection()) {
                this.drawIntersection(tile, screenY);
            } else if (tile.isCurve()) {
                this.drawCurve(tile, screenY);
            } else {
                this.drawStraight(tile, screenY);
            }
        });
    }
    
    drawStraight(tile, screenY) {
        const tileHeight = 200;
        
        // Road surface
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, screenY, this.canvasWidth, tileHeight);
        
        // Lane markings
        this.drawLaneMarkings(screenY, tileHeight);
        
        // Road edges
        this.drawRoadEdges(screenY, tileHeight);
    }
    
    drawCurve(tile, screenY) {
        const tileHeight = 200;
        
        // Road surface (simplified - would need proper curve rendering)
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, screenY, this.canvasWidth, tileHeight);
        
        // Curved lane markings (simplified as straight for now)
        this.drawLaneMarkings(screenY, tileHeight);
        this.drawRoadEdges(screenY, tileHeight);
    }
    
    drawIntersection(tile, screenY) {
        const tileHeight = 200;
        
        // Intersection surface (slightly different color)
        this.ctx.fillStyle = '#444';
        this.ctx.fillRect(0, screenY, this.canvasWidth, tileHeight);
        
        // Crosswalks at top and bottom
        this.drawCrosswalk(screenY);
        this.drawCrosswalk(screenY + tileHeight - 20);
        
        // Stop lines before crosswalks
        this.drawStopLine(screenY - 5);
        this.drawStopLine(screenY + tileHeight - 25);
        
        // No lane markings in intersection
        this.drawRoadEdges(screenY, tileHeight);
    }
    
    drawLaneMarkings(startY, height) {
        this.ctx.strokeStyle = '#ffff00';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([20, 15]);
        
        // Draw lane dividers
        for (let i = 1; i < this.laneCount; i++) {
            const x = this.laneWidth * i;
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, startY + height);
            this.ctx.stroke();
        }
        
        this.ctx.setLineDash([]);
    }
    
    drawRoadEdges(startY, height) {
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 5;
        
        // Left edge
        this.ctx.beginPath();
        this.ctx.moveTo(0, startY);
        this.ctx.lineTo(0, startY + height);
        this.ctx.stroke();
        
        // Right edge
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvasWidth, startY);
        this.ctx.lineTo(this.canvasWidth, startY + height);
        this.ctx.stroke();
    }
    
    drawCrosswalk(y) {
        this.ctx.fillStyle = '#fff';
        const stripeWidth = 15;
        const stripeGap = 10;
        
        for (let x = 0; x < this.canvasWidth; x += stripeWidth + stripeGap) {
            this.ctx.fillRect(x, y, stripeWidth, 20);
        }
    }
    
    drawStopLine(y) {
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 5;
        this.ctx.setLineDash([]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.canvasWidth, y);
        this.ctx.stroke();
    }
}
