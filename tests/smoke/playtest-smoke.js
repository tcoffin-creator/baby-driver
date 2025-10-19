// Automated smoke tests for Baby Driver
// These tests verify basic functionality without requiring a full browser

/**
 * Smoke Test Suite
 * 
 * These tests verify:
 * 1. Module imports work
 * 2. Classes instantiate without errors
 * 3. Basic methods execute successfully
 * 4. Configuration options are respected
 */

// Mock DOM environment for Node.js testing
function createMockCanvas() {
    return {
        width: 800,
        height: 500,
        style: {},
        parentElement: {
            clientWidth: 800,
            clientHeight: 500
        },
        getContext: () => ({
            scale: () => {},
            fillStyle: '',
            fillRect: () => {},
            strokeStyle: '',
            strokeRect: () => {},
            beginPath: () => {},
            moveTo: () => {},
            lineTo: () => {},
            arc: () => {},
            fill: () => {},
            stroke: () => {},
            closePath: () => {},
            save: () => {},
            restore: () => {},
            setLineDash: () => {},
            drawImage: () => {},
            createRadialGradient: () => ({
                addColorStop: () => {}
            })
        })
    };
}

function createMockWindow() {
    return {
        devicePixelRatio: 2,
        addEventListener: () => {},
        removeEventListener: () => {}
    };
}

function createMockDocument() {
    return {
        createElement: (tag) => ({
            id: '',
            innerHTML: '',
            textContent: '',
            style: {},
            appendChild: () => {},
            querySelectorAll: () => [],
            addEventListener: () => {},
            removeEventListener: () => {}
        }),
        body: {
            appendChild: () => {},
            removeChild: () => {}
        },
        documentElement: {
            style: {}
        }
    };
}

// Set up mocks if running in Node
if (typeof window === 'undefined') {
    global.window = createMockWindow();
    global.document = createMockDocument();
    global.localStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
    };
}

// Test results
const results = {
    passed: 0,
    failed: 0,
    tests: []
};

