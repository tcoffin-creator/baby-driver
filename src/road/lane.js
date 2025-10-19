/**
 * Lane utilities
 * Provides functions for lane center, offsets, and turning paths
 */

export class LaneHelper {
    constructor(canvasWidth, laneCount = 3) {
        this.canvasWidth = canvasWidth;
        this.laneCount = laneCount;
        this.laneWidth = canvasWidth / laneCount;
    }
    
    /**
     * Get X coordinate of lane center
     */
    getLaneCenter(lane) {
        if (lane < 0 || lane >= this.laneCount) {
            console.warn(`Invalid lane ${lane}, clamping to valid range`);
            lane = Math.max(0, Math.min(this.laneCount - 1, lane));
        }
        return this.laneWidth * lane + this.laneWidth / 2;
    }
    
    /**
     * Get lane number from X coordinate
     */
    getLaneFromX(x) {
        const lane = Math.floor(x / this.laneWidth);
        return Math.max(0, Math.min(this.laneCount - 1, lane));
    }
    
    /**
     * Get offset position for sign placement at curb edge
     * Signs should be placed at lane edges, not centers
     */
    signPositionForTile(lane, side = 'right') {
        const laneCenter = this.getLaneCenter(lane);
        const offset = this.laneWidth * 0.45; // Near edge but not on lane line
        
        if (side === 'right') {
            return laneCenter + offset;
        } else {
            return laneCenter - offset;
        }
    }
    
    /**
     * Get turning path points for curved tiles
     */
    getTurningPath(fromLane, toLane, curveType = 'smooth') {
        const startX = this.getLaneCenter(fromLane);
        const endX = this.getLaneCenter(toLane);
        const points = [];
        
        if (curveType === 'smooth') {
            // Generate bezier-like curve points
            const steps = 10;
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                // Simple quadratic interpolation
                const x = startX + (endX - startX) * t;
                const y = t; // Normalized 0-1, caller scales to actual distance
                points.push({ x, y, lane: fromLane + (toLane - fromLane) * t });
            }
        } else {
            // Linear path
            points.push({ x: startX, y: 0, lane: fromLane });
            points.push({ x: endX, y: 1, lane: toLane });
        }
        
        return points;
    }
    
    /**
     * Check if position is within lane bounds
     */
    isInLane(x, lane) {
        const laneCenter = this.getLaneCenter(lane);
        const halfWidth = this.laneWidth / 2;
        return x >= laneCenter - halfWidth && x <= laneCenter + halfWidth;
    }
    
    /**
     * Get all lane centers
     */
    getAllLaneCenters() {
        const centers = [];
        for (let i = 0; i < this.laneCount; i++) {
            centers.push(this.getLaneCenter(i));
        }
        return centers;
    }
    
    /**
     * Calculate safe merge distance for lane changes
     */
    getSafeMergeDistance() {
        return this.laneWidth * 2; // Need 2 lane widths of space
    }
}
