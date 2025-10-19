// Traffic signs with improved placement logic
export class TrafficSign {
    constructor(type, x, y, lane) {
        this.type = type; // 'stop', 'yield', 'speed_limit', etc.
        this.x = x;
        this.y = y;
        this.lane = lane;
        this.width = 50;
        this.height = 50;
        this.collisionRadius = 30;
    }
    
    draw(ctx, offset) {
        const drawY = this.y + offset;
        if (drawY < -100 || drawY > ctx.canvas.height + 100) return;
        
        if (this.type === 'stop') {
            this.drawStopSign(ctx, this.x, drawY);
        }
    }
    
    drawStopSign(ctx, x, y) {
        ctx.save();
        
        // Pole with shadow
        ctx.fillStyle = '#666';
        ctx.fillRect(x - 1, y + 2, 6, 40); // Shadow
        ctx.fillStyle = '#888';
        ctx.fillRect(x - 3, y, 6, 40);
        
        // Stop sign octagon
        const signY = y - 30;
        ctx.fillStyle = '#ff0000';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        const sides = 8;
        const radius = 25;
        for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
            const px = x + radius * Math.cos(angle);
            const py = signY + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // STOP text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('STOP', x, signY);
        
        ctx.restore();
    }
    
    checkCollision(otherSign) {
        const dx = this.x - otherSign.x;
        const dy = this.y - otherSign.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (this.collisionRadius + otherSign.collisionRadius);
    }
}

export class StopSign extends TrafficSign {
    constructor(x, y, lane) {
        super('stop', x, y, lane);
        this.stoppedFrames = 0;
        this.playerStopped = false;
        this.requiredStopFrames = 30; // ~0.5 seconds at 60fps
    }
    
    reset() {
        this.stoppedFrames = 0;
        this.playerStopped = false;
    }
    
    checkPlayerStop(playerSpeed) {
        if (playerSpeed < 0.3) {
            this.stoppedFrames++;
            if (this.stoppedFrames >= this.requiredStopFrames && !this.playerStopped) {
                this.playerStopped = true;
                return { stopped: true, complete: true };
            }
            return { stopped: true, complete: false };
        }
        return { stopped: false, complete: false };
    }
}

export class SignPlacementManager {
    constructor(laneManager) {
        this.laneManager = laneManager;
        this.signs = [];
        this.minSignDistance = 100; // Minimum distance between signs
    }
    
    placeSign(signType, lane, y) {
        // Get proper placement offset (at curb, not in lane)
        const x = this.laneManager.getSignPlacementOffset(lane);
        
        // Check for collisions with existing signs
        const newSign = new TrafficSign(signType, x, y, lane);
        
        for (const existingSign of this.signs) {
            if (newSign.checkCollision(existingSign)) {
                // Try alternate placement
                const altX = this.laneManager.getSignPlacementOffset(
                    lane, 
                    x < this.laneManager.getLaneX(lane) ? 'right' : 'left'
                );
                newSign.x = altX;
                
                // If still colliding, skip this sign
                if (newSign.checkCollision(existingSign)) {
                    return null;
                }
            }
        }
        
        // Check minimum distance from other signs
        for (const existingSign of this.signs) {
            const distance = Math.abs(newSign.y - existingSign.y);
            if (distance < this.minSignDistance && existingSign.lane === lane) {
                return null;
            }
        }
        
        // Create the appropriate sign type
        let sign;
        if (signType === 'stop') {
            sign = new StopSign(newSign.x, y, lane);
        } else {
            sign = new TrafficSign(signType, newSign.x, y, lane);
        }
        
        this.signs.push(sign);
        return sign;
    }
    
    removeSign(sign) {
        const index = this.signs.indexOf(sign);
        if (index > -1) {
            this.signs.splice(index, 1);
        }
    }
    
    getSignsInRange(y, range) {
        return this.signs.filter(sign => {
            const distance = Math.abs(sign.y - y);
            return distance <= range;
        });
    }
    
    update(roadOffset) {
        // Remove signs that are far off screen
        this.signs = this.signs.filter(sign => {
            const drawY = sign.y + roadOffset;
            return drawY > -500 && drawY < 1500;
        });
    }
    
    clear() {
        this.signs = [];
    }
}
