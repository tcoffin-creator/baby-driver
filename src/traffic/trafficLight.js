// Enhanced traffic light with improved visuals
export class EnhancedTrafficLight {
    constructor(x, y, lane, config = {}) {
        this.x = x;
        this.y = y;
        this.lane = lane;
        this.state = 'green'; // 'red', 'yellow', 'green'
        this.timer = 0;
        this.redDuration = config.redDuration || 180;
        this.yellowDuration = config.yellowDuration || 60;
        this.greenDuration = config.greenDuration || 240;
        this.width = 30;
        this.height = 80;
        this.poleHeight = 60;
        this.pulsePhase = 0;
    }
    
    update(deltaTime = 1) {
        this.timer += deltaTime;
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
        const drawY = this.y + offset;
        if (drawY < -150 || drawY > ctx.canvas.height + 150) return;
        
        ctx.save();
        
        // Taller pole with shadow
        ctx.fillStyle = '#222';
        ctx.fillRect(this.x + 2, drawY + 2, 10, this.poleHeight); // Shadow
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x, drawY, 10, this.poleHeight);
        
        // Traffic light housing
        const topY = drawY - this.height;
        ctx.fillStyle = '#1a1a1a';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.fillRect(this.x - this.width / 2, topY, this.width, this.height);
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        // Border
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - this.width / 2, topY, this.width, this.height);
        
        const lightRadius = 10;
        const lightX = this.x;
        
        // Calculate pulse effect for active light
        const pulseScale = 1 + Math.sin(this.pulsePhase) * 0.15;
        
        // Red light
        const redActive = this.state === 'red';
        this.drawLight(ctx, lightX, topY + 20, lightRadius, '#ff0000', '#440000', redActive, pulseScale);
        
        // Yellow light
        const yellowActive = this.state === 'yellow';
        this.drawLight(ctx, lightX, topY + 40, lightRadius, '#ffff00', '#444400', yellowActive, pulseScale);
        
        // Green light
        const greenActive = this.state === 'green';
        this.drawLight(ctx, lightX, topY + 60, lightRadius, '#00ff00', '#004400', greenActive, pulseScale);
        
        ctx.restore();
    }
    
    drawLight(ctx, x, y, radius, activeColor, inactiveColor, isActive, pulseScale) {
        ctx.save();
        
        if (isActive) {
            // Glow effect
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2 * pulseScale);
            gradient.addColorStop(0, activeColor);
            gradient.addColorStop(0.5, activeColor + '88');
            gradient.addColorStop(1, activeColor + '00');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius * 2 * pulseScale, 0, Math.PI * 2);
            ctx.fill();
            
            // Pulsing light
            ctx.fillStyle = activeColor;
            ctx.beginPath();
            ctx.arc(x, y, radius * pulseScale, 0, Math.PI * 2);
            ctx.fill();
            
            // Highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.4 * pulseScale, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Inactive light
            ctx.fillStyle = inactiveColor;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Border
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
    
    shouldStop() {
        return this.state === 'red' || this.state === 'yellow';
    }
    
    getState() {
        return this.state;
    }
    
    setState(state) {
        if (['red', 'yellow', 'green'].includes(state)) {
            this.state = state;
            this.timer = 0;
        }
    }
    
    getZOffset() {
        // Return z-offset to appear above road
        return 10;
    }
}
