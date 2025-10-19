// Road renderer with crosswalks and stop lines
export class RoadRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
    
    drawRoad(roadOffset, laneManager) {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Road background
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, width, height);
        
        // Draw lane markings with offset for scrolling effect
        this.drawLaneMarkings(roadOffset, laneManager);
        
        // Draw road edges
        this.drawRoadEdges();
    }
    
    drawLaneMarkings(offset, laneManager) {
        const ctx = this.ctx;
        const height = this.canvas.height;
        const laneCount = laneManager.laneCount;
        const laneWidth = laneManager.laneWidth;
        
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.setLineDash([20, 15]);
        
        // Animate lane markings with road offset
        const dashOffset = -offset % 35;
        ctx.lineDashOffset = dashOffset;
        
        // Draw lane dividers
        for (let i = 1; i < laneCount; i++) {
            const x = laneWidth * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;
    }
    
    drawRoadEdges() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 5;
        
        // Left edge
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, height);
        ctx.stroke();
        
        // Right edge
        ctx.beginPath();
        ctx.moveTo(width, 0);
        ctx.lineTo(width, height);
        ctx.stroke();
    }
    
    drawIntersection(x, y, width, height, offset) {
        const ctx = this.ctx;
        const drawY = y + offset;
        
        if (drawY < -height - 50 || drawY > this.canvas.height + 50) return;
        
        // Intersection surface (lighter gray)
        ctx.fillStyle = '#555';
        ctx.fillRect(x, drawY, width, height);
        
        // Draw crosswalks at top and bottom
        this.drawCrosswalk(x, drawY, width);
        this.drawCrosswalk(x, drawY + height - 4, width);
        
        // Draw stop lines
        this.drawStopLine(x, drawY - 5, width);
        this.drawStopLine(x, drawY + height + 1, width);
    }
    
    drawCrosswalk(x, y, width) {
        const ctx = this.ctx;
        const stripeWidth = 15;
        const stripeHeight = 4;
        const spacing = 20;
        
        ctx.fillStyle = '#fff';
        
        // Draw crosswalk stripes
        for (let i = x; i < x + width; i += spacing) {
            ctx.fillRect(i, y, stripeWidth, stripeHeight);
        }
    }
    
    drawStopLine(x, y, width) {
        const ctx = this.ctx;
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.stroke();
    }
    
    drawTileIntersection(tile, offset) {
        // Draw intersection based on tile type
        const ctx = this.ctx;
        const drawY = tile.y + offset;
        const tileSize = 200; // Should match tile size from generator
        
        if (drawY < -tileSize - 50 || drawY > this.canvas.height + 50) return;
        
        // Different rendering based on tile type
        if (tile.type === 'cross_intersection') {
            this.drawIntersection(0, tile.y, this.canvas.width, tileSize, offset);
        } else if (tile.type === 't_intersection') {
            this.drawIntersection(0, tile.y, this.canvas.width, tileSize * 0.8, offset);
        }
    }
    
    drawLanePath(path, color = '#00ff00', width = 2) {
        // Draw a path for debugging or AI visualization
        const ctx = this.ctx;
        
        if (path.length < 2) return;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    drawDebugGrid(offset) {
        // Draw a grid for debugging positioning
        const ctx = this.ctx;
        const gridSize = 50;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines with offset
        const startY = -(offset % gridSize);
        for (let y = startY; y < this.canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width, y);
            ctx.stroke();
        }
    }
}

export class IntersectionRenderer {
    constructor(roadRenderer) {
        this.roadRenderer = roadRenderer;
    }
    
    drawFullIntersection(intersection, offset, laneManager) {
        const ctx = this.roadRenderer.ctx;
        const drawY = intersection.y + offset;
        
        // Draw base intersection
        this.roadRenderer.drawIntersection(
            0, 
            intersection.y, 
            this.roadRenderer.canvas.width, 
            intersection.height, 
            offset
        );
        
        // Add turn arrows or additional markings if needed
        this.drawTurnArrows(intersection, drawY, laneManager);
    }
    
    drawTurnArrows(intersection, drawY, laneManager) {
        const ctx = this.roadRenderer.ctx;
        
        // Draw simple turn arrows in lanes
        for (let lane = 0; lane < laneManager.laneCount; lane++) {
            const x = laneManager.getLaneX(lane);
            const arrowY = drawY + intersection.height * 0.3;
            
            if (arrowY < 0 || arrowY > this.roadRenderer.canvas.height) continue;
            
            ctx.save();
            ctx.fillStyle = '#fff';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Simple arrow character
            ctx.fillText('↑', x, arrowY);
            
            ctx.restore();
        }
    }
}
