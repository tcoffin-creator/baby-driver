# Baby Driver - Playtest Checklist

## Test Environment Setup

### Prerequisites
- [ ] Web browser (Chrome, Firefox, Safari, or Edge)
- [ ] Test on desktop and mobile devices
- [ ] Test on both standard and high-DPI displays

### How to Run
1. Open `index.html` in a web browser
2. Or use a local server: `python -m http.server 8000` or `npx serve`
3. Navigate to `http://localhost:8000`

## Visual Tests

### Graphics & Rendering
- [ ] Canvas displays correctly at different screen sizes
- [ ] Road tiles render properly (straight sections, curves, intersections)
- [ ] Lane markings are visible and properly aligned
- [ ] Crosswalks appear at intersections
- [ ] Stop lines appear before intersections
- [ ] Player car renders correctly with proper colors
- [ ] Traffic lights render with pole and housing
- [ ] Traffic lights pulse/glow when active
- [ ] Traffic signs (stop, yield, etc.) render at curb edges
- [ ] Signs don't spawn too close together (collision avoidance)
- [ ] Bloom effect works when enabled (if applicable)

### High-Resolution Assets
- [ ] On high-DPI display (Retina, 4K): Check if high-res assets load
- [ ] Assets look sharp on high-DPI displays
- [ ] Fallback to standard assets works when high-res unavailable
- [ ] SVG placeholders render correctly

## Responsive Design Tests

### Canvas Sizing
- [ ] Canvas resizes correctly when window is resized
- [ ] Canvas respects devicePixelRatio for sharp rendering
- [ ] Body scroll is prevented (no bouncing on mobile)
- [ ] Canvas stays within viewport bounds

### Mobile & Touch
- [ ] Touch controls overlay appears on mobile
- [ ] Touch buttons respond to touch events
- [ ] Touch buttons provide visual feedback (pressed state)
- [ ] Pointer events work with mouse on desktop
- [ ] No accidental scrolling when using touch controls
- [ ] Game is playable on phone in portrait mode
- [ ] Game is playable on tablet in landscape mode

### Responsive Breakpoints
- [ ] Desktop (> 768px): Full layout works
- [ ] Tablet (481-768px): Layout adjusts appropriately
- [ ] Phone (< 480px): Layout is compact but usable
- [ ] Tutorial modal is readable at all screen sizes
- [ ] Help icon is accessible at all screen sizes

## Control Tests

### Keyboard Controls
- [ ] Arrow Up accelerates the car
- [ ] Arrow Down brakes the car
- [ ] Arrow Left changes lane left
- [ ] Arrow Right changes lane right
- [ ] Q activates left blinker
- [ ] E activates right blinker
- [ ] WASD keys work as alternative to arrow keys
- [ ] Keyboard events don't cause page scrolling

### Touch Controls
- [ ] Touch up button accelerates
- [ ] Touch down button brakes
- [ ] Touch left button changes lane left
- [ ] Touch right button changes lane right
- [ ] Multiple simultaneous touches work (e.g., accelerate while turning)
- [ ] Touch controls work on both iOS and Android

### Control Feedback
- [ ] Blinker buttons show active state (animation/highlight)
- [ ] Blinker indicators appear on player car
- [ ] Car smoothly transitions between lanes
- [ ] Speed changes feel responsive
- [ ] No input lag or delay

## Tutorial & Onboarding

### Tutorial Modal
- [ ] Tutorial modal appears on first visit
- [ ] Help icon (?) is visible in corner
- [ ] Clicking help icon shows tutorial
- [ ] Tutorial explains all controls clearly
- [ ] Tutorial explains all traffic rules
- [ ] Tutorial is readable and well-formatted
- [ ] Close button dismisses tutorial
- [ ] Clicking outside modal dismisses it
- [ ] Tutorial doesn't show again after first dismissal (localStorage)
- [ ] Can manually open tutorial again via help icon

## Gameplay Tests