function test(name, fn) {
    try {
        fn();
        results.passed++;
        results.tests.push({ name, status: 'PASS' });
        console.log(`✓ ${name}`);
    } catch (error) {
        results.failed++;
        results.tests.push({ name, status: 'FAIL', error: error.message });
        console.error(`✗ ${name}`);
        console.error(`  ${error.message}`);
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
}

console.log('\n🧪 Running Baby Driver Smoke Tests...\n');

// Test 1: Lane Manager
test('LaneManager: Initializes with correct lane count', () => {
    const { LaneManager } = require('../../src/road/lane.js');
    const lm = new LaneManager(800, 3);
    assert(lm.laneCount === 3, 'Should have 3 lanes');
    assert(lm.laneWidth === 800 / 3, 'Lane width should be canvas width / 3');
});

test('LaneManager: Gets correct lane X positions', () => {
    const { LaneManager } = require('../../src/road/lane.js');
    const lm = new LaneManager(900, 3);
    const lane0 = lm.getLaneX(0);
    const lane1 = lm.getLaneX(1);
    const lane2 = lm.getLaneX(2);
    
    assert(lane0 === 150, `Lane 0 should be at 150, got ${lane0}`);
    assert(lane1 === 450, `Lane 1 should be at 450, got ${lane1}`);
    assert(lane2 === 750, `Lane 2 should be at 750, got ${lane2}`);
});

test('LaneManager: Sign placement offset is not in lane center', () => {
    const { LaneManager } = require('../../src/road/lane.js');
    const lm = new LaneManager(900, 3);
    const laneCenter = lm.getLaneX(0);
    const signOffset = lm.getSignPlacementOffset(0);
    
    assert(signOffset !== laneCenter, 'Sign should not be placed at lane center');
});

// Test 2: Road Tiles
test('RoadTile: Creates with correct properties', () => {
    const { RoadTile, TileType } = require('../../src/road/roadTiles.js');
    const tile = new RoadTile(TileType.STRAIGHT, 0, 0, 0);
    
    assert(tile.type === TileType.STRAIGHT, 'Tile type should be STRAIGHT');
    assert(tile.x === 0, 'X position should be 0');
    assert(tile.y === 0, 'Y position should be 0');
    assert(Array.isArray(tile.lanes), 'Lanes should be an array');
});

test('RoadTile: Has correct connections', () => {
    const { RoadTile, TileType, Direction } = require('../../src/road/roadTiles.js');
    const straightTile = new RoadTile(TileType.STRAIGHT, 0, 0, 0);
    const crossTile = new RoadTile(TileType.CROSS_INTERSECTION, 0, 0, 0);
    
    assert(straightTile.connections.length === 2, 'Straight tile should have 2 connections');
    assert(crossTile.connections.length === 4, 'Cross intersection should have 4 connections');
});

// Test 3: Road Generator
test('RoadGenerator: Generates road with correct length', () => {
    const { RoadGenerator } = require('../../src/road/roadGenerator.js');
    const generator = new RoadGenerator();
    const graph = generator.generateRoad(10);
    
    assert(graph.tiles.length === 10, `Should generate 10 tiles, got ${graph.tiles.length}`);
});

// Test 4: Traffic Light
test('EnhancedTrafficLight: Initializes with correct state', () => {
    const { EnhancedTrafficLight } = require('../../src/traffic/trafficLight.js');
    const light = new EnhancedTrafficLight(100, 100, 1);
    
    assert(light.state === 'green', 'Initial state should be green');
    assert(light.x === 100, 'X position should be 100');
    assert(light.y === 100, 'Y position should be 100');
});

test('EnhancedTrafficLight: Updates state correctly', () => {
    const { EnhancedTrafficLight } = require('../../src/traffic/trafficLight.js');
    const light = new EnhancedTrafficLight(100, 100, 1, {
        greenDuration: 10,
        yellowDuration: 5,
        redDuration: 10
    });
    
    assertEqual(light.state, 'green', 'Should start green');
    
    // Update past green duration
    for (let i = 0; i < 11; i++) light.update();
    assertEqual(light.state, 'yellow', 'Should change to yellow');
    
    // Update past yellow duration
    for (let i = 0; i < 6; i++) light.update();
    assertEqual(light.state, 'red', 'Should change to red');
    
    // Update past red duration
    for (let i = 0; i < 11; i++) light.update();
    assertEqual(light.state, 'green', 'Should cycle back to green');
});

// Test 5: Traffic Signs
test('StopSign: Initializes correctly', () => {
    const { StopSign } = require('../../src/traffic/signs.js');
    const sign = new StopSign(100, 200, 1);
    
    assert(sign.type === 'stop', 'Type should be stop');
    assert(sign.playerStopped === false, 'Should not be stopped initially');
});

test('SignPlacementManager: Prevents overlapping signs', () => {
    const { SignPlacementManager } = require('../../src/traffic/signs.js');
    const { LaneManager } = require('../../src/road/lane.js');
    
    const lm = new LaneManager(800, 3);
    const manager = new SignPlacementManager(lm);
    
    const sign1 = manager.placeSign('stop', 1, 100);
    const sign2 = manager.placeSign('stop', 1, 110); // Too close
    
    assert(sign1 !== null, 'First sign should be placed');
    assert(sign2 === null, 'Second sign should not be placed (too close)');
});

// Test 6: Asset Loader
test('AssetLoader: Detects high-DPI screens', () => {
    const { AssetLoader } = require('../../src/loader.js');
    const loader = new AssetLoader();
    
    // Should detect devicePixelRatio from mock window
    assert(typeof loader.useHighRes === 'boolean', 'Should have useHighRes property');
});

// Print summary
console.log('\n' + '='.repeat(50));
console.log(`Test Results: ${results.passed} passed, ${results.failed} failed`);
console.log('='.repeat(50) + '\n');

if (results.failed > 0) {
    console.log('Failed tests:');
    results.tests
        .filter(t => t.status === 'FAIL')
        .forEach(t => console.log(`  - ${t.name}: ${t.error}`));
    process.exit(1);
} else {
    console.log('✅ All tests passed!');
    process.exit(0);
}
