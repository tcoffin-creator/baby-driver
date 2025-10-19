/**
 * Simple bloom post-processing effect
 * Uses canvas composite operations for lightweight glow effect
 */

export class BloomEffect {
    constructor(enabled = false) {
        this.enabled = enabled;
        this.intensity = 0.3;
        this.threshold = 200; // Brightness threshold for bloom
    }
    
    apply(ctx, canvas) {
        if (!this.enabled) return;
        
        // Save current state
        ctx.save();
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Create temporary canvas for bloom pass
        const bloomCanvas = document.createElement('canvas');
        bloomCanvas.width = canvas.width;
        bloomCanvas.height = canvas.height;
        const bloomCtx = bloomCanvas.getContext('2d');
        
        // Draw original
        bloomCtx.drawImage(canvas, 0, 0);
        
        // Extract bright areas
        const bloomData = bloomCtx.getImageData(0, 0, canvas.width, canvas.height);
        const bloom = bloomData.data;
        
        for (let i = 0; i < bloom.length; i += 4) {
            const r = bloom[i];
            const g = bloom[i + 1];
            const b = bloom[i + 2];
            
            // Calculate brightness
            const brightness = (r + g + b) / 3;
            
            if (brightness < this.threshold) {
                // Darken non-bright areas
                bloom[i] = 0;
                bloom[i + 1] = 0;
                bloom[i + 2] = 0;
                bloom[i + 3] = 0;
            }
        }
        
        bloomCtx.putImageData(bloomData, 0, 0);
        
        // Apply blur (simplified - just scale down and up)
        bloomCtx.filter = 'blur(10px)';
        bloomCtx.drawImage(bloomCanvas, 0, 0);
        bloomCtx.filter = 'none';
        
        // Composite bloom back onto original with additive blending
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = this.intensity;
        ctx.drawImage(bloomCanvas, 0, 0);
        
        // Restore state
        ctx.restore();
    }
    
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    
    setIntensity(intensity) {
        this.intensity = Math.max(0, Math.min(1, intensity));
    }
    
    setThreshold(threshold) {
        this.threshold = Math.max(0, Math.min(255, threshold));
    }
}
