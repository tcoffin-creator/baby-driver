// Lane management and path calculation
export class LaneManager {
    constructor(canvasWidth, laneCount = 3) {
        this.canvasWidth = canvasWidth;
        this.laneCount = laneCount;
        this.laneWidth = canvasWidth / laneCount;
    }
    
    getLaneX(laneIndex) {
        // Get the center X position of a lane
        if (laneIndex < 0 || laneIndex >= this.laneCount) {
            laneIndex = Math.max(0, Math.min(this.laneCount - 1, laneIndex));
        }
        return this.laneWidth * laneIndex + this.laneWidth / 2;
    }
    
    getLaneIndex(x) {
        // Get the lane index for a given X position
        const lane = Math.floor(x / this.laneWidth);
        return Math.max(0, Math.min(this.laneCount - 1, lane));
    }
    
    getLaneCenterPoints(laneIndex) {
        // Get centerline points for a lane (for AI pathfinding)
        const x = this.getLaneX(laneIndex);
        return {
            x: x,
            leftEdge: x - this.laneWidth / 2,
            rightEdge: x + this.laneWidth / 2,
            width: this.laneWidth
        };
    }
    
    getSignPlacementOffset(laneIndex, side = 'auto') {
        // Get X offset for placing signs at curb/edge instead of lane center
        const laneInfo = this.getLaneCenterPoints(laneIndex);
        
        if (side === 'left') {
            return laneInfo.leftEdge - 30; // 30px from edge
        } else if (side === 'right') {
            return laneInfo.rightEdge + 30;
        } else {
            // Auto - place on appropriate side based on lane
            if (laneIndex === 0) {
                return laneInfo.leftEdge - 30; // Leftmost lane - place on left curb
            } else if (laneIndex === this.laneCount - 1) {
                return laneInfo.rightEdge + 30; // Rightmost lane - place on right curb
            } else {
                // Middle lanes - alternate or place on right
                return laneInfo.rightEdge + 10;
            }
        }
    }
    
    getTurningPath(fromLane, toLane, startY, endY, turnType = 'straight') {
        // Generate a smooth path for lane changes or turns
        const fromX = this.getLaneX(fromLane);
        const toX = this.getLaneX(toLane);
        const points = [];
        const steps = 20;
        
        if (turnType === 'straight') {
            // Simple linear interpolation for lane changes
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const easedT = this.easeInOutCubic(t);
                points.push({
                    x: fromX + (toX - fromX) * easedT,
                    y: startY + (endY - startY) * t
                });
            }
        } else if (turnType === 'left' || turnType === 'right') {
            // Curved path for intersections
            const direction = turnType === 'left' ? -1 : 1;
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const angle = t * Math.PI / 2 * direction;
                const radius = Math.abs(toX - fromX) || this.laneWidth;
                points.push({
                    x: fromX + Math.sin(angle) * radius * direction,
                    y: startY + (1 - Math.cos(angle)) * radius + (endY - startY) * t
                });
            }
        }
        
        return points;
    }
    
    easeInOutCubic(t) {
        // Smooth easing function for lane transitions
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    isValidLane(laneIndex) {
        return laneIndex >= 0 && laneIndex < this.laneCount;
    }
    
    getClosestLane(x) {
        const lane = this.getLaneIndex(x);
        return lane;
    }
    
    getLaneOffset(x, laneIndex) {
        // Get how far the position is from the lane center
        const laneCenter = this.getLaneX(laneIndex);
        return x - laneCenter;
    }
}

export class IntersectionLane {
    constructor(intersection, entry, exit) {
        this.intersection = intersection;
        this.entryDirection = entry; // 'north', 'south', 'east', 'west'
        this.exitDirection = exit;
        this.turnType = this.calculateTurnType();
    }
    
    calculateTurnType() {
        const directions = ['north', 'east', 'south', 'west'];
        const entryIndex = directions.indexOf(this.entryDirection);
        const exitIndex = directions.indexOf(this.exitDirection);
        
        if (entryIndex === exitIndex) {
            return 'uturn';
        }
        
        const diff = (exitIndex - entryIndex + 4) % 4;
        
        if (diff === 2) return 'straight';
        if (diff === 1) return 'right';
        if (diff === 3) return 'left';
        
        return 'straight';
    }
    
    getPath(startPoint, endPoint) {
        // Generate path through intersection based on turn type
        const points = [];
        const steps = 15;
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            let x, y;
            
            if (this.turnType === 'straight') {
                x = startPoint.x + (endPoint.x - startPoint.x) * t;
                y = startPoint.y + (endPoint.y - startPoint.y) * t;
            } else if (this.turnType === 'left') {
                // Left turn arc
                const angle = t * Math.PI / 2 - Math.PI / 2;
                const radius = Math.abs(endPoint.x - startPoint.x) || 100;
                x = startPoint.x + radius * (Math.cos(angle) + 1) / 2;
                y = startPoint.y + radius * (Math.sin(angle) + 1);
            } else if (this.turnType === 'right') {
                // Right turn arc
                const angle = t * Math.PI / 2;
                const radius = Math.abs(endPoint.x - startPoint.x) || 100;
                x = startPoint.x + radius * Math.sin(angle);
                y = startPoint.y + radius * (1 - Math.cos(angle));
            } else {
                // Default straight
                x = startPoint.x + (endPoint.x - startPoint.x) * t;
                y = startPoint.y + (endPoint.y - startPoint.y) * t;
            }
            
            points.push({ x, y });
        }
        
        return points;
    }
}
