// Asset loader with retina/high-DPI support
export class AssetLoader {
    constructor() {
        this.assets = {};
        this.loading = [];
        this.atlas = null;
        this.useHighRes = window.devicePixelRatio >= 2;
    }
    
    async loadAtlas(atlasPath = 'assets/atlas.json') {
        try {
            const response = await fetch(atlasPath);
            this.atlas = await response.json();
            return this.atlas;
        } catch (error) {
            console.warn('Atlas not found, using fallback paths:', error);
            return null;
        }
    }
    
    async loadImage(name, fallbackPath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            // Determine path based on atlas or fallback
            let path = fallbackPath;
            if (this.atlas && this.atlas.assets && this.atlas.assets[name]) {
                const assetInfo = this.atlas.assets[name];
                path = this.useHighRes && assetInfo.highres ? assetInfo.highres : assetInfo.standard;
            } else if (this.useHighRes) {
                // Try high-res path if no atlas
                path = fallbackPath.replace('assets/', 'assets/highres/');
            }
            
            img.onload = () => {
                this.assets[name] = img;
                resolve(img);
            };
            
            img.onerror = () => {
                // Fallback to standard res if high-res fails
                if (this.useHighRes && path !== fallbackPath) {
                    console.warn(`High-res asset ${path} failed, falling back to ${fallbackPath}`);
                    img.src = fallbackPath;
                } else {
                    console.warn(`Failed to load asset: ${path}`);
                    // Create a placeholder colored rectangle
                    const canvas = document.createElement('canvas');
                    canvas.width = 64;
                    canvas.height = 64;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#ff00ff'; // Magenta for missing assets
                    ctx.fillRect(0, 0, 64, 64);
                    this.assets[name] = canvas;
                    resolve(canvas);
                }
            };
            
            img.src = path;
            this.loading.push(img);
        });
    }
    
    async loadAll(assetList) {
        // First try to load atlas
        await this.loadAtlas();
        
        // Load all assets
        const promises = assetList.map(asset => 
            this.loadImage(asset.name, asset.path)
        );
        
        return Promise.all(promises);
    }
    
    getAsset(name) {
        return this.assets[name];
    }
    
    hasAsset(name) {
        return !!this.assets[name];
    }
    
    getLoadProgress() {
        const total = this.loading.length;
        const loaded = Object.keys(this.assets).length;
        return total > 0 ? loaded / total : 1;
    }
}
