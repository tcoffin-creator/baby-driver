/**
 * Enhanced traffic light rendering
 * Features taller pole, separate head sprite, pulsing active light
 */

export class TrafficLight {
    constructor(x, y, lane) {
        this.x = x;
        this.y = y;
        this.lane = lane;
        this.state = 'green'; // 'red', 'yellow', 'green'
        this.timer = 0;
        this.redDuration = 180; // frames
        this.yellowDuration = 60;
        this.greenDuration = 240;
        this.width = 30;
        this.height = 80;
        this.zOffset = 10; // Render above road surface
        this.pulsePhase = 0; // For pulsing effect
    }
    
    update() {
        this.timer++;
        this.pulsePhase += 0.1;
        
        if (this.state === 'green' && this.timer >= this.greenDuration) {
            this.state = 'yellow';
            this.timer = 0;
        } else if (this.state === 'yellow' && this.timer >= this.yellowDuration) {
            this.state = 'red';
            this.timer = 0;
        } else if (this.state === 'red' && this.timer >= this.redDuration) {
            this.state = 'green';
            this.timer = 0;
        }
    }
    
    draw(ctx, offset) {
        const drawY = this.y + offset - this.zOffset;
        if (drawY < -150 || drawY > ctx.canvas.height + 150) return;
        
        // Taller traffic light pole
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - 5, drawY, 10, 80);
        
        // Traffic light box (head)
        ctx.fillStyle = '#222';
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        ctx.fillRect(this.x - this.width / 2, drawY - this.height, this.width, this.height);
        ctx.strokeRect(this.x - this.width / 2, drawY - this.height, this.width, this.height);
        
        // Lights with pulsing effect on active light
        const lightRadius = 10;
        const lightX = this.x;
        const pulseScale = 1 + Math.sin(this.pulsePhase) * 0.15;
        
        // Red light
        const redActive = this.state === 'red';
        ctx.fillStyle = redActive ? '#ff0000' : '#440000';
        ctx.beginPath();
        const redRadius = redActive ? lightRadius * pulseScale : lightRadius;
        ctx.arc(lightX, drawY - 60, redRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect for active light
        if (redActive) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff0000';
            ctx.beginPath();
            ctx.arc(lightX, drawY - 60, redRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        // Yellow light
        const yellowActive = this.state === 'yellow';
        ctx.fillStyle = yellowActive ? '#ffff00' : '#444400';
        ctx.beginPath();
        const yellowRadius = yellowActive ? lightRadius * pulseScale : lightRadius;
        ctx.arc(lightX, drawY - 40, yellowRadius, 0, Math.PI * 2);
        ctx.fill();
        
        if (yellowActive) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffff00';
            ctx.beginPath();
            ctx.arc(lightX, drawY - 40, yellowRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        // Green light
        const greenActive = this.state === 'green';
        ctx.fillStyle = greenActive ? '#00ff00' : '#004400';
        ctx.beginPath();
        const greenRadius = greenActive ? lightRadius * pulseScale : lightRadius;
        ctx.arc(lightX, drawY - 20, greenRadius, 0, Math.PI * 2);
        ctx.fill();
        
        if (greenActive) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00ff00';
            ctx.beginPath();
            ctx.arc(lightX, drawY - 20, greenRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    shouldStop() {
        return this.state === 'red' || this.state === 'yellow';
    }
    
    checkCollision(playerX, playerY, playerLane, tolerance = 40) {
        if (playerLane !== this.lane) return false;
        
        const dx = Math.abs(playerX - this.x);
        const dy = Math.abs(playerY - this.y);
        
        return dx < tolerance && dy < 80;
    }
}
