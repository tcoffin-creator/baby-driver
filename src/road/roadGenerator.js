// Road generator with support for turns and intersections
import { RoadTile, TileType, RoadGraph } from './roadTiles.js';

export class RoadGenerator {
    constructor(config = {}) {
        this.tileSize = config.tileSize || 200;
        this.straightProbability = config.straightProbability || 0.6;
        this.curveProbability = config.curveProbability || 0.2;
        this.intersectionProbability = config.intersectionProbability || 0.2;
    }
    
    generateRoad(length = 20) {
        const graph = new RoadGraph();
        let currentY = 0;
        let previousType = TileType.STRAIGHT;
        
        for (let i = 0; i < length; i++) {
            const y = currentY - (i * this.tileSize);
            const tileType = this.chooseTileType(previousType, i);
            const rotation = this.chooseRotation(tileType);
            
            const tile = new RoadTile(tileType, 0, y, rotation);
            graph.addTile(tile);
            
            // Connect to previous tile if exists
            if (i > 0) {
                const prevTile = graph.tiles[i - 1];
                graph.addEdge(prevTile, tile, 'south');
            }
            
            previousType = tileType;
        }
        
        return graph;
    }
    
    chooseTileType(previousType, index) {
        // Don't put intersections too close together
        if (index > 0 && index % 5 !== 0) {
            // Mostly straight roads with occasional curves
            const rand = Math.random();
            if (rand < this.straightProbability + this.curveProbability) {
                return TileType.STRAIGHT;
            } else if (rand < this.straightProbability + this.curveProbability * 1.5) {
                return Math.random() < 0.5 ? TileType.CURVE_LEFT : TileType.CURVE_RIGHT;
            }
        }
        
        // Add intersections periodically
        if (index > 0 && index % 5 === 0) {
            const rand = Math.random();
            if (rand < 0.3) {
                return TileType.T_INTERSECTION;
            } else if (rand < 0.5) {
                return TileType.CROSS_INTERSECTION;
            }
        }
        
        return TileType.STRAIGHT;
    }
    
    chooseRotation(tileType) {
        // Most tiles face north (0 degrees)
        // Add some variation for curves
        if (tileType === TileType.CURVE_LEFT || tileType === TileType.CURVE_RIGHT) {
            const rotations = [0, 90, 180, 270];
            return rotations[Math.floor(Math.random() * rotations.length)];
        }
        return 0;
    }
    
    generateIntersectionLayout(type = TileType.CROSS_INTERSECTION) {
        // Generate a single intersection with approach and exit roads
        const graph = new RoadGraph();
        
        // Center intersection
        const intersection = new RoadTile(type, 0, 0, 0);
        graph.addTile(intersection);
        
        // Add approach roads
        const approachNorth = new RoadTile(TileType.STRAIGHT, 0, -this.tileSize, 0);
        const approachSouth = new RoadTile(TileType.STRAIGHT, 0, this.tileSize, 0);
        
        graph.addTile(approachNorth);
        graph.addTile(approachSouth);
        graph.addEdge(approachNorth, intersection, 'south');
        graph.addEdge(intersection, approachSouth, 'south');
        
        if (type === TileType.CROSS_INTERSECTION) {
            const approachEast = new RoadTile(TileType.STRAIGHT, this.tileSize, 0, 90);
            const approachWest = new RoadTile(TileType.STRAIGHT, -this.tileSize, 0, 90);
            
            graph.addTile(approachEast);
            graph.addTile(approachWest);
            graph.addEdge(approachWest, intersection, 'east');
            graph.addEdge(intersection, approachEast, 'east');
        }
        
        return graph;
    }
    
    generateTurningPath(startLane, endLane, tileType) {
        // Generate a bezier curve path for vehicles turning through an intersection
        const points = [];
        const steps = 10;
        
        if (tileType === TileType.CURVE_LEFT) {
            // Left turn curve
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const angle = t * Math.PI / 2; // 90 degree turn
                points.push({
                    x: Math.sin(angle) * startLane,
                    y: (1 - Math.cos(angle)) * startLane
                });
            }
        } else if (tileType === TileType.CURVE_RIGHT) {
            // Right turn curve
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const angle = t * Math.PI / 2;
                points.push({
                    x: -Math.sin(angle) * startLane,
                    y: (1 - Math.cos(angle)) * startLane
                });
            }
        } else {
            // Straight through
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                points.push({
                    x: startLane,
                    y: t
                });
            }
        }
        
        return points;
    }
}
