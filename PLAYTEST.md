# Baby Driver - Manual Playtest Checklist

## Purpose
This document provides a manual test checklist for verifying the Baby Driver game functionality before release.

## Test Environment
- **Date:** _____________
- **Tester:** _____________
- **Browser:** _____________
- **Device:** _____________
- **Screen Resolution:** _____________
- **DevicePixelRatio:** _____________

## Pre-Test Setup
1. [ ] Open `index.html` in a web browser
2. [ ] Open browser console (F12) to check for errors
3. [ ] Verify no console errors on page load

## Visual/Layout Tests

### Desktop (Chrome/Firefox/Safari)
- [ ] Page loads without scrollbars
- [ ] Canvas fills viewport appropriately
- [ ] UI elements (header, score, controls) are visible
- [ ] Tutorial modal appears on first load
- [ ] Help icon (?) is visible in top-right corner
- [ ] On-screen touch controls appear (if enabled)

### Mobile/Tablet (iOS Safari, Android Chrome)
- [ ] Page scales correctly to device screen
- [ ] No horizontal scrolling
- [ ] Canvas is appropriately sized
- [ ] Touch controls overlay is visible and positioned well
- [ ] All UI elements remain accessible
- [ ] Tutorial is readable and scrollable

## Responsive Behavior Tests
- [ ] Resize browser window - canvas resizes smoothly
- [ ] No layout breaks at various sizes (320px to 2560px wide)
- [ ] Game continues to function after resize
- [ ] DevicePixelRatio scaling works (check on Retina/high-DPI display)

## Control Tests

### Keyboard Controls (Desktop)
- [ ] Arrow Up: Car accelerates
- [ ] Arrow Down: Car brakes/decelerates
- [ ] Arrow Left: Car moves to left lane (with proper warning if no blinker)
- [ ] Arrow Right: Car moves to right lane (with proper warning if no blinker)
- [ ] Q key: Left blinker activates
- [ ] E key: Right blinker activates
- [ ] W key: Blinkers turn off

### Touch Controls (Mobile/Desktop)
- [ ] ⬆️ button: Car accelerates
- [ ] ⬇️ button: Car brakes
- [ ] ⬅️ button: Car changes lanes left
- [ ] ➡️ button: Car changes lanes right
- [ ] Blinker buttons work correctly
- [ ] Multiple simultaneous touches work (accelerate + turn)

## Gameplay Tests

### Traffic Rules - Stop Signs
- [ ] Stop signs appear on road
- [ ] Stop signs are placed at curb edge, not in lane center
- [ ] Coming to complete stop at stop sign: Score increases, "Good job" message
- [ ] Running through stop sign: Violation increases, warning message
- [ ] Stop sign violation only counted once per sign

### Traffic Rules - Traffic Lights
- [ ] Traffic lights appear on road
- [ ] Lights cycle through red → green → yellow → red
- [ ] Pulsing/glow effect visible on active light
- [ ] Stopping at red light: No violation
- [ ] Running red light: Violation increases, warning message
- [ ] Running yellow light: Violation increases, warning message
- [ ] Passing through green light: Small score increase

### Traffic Rules - Blinkers
- [ ] Changing lanes without blinker: Violation, warning message
- [ ] Changing lanes with correct blinker: Score increase, "Good job" message
- [ ] Visual blinker indicator appears on player car
- [ ] Blinker buttons update visual state when pressed

### Road System
- [ ] Road tiles generate continuously
- [ ] Straight road sections appear
- [ ] Curved road sections appear (if implemented)
- [ ] T-intersections appear (if implemented)
- [ ] Cross intersections appear (if implemented)
- [ ] Crosswalks visible at intersections
- [ ] Stop lines visible at intersections
- [ ] Lane markings clearly visible
- [ ] Road edges clearly marked

## Asset Loading Tests
- [ ] On high-DPI display (devicePixelRatio >= 2): Check console for highres asset attempts
- [ ] On standard display: Fallback assets load correctly
- [ ] No broken images or missing assets
- [ ] Asset loading doesn't block game start

## Tutorial/Help Tests
- [ ] Tutorial modal shows on first visit
- [ ] Tutorial content is readable and formatted correctly
- [ ] "Got it!" button closes tutorial
- [ ] Tutorial is marked as shown in localStorage
- [ ] Help icon (?) reopens tutorial when clicked
- [ ] Tutorial can be dismissed by clicking backdrop

## Performance Tests
- [ ] Game runs at smooth 60fps (or close) on target device
- [ ] No visible stuttering or lag during gameplay
- [ ] Memory usage stays reasonable (check browser DevTools)
- [ ] No memory leaks after extended play (10+ minutes)

## Error Handling Tests
- [ ] Game recovers gracefully from window blur/focus
- [ ] No crashes when rapidly pressing keys
- [ ] No crashes when rapidly touching controls
- [ ] Missing asset fallback works without crashing

## Cross-Browser Compatibility
- [ ] Chrome (desktop): All features work
- [ ] Firefox (desktop): All features work
- [ ] Safari (desktop): All features work
- [ ] Edge (desktop): All features work
- [ ] Safari (iOS): All features work
- [ ] Chrome (Android): All features work

## Screenshots/Notes

### Screenshot 1: Initial Load
_Attach or describe screenshot here_

### Screenshot 2: Gameplay with Traffic
_Attach or describe screenshot here_

### Screenshot 3: Tutorial Modal
_Attach or describe screenshot here_

### Screenshot 4: Mobile View
_Attach or describe screenshot here_

## Issues Found
| Issue # | Severity | Description | Steps to Reproduce | Status |
|---------|----------|-------------|-------------------|---------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

## Test Result Summary
- **Total Tests:** _____
- **Passed:** _____
- **Failed:** _____
- **Blocked:** _____

## Sign-Off
- [ ] All critical tests passed
- [ ] All known issues documented
- [ ] Ready for release: YES / NO

**Tester Signature:** _____________________ **Date:** _____________

## Follow-Up Items
1. 
2. 
3. 
