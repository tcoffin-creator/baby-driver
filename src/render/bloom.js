/**
 * Bloom Post-Processing Effect
 * Simple bloom effect using canvas compositing operations
 */

export class BloomEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.enabled = false;
        this.intensity = 0.3;
        this.threshold = 0.7;
        
        // Create offscreen canvas for bloom processing
        this.bloomCanvas = document.createElement('canvas');
        this.bloomCtx = this.bloomCanvas.getContext('2d');
    }
    
    /**
     * Enable or disable bloom effect
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    
    /**
     * Set bloom intensity (0-1)
     */
    setIntensity(intensity) {
        this.intensity = Math.max(0, Math.min(1, intensity));
    }
    
    /**
     * Set brightness threshold (0-1)
     */
    setThreshold(threshold) {
        this.threshold = Math.max(0, Math.min(1, threshold));
    }
    
    /**
     * Apply bloom effect to canvas
     */
    apply() {
        if (!this.enabled) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Resize bloom canvas if needed
        if (this.bloomCanvas.width !== width || this.bloomCanvas.height !== height) {
            this.bloomCanvas.width = width;
            this.bloomCanvas.height = height;
        }
        
        // Copy main canvas to bloom canvas
        this.bloomCtx.clearRect(0, 0, width, height);
        this.bloomCtx.drawImage(this.canvas, 0, 0);
        
        // Apply threshold to isolate bright areas
        const imageData = this.bloomCtx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const threshold = this.threshold * 255;
        
        for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            if (brightness < threshold) {
                // Darken pixels below threshold
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
            }
        }
        
        this.bloomCtx.putImageData(imageData, 0, 0);
        
        // Apply blur effect (simple box blur)
        this.bloomCtx.filter = 'blur(8px)';
        this.bloomCtx.drawImage(this.bloomCanvas, 0, 0);
        this.bloomCtx.filter = 'none';
        
        // Composite bloom back onto main canvas with additive blending
        const originalComposite = this.ctx.globalCompositeOperation;
        const originalAlpha = this.ctx.globalAlpha;
        
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.globalAlpha = this.intensity;
        this.ctx.drawImage(this.bloomCanvas, 0, 0);
        
        // Restore original composite settings
        this.ctx.globalCompositeOperation = originalComposite;
        this.ctx.globalAlpha = originalAlpha;
    }
    
    /**
     * Toggle bloom effect
     */
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
    
    /**
     * Check if bloom is enabled
     */
    isEnabled() {
        return this.enabled;
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        this.bloomCanvas = null;
        this.bloomCtx = null;
    }
}
