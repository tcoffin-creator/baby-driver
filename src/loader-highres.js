/**
 * High-Resolution Asset Loader
 * Selects high-res assets based on devicePixelRatio
 */

export class HighResLoader {
    constructor() {
        this.dpr = window.devicePixelRatio || 1;
        this.useHighRes = this.dpr >= 2;
        this.cache = new Map();
        this.basePaths = {
            standard: 'assets/',
            highres: 'assets/highres/'
        };
    }
    
    /**
     * Get appropriate asset path based on devicePixelRatio
     */
    getAssetPath(assetName) {
        const basePath = this.useHighRes ? this.basePaths.highres : this.basePaths.standard;
        return basePath + assetName;
    }
    
    /**
     * Load image asset with fallback
     */
    async loadImage(assetName) {
        // Check cache first
        if (this.cache.has(assetName)) {
            return this.cache.get(assetName);
        }
        
        const img = new Image();
        const highResPath = this.basePaths.highres + assetName;
        const standardPath = this.basePaths.standard + assetName;
        
        return new Promise((resolve, reject) => {
            img.onload = () => {
                this.cache.set(assetName, img);
                resolve(img);
            };
            
            img.onerror = () => {
                // Try fallback to standard resolution
                if (this.useHighRes) {
                    img.src = standardPath;
                    img.onerror = () => reject(new Error(`Failed to load asset: ${assetName}`));
                } else {
                    reject(new Error(`Failed to load asset: ${assetName}`));
                }
            };
            
            // Try high-res first if enabled
            img.src = this.useHighRes ? highResPath : standardPath;
        });
    }
    
    /**
     * Load SVG asset
     */
    async loadSVG(assetName) {
        const path = this.getAssetPath(assetName);
        
        // Check cache
        if (this.cache.has(assetName)) {
            return this.cache.get(assetName);
        }
        
        try {
            const response = await fetch(path);
            if (!response.ok) {
                // Try fallback
                if (this.useHighRes) {
                    const fallbackPath = this.basePaths.standard + assetName;
                    const fallbackResponse = await fetch(fallbackPath);
                    const svgText = await fallbackResponse.text();
                    this.cache.set(assetName, svgText);
                    return svgText;
                }
                throw new Error(`Failed to load SVG: ${assetName}`);
            }
            const svgText = await response.text();
            this.cache.set(assetName, svgText);
            return svgText;
        } catch (error) {
            console.warn(`SVG load failed: ${assetName}`, error);
            return null;
        }
    }
    
    /**
     * Preload multiple assets
     */
    async preloadAssets(assetList) {
        const promises = assetList.map(asset => {
            if (asset.endsWith('.svg')) {
                return this.loadSVG(asset);
            } else {
                return this.loadImage(asset);
            }
        });
        
        try {
            await Promise.all(promises);
            return true;
        } catch (error) {
            console.error('Asset preloading failed:', error);
            return false;
        }
    }
    
    /**
     * Get cached asset
     */
    getCached(assetName) {
        return this.cache.get(assetName);
    }
    
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
    
    /**
     * Get device pixel ratio
     */
    getDevicePixelRatio() {
        return this.dpr;
    }
    
    /**
     * Check if using high-res assets
     */
    isUsingHighRes() {
        return this.useHighRes;
    }
}

// Export singleton instance
export const assetLoader = new HighResLoader();
