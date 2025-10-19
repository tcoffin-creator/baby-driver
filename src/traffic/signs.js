/**
 * Traffic signs with improved placement logic
 * Places signs at curb edge, not lane center
 */

export class StopSign {
    constructor(x, y, lane, laneHelper) {
        this.lane = lane;
        this.laneHelper = laneHelper;
        
        // Use signPositionForTile for curb-edge placement
        this.x = laneHelper ? laneHelper.signPositionForTile(lane, 'right') : x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.stoppedFrames = 0;
        this.playerStopped = false;
    }
    
    draw(ctx, offset) {
        const drawY = this.y + offset;
        if (drawY < -100 || drawY > ctx.canvas.height + 100) return;
        
        // Stop sign pole
        ctx.fillStyle = '#888';
        ctx.fillRect(this.x - 3, drawY, 6, 40);
        
        // Stop sign octagon
        ctx.fillStyle = '#ff0000';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        const sides = 8;
        const radius = 25;
        for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
            const x = this.x + radius * Math.cos(angle);
            const y = drawY - 30 + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // STOP text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('STOP', this.x, drawY - 30);
    }
    
    checkCollision(playerX, playerY, playerLane, tolerance = 40) {
        // Check if player is in same lane and near sign
        if (playerLane !== this.lane) return false;
        
        const dx = Math.abs(playerX - this.x);
        const dy = Math.abs(playerY - this.y);
        
        return dx < tolerance && dy < 60;
    }
    
    reset() {
        this.stoppedFrames = 0;
        this.playerStopped = false;
    }
}

export class SignSpawner {
    constructor(laneHelper) {
        this.laneHelper = laneHelper;
        this.signs = [];
        this.minDistance = 400; // Minimum distance between signs
    }
    
    spawnSign(y, preferredLane = null) {
        // Simple collision avoidance - check if too close to existing signs
        const tooClose = this.signs.some(sign => {
            return Math.abs(sign.y - y) < this.minDistance;
        });
        
        if (tooClose) {
            return null;
        }
        
        // Choose lane (prefer specified, else random)
        const lane = preferredLane !== null ? 
            preferredLane : 
            Math.floor(Math.random() * this.laneHelper.laneCount);
        
        const sign = new StopSign(0, y, lane, this.laneHelper);
        this.signs.push(sign);
        return sign;
    }
    
    update(offset, canvasHeight) {
        // Remove off-screen signs
        this.signs = this.signs.filter(sign => {
            const screenY = sign.y + offset;
            return screenY < canvasHeight + 200;
        });
    }
    
    draw(ctx, offset) {
        this.signs.forEach(sign => sign.draw(ctx, offset));
    }
    
    getSignsInRange(y, range) {
        return this.signs.filter(sign => {
            return Math.abs(sign.y - y) < range;
        });
    }
}
