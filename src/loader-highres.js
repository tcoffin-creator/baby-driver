/**
 * High-resolution asset loader
 * Prefers assets/highres/ on high-DPI displays (devicePixelRatio >= 2)
 */

export class AssetLoader {
    constructor() {
        this.dpr = window.devicePixelRatio || 1;
        this.useHighRes = this.dpr >= 2;
        this.assets = new Map();
        this.loading = new Set();
    }
    
    getAssetPath(name) {
        // Prefer highres if available and DPR >= 2
        if (this.useHighRes) {
            return `assets/highres/${name}`;
        }
        return `assets/${name}`;
    }
    
    async loadImage(name, fallback = true) {
        // Check if already loaded
        if (this.assets.has(name)) {
            return this.assets.get(name);
        }
        
        // Check if currently loading
        if (this.loading.has(name)) {
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (this.assets.has(name)) {
                        clearInterval(checkInterval);
                        resolve(this.assets.get(name));
                    }
                }, 50);
            });
        }
        
        this.loading.add(name);
        
        try {
            const highResPath = this.getAssetPath(name);
            const img = await this.loadImageFromPath(highResPath);
            this.assets.set(name, img);
            this.loading.delete(name);
            return img;
        } catch (error) {
            console.warn(`Failed to load ${name} from highres, trying fallback`, error);
            
            // Fallback to standard assets directory
            if (fallback && this.useHighRes) {
                try {
                    const fallbackPath = `assets/${name}`;
                    const img = await this.loadImageFromPath(fallbackPath);
                    this.assets.set(name, img);
                    this.loading.delete(name);
                    return img;
                } catch (fallbackError) {
                    console.error(`Failed to load ${name} from fallback`, fallbackError);
                    this.loading.delete(name);
                    throw fallbackError;
                }
            }
            
            this.loading.delete(name);
            throw error;
        }
    }
    
    loadImageFromPath(path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
            img.src = path;
        });
    }
    
    async preload(assetNames) {
        const promises = assetNames.map(name => 
            this.loadImage(name).catch(err => {
                console.warn(`Failed to preload ${name}:`, err);
                return null;
            })
        );
        
        return Promise.all(promises);
    }
    
    get(name) {
        return this.assets.get(name);
    }
    
    has(name) {
        return this.assets.has(name);
    }
    
    clear() {
        this.assets.clear();
        this.loading.clear();
    }
}

// Singleton instance
export const assetLoader = new AssetLoader();
