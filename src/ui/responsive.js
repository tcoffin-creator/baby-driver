/**
 * Responsive Canvas Management
 * Handles canvas sizing with devicePixelRatio and prevents body scroll
 */

export class ResponsiveCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.dpr = window.devicePixelRatio || 1;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        
        // Bind methods
        this.resize = this.resize.bind(this);
        
        // Initial resize
        this.resize();
        
        // Listen for window resize
        window.addEventListener('resize', this.resize);
    }
    
    resize() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Set display size (css pixels)
        const displayWidth = Math.min(800, containerWidth - 40);
        const displayHeight = 500;
        
        // Set canvas size accounting for device pixel ratio
        this.canvas.width = displayWidth * this.dpr;
        this.canvas.height = displayHeight * this.dpr;
        
        // Set display size
        this.canvas.style.width = displayWidth + 'px';
        this.canvas.style.height = displayHeight + 'px';
        
        // Scale context to match device pixel ratio
        this.ctx.scale(this.dpr, this.dpr);
        
        return {
            width: displayWidth,
            height: displayHeight,
            dpr: this.dpr
        };
    }
    
    destroy() {
        window.removeEventListener('resize', this.resize);
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
    }
}
