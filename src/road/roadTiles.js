// Road tile types and definitions
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
        this.rotation = rotation; // 0, 90, 180, 270 degrees
        this.connections = this.getConnections();
        this.lanes = this.initializeLanes();
    }
    
    getConnections() {
        // Define which directions this tile connects to
        const baseConnections = {
            [TileType.STRAIGHT]: [Direction.NORTH, Direction.SOUTH],
            [TileType.CURVE_LEFT]: [Direction.NORTH, Direction.WEST],
            [TileType.CURVE_RIGHT]: [Direction.NORTH, Direction.EAST],
            [TileType.T_INTERSECTION]: [Direction.NORTH, Direction.EAST, Direction.WEST],
            [TileType.CROSS_INTERSECTION]: [Direction.NORTH, Direction.SOUTH, Direction.EAST, Direction.WEST]
        };
        
        const connections = baseConnections[this.type] || [];
        
        // Rotate connections based on tile rotation
        if (this.rotation !== 0) {
            return connections.map(dir => this.rotateDirection(dir, this.rotation));
        }
        
        return connections;
    }
    
    rotateDirection(direction, degrees) {
        const directions = [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST];
        const index = directions.indexOf(direction);
        const rotations = degrees / 90;
        const newIndex = (index + rotations) % 4;
        return directions[newIndex];
    }
    
    initializeLanes() {
        // Define lanes for each tile type
        // Each lane has a centerline path and width
        switch (this.type) {
            case TileType.STRAIGHT:
                return [
                    { id: 0, offset: -0.33, direction: Direction.NORTH },
                    { id: 1, offset: 0, direction: Direction.NORTH },
                    { id: 2, offset: 0.33, direction: Direction.NORTH }
                ];
            
            case TileType.CURVE_LEFT:
            case TileType.CURVE_RIGHT:
                return [
                    { id: 0, offset: -0.33, direction: Direction.NORTH, curves: true },
                    { id: 1, offset: 0, direction: Direction.NORTH, curves: true },
                    { id: 2, offset: 0.33, direction: Direction.NORTH, curves: true }
                ];
            
            case TileType.T_INTERSECTION:
            case TileType.CROSS_INTERSECTION:
                return [
                    { id: 0, offset: -0.33, direction: Direction.NORTH, intersection: true },
                    { id: 1, offset: 0, direction: Direction.NORTH, intersection: true },
                    { id: 2, offset: 0.33, direction: Direction.NORTH, intersection: true }
                ];
            
            default:
                return [];
        }
    }
    
    getLaneCenter(laneId, normalizedY = 0.5) {
        const lane = this.lanes.find(l => l.id === laneId);
        if (!lane) return { x: this.x, y: this.y };
        
        // Calculate position based on tile dimensions (assuming 1.0 = tile width)
        return {
            x: this.x + lane.offset,
            y: this.y + (normalizedY - 0.5) // Center at 0.5
        };
    }
    
    canConnect(otherTile, direction) {
        // Check if this tile can connect to another tile in the given direction
        return this.connections.includes(direction);
    }
    
    getSignPlacementOffset(lane) {
        // Get offset position for placing signs at curb/edge, not in lane center
        const laneData = this.lanes[lane] || this.lanes[0];
        const isLeftLane = laneData.offset < 0;
        const isRightLane = laneData.offset > 0;
        
        // Place signs at the edge of the road, not in the lane
        if (isLeftLane) {
            return -0.5; // Left curb
        } else if (isRightLane) {
            return 0.5; // Right curb
        } else {
            // Middle lane - alternate sides
            return lane % 2 === 0 ? -0.5 : 0.5;
        }
    }
}

export class RoadGraph {
    constructor() {
        this.tiles = [];
        this.edges = [];
    }
    
    addTile(tile) {
        this.tiles.push(tile);
    }
    
    addEdge(fromTile, toTile, direction) {
        this.edges.push({ from: fromTile, to: toTile, direction });
    }
    
    getTileAt(x, y) {
        return this.tiles.find(t => t.x === x && t.y === y);
    }
    
    getConnectedTiles(tile) {
        return this.edges
            .filter(e => e.from === tile)
            .map(e => e.to);
    }
    
    findPath(startTile, endTile) {
        // Simple BFS pathfinding
        const queue = [[startTile]];
        const visited = new Set([startTile]);
        
        while (queue.length > 0) {
            const path = queue.shift();
            const current = path[path.length - 1];
            
            if (current === endTile) {
                return path;
            }
            
            const neighbors = this.getConnectedTiles(current);
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push([...path, neighbor]);
                }
            }
        }
        
        return null;
    }
}
