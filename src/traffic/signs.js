/**
 * Traffic Signs System
 * Manages sign placement at curb edges with collision avoidance
 */

export const SignType = {
    STOP: 'stop',
    YIELD: 'yield',
    SPEED_LIMIT: 'speed_limit',
    NO_PARKING: 'no_parking'
};

export class TrafficSign {
    constructor(type, x, y, lane) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.lane = lane;
        this.width = 50;
        this.height = 50;
        this.poleHeight = 40;
        this.visible = true;
        this.approached = false;
        this.playerStopped = false;
        this.stoppedFrames = 0;
    }
    
    /**
     * Draw the sign
     */
    draw(ctx, offsetY = 0) {
        const drawY = this.y + offsetY;
        
        // Only render if visible on screen
        if (drawY < -100 || drawY > ctx.canvas.height / (window.devicePixelRatio || 1) + 100) {
            return;
        }
        
        // Draw pole
        ctx.fillStyle = '#888';
        ctx.fillRect(this.x - 3, drawY, 6, this.poleHeight);
        
        // Draw sign based on type
        switch(this.type) {
            case SignType.STOP:
                this.drawStopSign(ctx, drawY);
                break;
            case SignType.YIELD:
                this.drawYieldSign(ctx, drawY);
                break;
            case SignType.SPEED_LIMIT:
                this.drawSpeedLimitSign(ctx, drawY);
                break;
            case SignType.NO_PARKING:
                this.drawNoParkingSign(ctx, drawY);
                break;
        }
    }
    
    /**
     * Draw stop sign (octagon)
     */
    drawStopSign(ctx, drawY) {
        const centerX = this.x;
        const centerY = drawY - 30;
        const radius = 25;
        
        // Octagon
        ctx.fillStyle = '#ff0000';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        const sides = 8;
        for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('STOP', centerX, centerY);
    }
    
    /**
     * Draw yield sign (triangle)
     */
    drawYieldSign(ctx, drawY) {
        const centerX = this.x;
        const centerY = drawY - 30;
        const size = 25;
        
        // Triangle
        ctx.fillStyle = '#ffff00';
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - size);
        ctx.lineTo(centerX - size, centerY + size);
        ctx.lineTo(centerX + size, centerY + size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Text
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('YIELD', centerX, centerY + 5);
    }
    
    /**
     * Draw speed limit sign (rectangle)
     */
    drawSpeedLimitSign(ctx, drawY) {
        const centerX = this.x;
        const centerY = drawY - 30;
        
        // Rectangle
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fillRect(centerX - 20, centerY - 25, 40, 50);
        ctx.strokeRect(centerX - 20, centerY - 25, 40, 50);
        
        // Text
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SPEED', centerX, centerY - 10);
        ctx.fillText('LIMIT', centerX, centerY);
        ctx.font = 'bold 16px Arial';
        ctx.fillText('25', centerX, centerY + 15);
    }
    
    /**
     * Draw no parking sign (circle)
     */
    drawNoParkingSign(ctx, drawY) {
        const centerX = this.x;
        const centerY = drawY - 30;
        const radius = 20;
        
        // Circle
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Red line through
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX - radius * 0.7, centerY - radius * 0.7);
        ctx.lineTo(centerX + radius * 0.7, centerY + radius * 0.7);
        ctx.stroke();
        
        // "P"
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('P', centerX, centerY);
    }
    
    /**
     * Check if player is approaching sign
     */
    isApproaching(playerX, playerY, threshold = 60) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < threshold && dy < 0;
    }
    
    /**
     * Update sign state
     */
    update(playerX, playerY, playerSpeed) {
        if (this.type === SignType.STOP) {
            const isNear = this.isApproaching(playerX, playerY, 80);
            
            if (isNear) {
                this.approached = true;
                if (playerSpeed < 0.3) {
                    this.stoppedFrames++;
                } else {
                    this.stoppedFrames = 0;
                }
                
                if (this.stoppedFrames >= 30) {
                    this.playerStopped = true;
                }
            }
        }
    }
    
    /**
     * Reset sign state (for recycling)
     */
    reset() {
        this.approached = false;
        this.playerStopped = false;
        this.stoppedFrames = 0;
    }
}

/**
 * Sign Manager
 * Manages multiple signs with spawn collision avoidance
 */
export class SignManager {
    constructor() {
        this.signs = [];
        this.minSignDistance = 150; // Minimum distance between signs
    }
    
    /**
     * Add a sign with collision avoidance
     */
    addSign(type, x, y, lane) {
        // Check if position is too close to existing signs
        if (!this.canPlaceSign(x, y)) {
            return null;
        }
        
        const sign = new TrafficSign(type, x, y, lane);
        this.signs.push(sign);
        return sign;
    }
    
    /**
     * Check if a sign can be placed at given position
     */
    canPlaceSign(x, y) {
        for (const sign of this.signs) {
            const dx = x - sign.x;
            const dy = y - sign.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.minSignDistance) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Get sign at curb edge for a lane
     */
    placeSignAtCurbEdge(type, laneCenter, laneWidth, y, side = 'right') {
        const offset = side === 'right' ? laneWidth / 2 + 25 : -(laneWidth / 2 + 25);
        const x = laneCenter + offset;
        return this.addSign(type, x, y, 0);
    }
    
    /**
     * Update all signs
     */
    update(playerX, playerY, playerSpeed) {
        this.signs.forEach(sign => {
            sign.update(playerX, playerY, playerSpeed);
        });
    }
    
    /**
     * Draw all signs
     */
    draw(ctx, offsetY = 0) {
        this.signs.forEach(sign => {
            sign.draw(ctx, offsetY);
        });
    }
    
    /**
     * Remove signs that are off-screen
     */
    removeOffScreen(minY, maxY) {
        this.signs = this.signs.filter(sign => {
            return sign.y >= minY && sign.y <= maxY;
        });
    }
    
    /**
     * Get all signs
     */
    getAllSigns() {
        return this.signs;
    }
    
    /**
     * Clear all signs
     */
    clear() {
        this.signs = [];
    }
}
