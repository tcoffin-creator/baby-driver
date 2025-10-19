/**
 * Lane Utilities
 * Helper functions for lane management, positioning, and pathfinding
 */

export class Lane {
    constructor(centerX, centerY, width = 60, direction = 'vertical') {
        this.centerX = centerX;
        this.centerY = centerY;
        this.width = width;
        this.direction = direction; // 'vertical', 'horizontal', 'curve'
    }
    
    /**
     * Get lane center point
     */
    getCenter() {
        return { x: this.centerX, y: this.centerY };
    }
    
    /**
     * Get left edge offset for sign placement
     */
    getLeftEdgeOffset() {
        return {
            x: this.centerX - this.width / 2 - 25,
            y: this.centerY
        };
    }
    
    /**
     * Get right edge offset for sign placement
     */
    getRightEdgeOffset() {
        return {
            x: this.centerX + this.width / 2 + 25,
            y: this.centerY
        };
    }
    
    /**
     * Get curb edge position (prefers right side)
     */
    getCurbEdge(side = 'right') {
        return side === 'left' ? this.getLeftEdgeOffset() : this.getRightEdgeOffset();
    }
    
    /**
     * Check if point is within lane bounds
     */
    contains(x, y) {
        const leftEdge = this.centerX - this.width / 2;
        const rightEdge = this.centerX + this.width / 2;
        return x >= leftEdge && x <= rightEdge;
    }
    
    /**
     * Get distance from point to lane center
     */
    distanceToCenter(x, y) {
        const dx = x - this.centerX;
        const dy = y - this.centerY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

/**
 * Lane Manager
 * Manages multiple lanes and provides utilities for lane operations
 */
export class LaneManager {
    constructor(laneCount = 3, laneWidth = 60) {
        this.laneCount = laneCount;
        this.laneWidth = laneWidth;
        this.lanes = [];
    }
    
    /**
     * Initialize lanes for a given road width
     */
    initializeLanes(roadWidth, roadHeight = 0) {
        this.lanes = [];
        const totalLaneWidth = roadWidth / this.laneCount;
        
        for (let i = 0; i < this.laneCount; i++) {
            const centerX = totalLaneWidth * i + totalLaneWidth / 2;
            const lane = new Lane(centerX, roadHeight, this.laneWidth);
            this.lanes.push(lane);
        }
        
        return this.lanes;
    }
    
    /**
     * Get lane by index
     */
    getLane(index) {
        if (index >= 0 && index < this.lanes.length) {
            return this.lanes[index];
        }
        return null;
    }
    
    /**
     * Get all lanes
     */
    getAllLanes() {
        return this.lanes;
    }
    
    /**
     * Get lane at specific X coordinate
     */
    getLaneAtX(x) {
        for (let i = 0; i < this.lanes.length; i++) {
            if (this.lanes[i].contains(x, 0)) {
                return { lane: this.lanes[i], index: i };
            }
        }
        return null;
    }
    
    /**
     * Get center X coordinate for lane index
     */
    getLaneCenterX(index) {
        const lane = this.getLane(index);
        return lane ? lane.centerX : 0;
    }
    
    /**
     * Calculate turning path between two lanes
     */
    getTurningPath(fromLane, toLane, steps = 5) {
        const path = [];
        const fromCenter = fromLane.getCenter();
        const toCenter = toLane.getCenter();
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            // Smooth interpolation using ease-in-out
            const eased = t < 0.5 
                ? 2 * t * t 
                : -1 + (4 - 2 * t) * t;
            
            const x = fromCenter.x + (toCenter.x - fromCenter.x) * eased;
            const y = fromCenter.y + (toCenter.y - fromCenter.y) * t;
            
            path.push({ x, y });
        }
        
        return path;
    }
    
    /**
     * Check if lane change is safe (no immediate obstacles)
     */
    canChangeLane(currentLane, targetLane, obstacles = []) {
        if (!currentLane || !targetLane) return false;
        
        const path = this.getTurningPath(currentLane, targetLane);
        
        // Check if any obstacles intersect with the path
        for (const point of path) {
            for (const obstacle of obstacles) {
                const dx = point.x - obstacle.x;
                const dy = point.y - obstacle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < obstacle.radius || distance < 30) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    /**
     * Get nearest lane to a point
     */
    getNearestLane(x, y) {
        let nearest = null;
        let minDistance = Infinity;
        let nearestIndex = -1;
        
        for (let i = 0; i < this.lanes.length; i++) {
            const distance = this.lanes[i].distanceToCenter(x, y);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = this.lanes[i];
                nearestIndex = i;
            }
        }
        
        return { lane: nearest, index: nearestIndex, distance: minDistance };
    }
    
    /**
     * Get sign placement position for a lane (at curb edge)
     */
    getSignPlacement(laneIndex, side = 'right') {
        const lane = this.getLane(laneIndex);
        return lane ? lane.getCurbEdge(side) : null;
    }
    
    /**
     * Export lane configuration
     */
    export() {
        return {
            laneCount: this.laneCount,
            laneWidth: this.laneWidth,
            lanes: this.lanes.map(lane => ({
                centerX: lane.centerX,
                centerY: lane.centerY,
                width: lane.width,
                direction: lane.direction
            }))
        };
    }
}
