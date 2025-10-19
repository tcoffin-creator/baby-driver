// Lightweight bloom and post-processing effects
export class BloomEffect {
    constructor(canvas, config = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.enabled = config.enabled !== false;
        this.intensity = config.intensity || 0.3;
        this.threshold = config.threshold || 0.7;
        
        // Create temporary canvas for bloom processing
        this.tempCanvas = document.createElement('canvas');
        this.tempCtx = this.tempCanvas.getContext('2d');
    }
    
    apply() {
        if (!this.enabled) return;
        
        // Resize temp canvas if needed
        if (this.tempCanvas.width !== this.canvas.width || 
            this.tempCanvas.height !== this.canvas.height) {
            this.tempCanvas.width = this.canvas.width;
            this.tempCanvas.height = this.canvas.height;
        }
        
        // Copy current canvas to temp
        this.tempCtx.drawImage(this.canvas, 0, 0);
        
        // Apply bloom effect using composite operations
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.globalAlpha = this.intensity;
        
        // Draw brightened version
        this.ctx.filter = `brightness(${1 + this.threshold}) blur(4px)`;
        this.ctx.drawImage(this.tempCanvas, 0, 0);
        
        // Reset
        this.ctx.filter = 'none';
        this.ctx.globalAlpha = 1;
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    applyContrast(amount = 1.1) {
        if (!this.enabled) return;
        
        this.ctx.filter = `contrast(${amount})`;
        this.ctx.drawImage(this.canvas, 0, 0);
        this.ctx.filter = 'none';
    }
    
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    
    setIntensity(intensity) {
        this.intensity = Math.max(0, Math.min(1, intensity));
    }
    
    setThreshold(threshold) {
        this.threshold = Math.max(0, Math.min(1, threshold));
    }
}

export class PostProcessing {
    constructor(canvas, config = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.effects = [];
        
        // Add default effects based on config
        if (config.bloom) {
            this.addEffect(new BloomEffect(canvas, config.bloom));
        }
    }
    
    addEffect(effect) {
        this.effects.push(effect);
    }
    
    removeEffect(effect) {
        const index = this.effects.indexOf(effect);
        if (index > -1) {
            this.effects.splice(index, 1);
        }
    }
    
    apply() {
        for (const effect of this.effects) {
            if (effect.enabled) {
                effect.apply();
            }
        }
    }
    
    setEnabled(enabled) {
        this.effects.forEach(effect => {
            if (effect.setEnabled) {
                effect.setEnabled(enabled);
            }
        });
    }
}
