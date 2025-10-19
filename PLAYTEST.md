# Baby Driver - Playtest Checklist

## Test Environment
- **Date**: _____________
- **Tester**: _____________
- **Device**: _____________
- **Browser**: _____________
- **Screen Resolution**: _____________
- **Device Pixel Ratio**: _____________

## Pre-test Setup
- [ ] Clear browser cache
- [ ] Clear localStorage (to test first-time tutorial)
- [ ] Check console for errors before starting

## Test Checklist

### 1. Initial Load & Tutorial
- [ ] Game loads without errors
- [ ] Tutorial modal appears on first load
- [ ] Tutorial shows keyboard controls
- [ ] Tutorial shows touch controls
- [ ] Can close tutorial with button
- [ ] Can close tutorial by clicking overlay
- [ ] Help button (❓) appears in top-right corner
- [ ] Help button reopens tutorial

**Screenshot**: Initial tutorial modal
**Notes**: _____________________________________________

### 2. Responsive Layout
- [ ] Canvas fills viewport appropriately
- [ ] No scrollbars appear when game is active
- [ ] Canvas maintains aspect ratio
- [ ] Game elements scale correctly
- [ ] Text is readable at all sizes

**Test Resizing**:
- [ ] Desktop (1920x1080)
- [ ] Tablet portrait (768x1024)
- [ ] Tablet landscape (1024x768)
- [ ] Mobile portrait (375x667)
- [ ] Mobile landscape (667x375)

**Screenshot**: Game at different resolutions
**Notes**: _____________________________________________

### 3. Desktop Controls
- [ ] Up arrow accelerates
- [ ] Down arrow brakes
- [ ] Left arrow changes lanes left
- [ ] Right arrow changes lanes right
- [ ] Q activates left blinker
- [ ] E activates right blinker
- [ ] W turns off blinkers
- [ ] Blinker buttons show active state

**Screenshot**: Blinkers active
**Notes**: _____________________________________________

### 4. Touch Controls (Mobile/Tablet)
- [ ] Touch control buttons visible
- [ ] Buttons positioned correctly (bottom-right)
- [ ] Accelerate button (⬆️) works on touch
- [ ] Brake button (⬇️) works on touch
- [ ] Left button (⬅️) works on touch
- [ ] Right button (➡️) works on touch
- [ ] Buttons show pressed state
- [ ] Buttons release correctly
- [ ] No unwanted scrolling during gameplay

**Screenshot**: Touch controls overlay
**Notes**: _____________________________________________

### 5. Graphics & Visual Quality
- [ ] High-res assets load on high-DPI displays (devicePixelRatio >= 2)
- [ ] Standard assets load on standard displays
- [ ] Car sprite renders clearly
- [ ] Road tiles render correctly
- [ ] Traffic lights are visually distinct
- [ ] Stop signs are clearly visible
- [ ] Crosswalks render at intersections
- [ ] Stop lines visible at intersections

**Screenshot**: Traffic light with active state
**Screenshot**: Intersection with crosswalk
**Notes**: _____________________________________________

### 6. Traffic Light Behavior
- [ ] Traffic lights cycle: green → yellow → red → green
- [ ] Active light pulses/glows
- [ ] Inactive lights are dimmed
- [ ] Pole and housing render correctly
- [ ] Z-ordering: lights appear above road
- [ ] Stopping at red light gives positive feedback
- [ ] Running red light triggers violation

**Screenshot**: Traffic light states
**Notes**: _____________________________________________

### 7. Stop Signs
- [ ] Stop signs placed at curb/edge (not in lane center)
- [ ] Stop sign visible and readable
- [ ] Stopping completely registers correctly
- [ ] Stop for ~0.5 seconds required
- [ ] Running stop sign triggers violation
- [ ] Proper stop gives positive feedback
- [ ] Signs don't overlap

**Screenshot**: Stop sign placement
**Notes**: _____________________________________________

