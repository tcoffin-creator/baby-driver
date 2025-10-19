/**
 * Road Tile Definitions
 * Defines different types of road tiles for the tile-based road system
 */

export const TileType = {
    STRAIGHT: 'straight',
    CURVE_LEFT: 'curve_left',
    CURVE_RIGHT: 'curve_right',
    T_JUNCTION: 't_junction',
    CROSS: 'cross',
    EMPTY: 'empty'
};

export class RoadTile {
    constructor(type, x, y, rotation = 0) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.rotation = rotation; // 0, 90, 180, 270 degrees
        this.width = 200;
        this.height = 200;
        this.lanes = this.calculateLanes();
        this.connections = this.calculateConnections();
    }
    
    /**
     * Calculate lane configuration based on tile type
     */
    calculateLanes() {
        switch(this.type) {
            case TileType.STRAIGHT:
                return {
                    count: 3,
                    direction: 'vertical',
                    centers: [
                        { x: this.x + 66, y: this.y + 100 },
                        { x: this.x + 100, y: this.y + 100 },
                        { x: this.x + 134, y: this.y + 100 }
                    ]
                };
            case TileType.CURVE_LEFT:
            case TileType.CURVE_RIGHT:
                return {
                    count: 2,
                    direction: 'curve',
                    centers: this.calculateCurveLanes()
                };
            case TileType.T_JUNCTION:
                return {
                    count: 4,
                    direction: 'junction',
                    centers: this.calculateTJunctionLanes()
                };
            case TileType.CROSS:
                return {
                    count: 6,
                    direction: 'intersection',
                    centers: this.calculateCrossLanes()
                };
            default:
                return { count: 0, centers: [] };
        }
    }
    
    /**
     * Calculate curve lane positions
     */
    calculateCurveLanes() {
        const centers = [];
        const radius = 80;
        const steps = 5;
        
        for (let i = 0; i <= steps; i++) {
            const angle = (Math.PI / 2) * (i / steps);
            const x = this.x + 100 + radius * Math.cos(angle);
            const y = this.y + 100 + radius * Math.sin(angle);
            centers.push({ x, y });
        }
        
        return centers;
    }
    
    /**
     * Calculate T-junction lane positions
     */
    calculateTJunctionLanes() {
        return [
            { x: this.x + 66, y: this.y + 50 },
            { x: this.x + 100, y: this.y + 50 },
            { x: this.x + 134, y: this.y + 50 },
            { x: this.x + 100, y: this.y + 150 }
        ];
    }
    
    /**
     * Calculate crossroads lane positions
     */
    calculateCrossLanes() {
        return [
            { x: this.x + 66, y: this.y + 100 },
            { x: this.x + 100, y: this.y + 66 },
            { x: this.x + 134, y: this.y + 100 },
            { x: this.x + 100, y: this.y + 134 },
            { x: this.x + 100, y: this.y + 100 },
            { x: this.x + 100, y: this.y + 100 }
        ];
    }
    
    /**
     * Calculate tile connections (which sides connect to other tiles)
     */
    calculateConnections() {
        const conn = { top: false, right: false, bottom: false, left: false };
        
        switch(this.type) {
            case TileType.STRAIGHT:
                conn.top = true;
                conn.bottom = true;
                break;
            case TileType.CURVE_LEFT:
                conn.top = true;
                conn.left = true;
                break;
            case TileType.CURVE_RIGHT:
                conn.top = true;
                conn.right = true;
                break;
            case TileType.T_JUNCTION:
                conn.top = true;
                conn.left = true;
                conn.right = true;
                break;
            case TileType.CROSS:
                conn.top = true;
                conn.right = true;
                conn.bottom = true;
                conn.left = true;
                break;
        }
        
        return conn;
    }
    
    /**
     * Check if point is within tile bounds
     */
    contains(x, y) {
        return x >= this.x && x < this.x + this.width &&
               y >= this.y && y < this.y + this.height;
    }
    
    /**
     * Get tile data for serialization
     */
    toJSON() {
        return {
            type: this.type,
            x: this.x,
            y: this.y,
            rotation: this.rotation
        };
    }
    
    /**
     * Create tile from JSON data
     */
    static fromJSON(data) {
        return new RoadTile(data.type, data.x, data.y, data.rotation);
    }
}
