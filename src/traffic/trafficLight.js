/**
 * Enhanced Traffic Light System
 * Traffic lights with poles, pulsing active lights, and z-offset for visibility
 */

export const LightState = {
    RED: 'red',
    YELLOW: 'yellow',
    GREEN: 'green'
};

export class TrafficLight {
    constructor(x, y, lane) {
        this.x = x;
        this.y = y;
        this.lane = lane;
        this.state = LightState.GREEN;
        this.timer = 0;
        this.stateTimers = {
            red: 180,    // frames
            yellow: 60,
            green: 240
        };
        this.width = 30;
        this.height = 80;
        this.poleHeight = 60;
        this.zOffset = 10; // Render slightly elevated for visibility
        this.pulsePhase = 0; // For pulsing animation
    }
    
    /**
     * Update traffic light state
     */
    update() {
        this.timer++;
        this.pulsePhase += 0.1;
        
        // State transitions
        if (this.state === LightState.GREEN && this.timer >= this.stateTimers.green) {
            this.changeState(LightState.YELLOW);
        } else if (this.state === LightState.YELLOW && this.timer >= this.stateTimers.yellow) {
            this.changeState(LightState.RED);
        } else if (this.state === LightState.RED && this.timer >= this.stateTimers.red) {
            this.changeState(LightState.GREEN);
        }
    }
    
    /**
     * Change traffic light state
     */
    changeState(newState) {
        this.state = newState;
        this.timer = 0;
    }
    
    /**
     * Draw traffic light with pole and pulsing active light
     */
    draw(ctx, offsetY = 0) {
        const drawY = this.y + offsetY;
        
        // Only render if visible
        if (drawY < -150 || drawY > ctx.canvas.height / (window.devicePixelRatio || 1) + 150) {
            return;
        }
        
        // Apply z-offset for visibility
        const renderY = drawY - this.zOffset;
        
        // Draw pole
        this.drawPole(ctx, renderY);
        
        // Draw traffic light box
        this.drawLightBox(ctx, renderY);
        
        // Draw lights with pulsing effect
        this.drawLights(ctx, renderY);
    }
    
    /**
     * Draw traffic light pole
     */
    drawPole(ctx, renderY) {
        // Main pole
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - 5, renderY, 10, this.poleHeight);
        
        // Pole base
        ctx.fillStyle = '#222';
        ctx.fillRect(this.x - 8, renderY + this.poleHeight - 5, 16, 8);
        
        // Horizontal arm extending to hold light
        ctx.fillRect(this.x - 5, renderY - this.height - 10, this.width, 8);
    }
    
    /**
     * Draw traffic light box
     */
    drawLightBox(ctx, renderY) {
        const boxY = renderY - this.height - 10;
        
        // Light housing
        ctx.fillStyle = '#222';
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 2;
        
        // Rounded rectangle for housing
        this.roundRect(ctx, this.x - this.width / 2, boxY, this.width, this.height, 5);
        ctx.fill();
        ctx.stroke();
        
        // Hood/visor above each light
        ctx.fillStyle = '#000';
        for (let i = 0; i < 3; i++) {
            const visorY = boxY + 20 + i * 20;
            ctx.beginPath();
            ctx.moveTo(this.x - this.width / 2 - 2, visorY - 5);
            ctx.lineTo(this.x - this.width / 2 - 5, visorY - 8);
            ctx.lineTo(this.x + this.width / 2 + 5, visorY - 8);
            ctx.lineTo(this.x + this.width / 2 + 2, visorY - 5);
            ctx.fill();
        }
    }
    
    /**
     * Draw traffic light bulbs with pulsing effect
     */
    drawLights(ctx, renderY) {
        const lightRadius = 10;
        const boxY = renderY - this.height - 10;
        
        // Calculate pulse intensity (for active light)
        const pulseIntensity = 0.3 + 0.2 * Math.sin(this.pulsePhase);
        
        // Red light
        const redActive = this.state === LightState.RED;
        this.drawLight(ctx, this.x, boxY + 20, lightRadius, '#ff0000', '#440000', redActive, pulseIntensity);
        
        // Yellow light
        const yellowActive = this.state === LightState.YELLOW;
        this.drawLight(ctx, this.x, boxY + 40, lightRadius, '#ffff00', '#444400', yellowActive, pulseIntensity);
        
        // Green light
        const greenActive = this.state === LightState.GREEN;
        this.drawLight(ctx, this.x, boxY + 60, lightRadius, '#00ff00', '#004400', greenActive, pulseIntensity);
    }
    
    /**
     * Draw individual light with glow effect
     */
    drawLight(ctx, x, y, radius, activeColor, inactiveColor, isActive, pulseIntensity) {
        const color = isActive ? activeColor : inactiveColor;
        
        // Glow effect for active light
        if (isActive) {
            const glowRadius = radius + 5 + pulseIntensity * 8;
            const gradient = ctx.createRadialGradient(x, y, radius, x, y, glowRadius);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.5, color + '80'); // Semi-transparent
            gradient.addColorStop(1, color + '00'); // Fully transparent
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Main light bulb
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Glass reflection effect
        if (isActive) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(x - 3, y - 3, radius / 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Light border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    /**
     * Helper to draw rounded rectangle
     */
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
    
    /**
     * Check if traffic light requires stopping
     */
    shouldStop() {
        return this.state === LightState.RED || this.state === LightState.YELLOW;
    }
    
    /**
     * Get current state
     */
    getState() {
        return this.state;
    }
    
    /**
     * Set state timers (in frames)
     */
    setTimers(red, yellow, green) {
        this.stateTimers.red = red;
        this.stateTimers.yellow = yellow;
        this.stateTimers.green = green;
    }
    
    /**
     * Reset traffic light
     */
    reset() {
        this.state = LightState.GREEN;
        this.timer = 0;
        this.pulsePhase = 0;
    }
}

/**
 * Traffic Light Manager
 * Manages multiple traffic lights with synchronization options
 */
export class TrafficLightManager {
    constructor() {
        this.lights = [];
        this.synchronized = false;
    }
    
    /**
     * Add a traffic light
     */
    addLight(x, y, lane) {
        const light = new TrafficLight(x, y, lane);
        this.lights.push(light);
        return light;
    }
    
    /**
     * Update all traffic lights
     */
    update() {
        this.lights.forEach(light => light.update());
    }
    
    /**
     * Draw all traffic lights
     */
    draw(ctx, offsetY = 0) {
        this.lights.forEach(light => light.draw(ctx, offsetY));
    }
    
    /**
     * Synchronize all lights to same state
     */
    synchronize(state = LightState.GREEN) {
        this.synchronized = true;
        this.lights.forEach(light => {
            light.changeState(state);
        });
    }
    
    /**
     * Desynchronize lights (random states)
     */
    desynchronize() {
        this.synchronized = false;
        const states = [LightState.RED, LightState.YELLOW, LightState.GREEN];
        this.lights.forEach(light => {
            const randomState = states[Math.floor(Math.random() * states.length)];
            light.changeState(randomState);
            light.timer = Math.floor(Math.random() * 100);
        });
    }
    
    /**
     * Get all lights
     */
    getAllLights() {
        return this.lights;
    }
    
    /**
     * Remove lights that are off-screen
     */
    removeOffScreen(minY, maxY) {
        this.lights = this.lights.filter(light => {
            return light.y >= minY && light.y <= maxY;
        });
    }
    
    /**
     * Clear all lights
     */
    clear() {
        this.lights = [];
    }
}
