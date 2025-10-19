/**
 * Road tile definitions
 * Supports straight, curve, T-intersection, and cross-intersection tiles
 */

export const TileType = {
    STRAIGHT: 'straight',
    CURVE_LEFT: 'curve_left',
    CURVE_RIGHT: 'curve_right',
    T_INTERSECTION: 't_intersection',
    CROSS_INTERSECTION: 'cross_intersection'
};

export const Direction = {
    NORTH: 'north',
    SOUTH: 'south',
    EAST: 'east',
    WEST: 'west'
};

export class RoadTile {
    constructor(type, x, y, rotation = 0) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.rotation = rotation; // 0, 90, 180, 270
        this.connections = this.getConnections();
        this.lanes = this.getLanes();
    }
    
    getConnections() {
        // Returns which directions this tile connects to
        const rotations = Math.floor(this.rotation / 90) % 4;
        let connections = [];
        
        switch (this.type) {
            case TileType.STRAIGHT:
                connections = [Direction.NORTH, Direction.SOUTH];
                break;
            case TileType.CURVE_LEFT:
                connections = [Direction.NORTH, Direction.WEST];
                break;
            case TileType.CURVE_RIGHT:
                connections = [Direction.NORTH, Direction.EAST];
                break;
            case TileType.T_INTERSECTION:
                connections = [Direction.NORTH, Direction.SOUTH, Direction.EAST];
                break;
            case TileType.CROSS_INTERSECTION:
                connections = [Direction.NORTH, Direction.SOUTH, Direction.EAST, Direction.WEST];
                break;
        }
        
        // Rotate connections based on tile rotation
        for (let i = 0; i < rotations; i++) {
            connections = connections.map(dir => this.rotateDirection(dir));
        }
        
        return connections;
    }
    
    rotateDirection(dir) {
        const order = [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST];
        const index = order.indexOf(dir);
        return order[(index + 1) % 4];
    }
    
    getLanes() {
        // Define lane count and positions for this tile type
        switch (this.type) {
            case TileType.STRAIGHT:
                return { count: 3, layout: 'vertical' };
            case TileType.CURVE_LEFT:
            case TileType.CURVE_RIGHT:
                return { count: 2, layout: 'curved' };
            case TileType.T_INTERSECTION:
                return { count: 3, layout: 'intersection_t' };
            case TileType.CROSS_INTERSECTION:
                return { count: 4, layout: 'intersection_cross' };
            default:
                return { count: 3, layout: 'vertical' };
        }
    }
    
    isIntersection() {
        return this.type === TileType.T_INTERSECTION || 
               this.type === TileType.CROSS_INTERSECTION;
    }
    
    isCurve() {
        return this.type === TileType.CURVE_LEFT || 
               this.type === TileType.CURVE_RIGHT;
    }
}

export function createTile(type, x, y, rotation = 0) {
    return new RoadTile(type, x, y, rotation);
}