### Traffic Rules
- [ ] Stop signs require full stop
- [ ] Traffic lights change: Green → Yellow → Red → Green
- [ ] Red light violations are detected
- [ ] Yellow light violations are detected (should stop)
- [ ] Running stop sign is detected
- [ ] Using blinker before lane change earns points
- [ ] Not using blinker before lane change causes violation
- [ ] Score increases for following rules
- [ ] Violations counter increases for breaking rules
- [ ] Messages display for violations and good behavior

### Road Generation
- [ ] Road generates with varied layouts
- [ ] Intersections appear periodically
- [ ] Curves are smooth and drivable
- [ ] T-junctions render correctly
- [ ] Crossroads (4-way intersections) render correctly
- [ ] Road tiles connect properly (no gaps)
- [ ] Lane centers are properly calculated for pathfinding

### Signs & Signals
- [ ] Traffic signs spawn at curb edge (not in lane center)
- [ ] Signs don't overlap each other
- [ ] Signs visible from a reasonable distance
- [ ] Stop signs placed before intersections
- [ ] Traffic lights placed at appropriate locations
- [ ] Multiple signs can exist simultaneously

### Performance
- [ ] Game runs at smooth 60 FPS on desktop
- [ ] Game runs smoothly on mobile devices
- [ ] No stuttering during lane changes
- [ ] No lag when many objects on screen
- [ ] Bloom effect doesn't cause significant FPS drop (if enabled)

## Edge Cases & Bugs

### Boundary Conditions
- [ ] Can't change lanes beyond road edges
- [ ] Car stays within lane boundaries
- [ ] Objects recycle properly when off-screen
- [ ] No crashes when resizing window rapidly
- [ ] No errors in browser console

### Collision Detection
- [ ] Traffic light detection works in correct lane only
- [ ] Stop sign detection works in correct lane only
- [ ] No false positives for violations in other lanes
- [ ] Detection zones are reasonable size

### State Management
- [ ] Score persists during gameplay
- [ ] Violations count correctly
- [ ] Blinker state updates correctly
- [ ] Game can be reset/restarted
- [ ] No memory leaks during extended play

## Build & Deployment Tests

### Build Process (if package.json exists)
- [ ] `npm install` completes without errors
- [ ] `npm run assets:pack` runs successfully (if applicable)
- [ ] `npm run build:release` creates production build (if applicable)
- [ ] Built files work correctly
- [ ] No missing dependencies

### File Structure
- [ ] All source files in correct directories
- [ ] Assets organized properly
- [ ] No broken import/export statements
- [ ] README files present and accurate

## Reproduction Steps for Common Issues

### Issue: Controls not responding
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify event listeners are attached
4. Try both keyboard and touch controls
5. Reload page and test again

### Issue: Canvas not rendering
1. Check if canvas element exists in DOM
2. Verify canvas has width/height set
3. Check devicePixelRatio calculations
4. Look for WebGL/Canvas 2D context errors
5. Test in different browser

### Issue: Touch controls not working on mobile
1. Check if touch-action: none is applied
2. Verify touch event listeners use passive: false
3. Test pointer events as fallback
4. Check viewport meta tag settings
5. Test on different mobile browsers

### Issue: High-res assets not loading
1. Check devicePixelRatio value
2. Verify assets/highres directory exists
3. Check asset file paths in loader
4. Test fallback to standard assets
5. Check browser network tab for 404 errors

### Issue: Tutorial modal not appearing
1. Clear browser localStorage
2. Reload page
3. Check if modal element exists in DOM
4. Verify CSS display property
5. Click help icon to manually trigger

## Test Results Summary

Date: _______________
Tester: _______________
Browser/Device: _______________
Display Type: [ ] Standard [ ] High-DPI

Overall Result: [ ] Pass [ ] Fail [ ] Pass with Issues

Critical Issues Found:
_______________________________________
_______________________________________
_______________________________________

Minor Issues Found:
_______________________________________
_______________________________________
_______________________________________

Notes:
_______________________________________
_______________________________________
_______________________________________