### 8. Road System & Intersections
- [ ] Straight road sections render
- [ ] Road curves render (if implemented)
- [ ] T-intersections render correctly
- [ ] Cross intersections render correctly
- [ ] Crosswalks appear at intersections
- [ ] Stop lines appear at intersections
- [ ] Lane markings scroll smoothly
- [ ] Road edges clearly defined

**Screenshot**: Different road types
**Notes**: _____________________________________________

### 9. Lane Changes & Blinkers
- [ ] Can change from left to center lane
- [ ] Can change from center to right lane
- [ ] Can change from right to center lane
- [ ] Can change from center to left lane
- [ ] Changing lanes without blinker triggers violation
- [ ] Changing lanes with correct blinker gives positive feedback
- [ ] Lane transitions are smooth

**Screenshot**: Lane change sequence
**Notes**: _____________________________________________

### 10. HUD & Score Display
- [ ] Score displays and updates correctly
- [ ] Violations counter displays and updates
- [ ] Messages appear for good behavior
- [ ] Messages appear for violations
- [ ] Message colors appropriate (green=good, red=bad)
- [ ] Messages auto-dismiss after timeout

**Screenshot**: HUD with message
**Notes**: _____________________________________________

### 11. Performance
- [ ] Game runs at stable 60 FPS on desktop
- [ ] Game runs smoothly on mobile (30+ FPS)
- [ ] No frame drops during gameplay
- [ ] No memory leaks (check DevTools)
- [ ] CPU usage reasonable (<50% on modern hardware)
- [ ] No visual glitches or artifacts

**Performance Notes**: _____________________________________________

### 12. Edge Cases & Bugs
- [ ] Multiple rapid lane changes handled correctly
- [ ] Quick blinker on/off switches work
- [ ] Signs recycle properly when off-screen
- [ ] No crashes during extended play (5+ minutes)
- [ ] Intersection spawning doesn't cause issues
- [ ] Collision detection works accurately

**Bugs Found**: _____________________________________________

## Repro Steps for Major Issues

### Issue 1:
**Title**: _____________________________________________
**Severity**: Critical / High / Medium / Low
**Steps to Reproduce**:
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

**Expected**: _____________________________________________
**Actual**: _____________________________________________
**Screenshot**: _____________________________________________

### Issue 2:
**Title**: _____________________________________________
**Severity**: Critical / High / Medium / Low
**Steps to Reproduce**:
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

**Expected**: _____________________________________________
**Actual**: _____________________________________________
**Screenshot**: _____________________________________________

## Required Screenshots
Please attach screenshots for:
1. ✅ Initial tutorial modal
2. ✅ Game running on desktop
3. ✅ Game running on mobile
4. ✅ Traffic light with pulsing effect
5. ✅ Intersection with crosswalk and stop lines
6. ✅ Stop sign placement (at curb, not lane center)
7. ✅ Touch controls overlay (mobile)
8. ✅ HUD with positive feedback message
9. ✅ HUD with violation message
10. ✅ Different road types/intersections

## Acceptance Criteria Summary

### Must Pass
- [ ] No critical bugs or crashes
- [ ] Game loads and runs on Chrome desktop
- [ ] Game loads and runs on mobile Chrome/Safari
- [ ] Responsive design works (no scrollbars during gameplay)
- [ ] Touch controls work on mobile
- [ ] Keyboard controls work on desktop
- [ ] Tutorial appears on first load
- [ ] Traffic lights cycle correctly
- [ ] Stop signs placed correctly (at curb)
- [ ] Crosswalks and stop lines render at intersections
- [ ] Score and violations track correctly
- [ ] High-res assets load on high-DPI screens

### Should Pass
- [ ] Performance is smooth (>30 FPS)
- [ ] Visual polish (pulsing lights, smooth animations)
- [ ] All intersection types render
- [ ] Lane change detection with blinkers
- [ ] Help button accessible

## Final Sign-off
- [ ] All critical items pass
- [ ] All required screenshots attached
- [ ] Performance is acceptable
- [ ] Ready for release

**Tester Signature**: _____________________________________________
**Date**: _____________________________________________
