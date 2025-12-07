# Tool Cards - Flip Animation Added

## Overview
Added interactive 3D flip animations to all tool cards. When users click a card, it flips to reveal detailed content about that tool.

## Features

### Flip Animation
- **3D Perspective:** Cards flip with realistic 3D effect
- **Smooth Transition:** 0.6 second smooth rotation
- **Two-sided Content:**
  - **Front:** Icon, title, and description
  - **Back:** Detailed information and action button

### Tool Cards with Flip Content

#### 1. 4-7-8 Breathing
**Front:** Icon, title, description  
**Back:** Quick start steps
- Breathe in for 4 counts
- Hold for 7 counts
- Exhale for 8 counts
- Repeat 4 times

#### 2. Panic SOS
**Front:** Icon, title, description  
**Back:** Crisis support information

#### 3. 5-4-3-2-1 Grounding
**Front:** Icon, title, description  
**Back:** Grounding steps
- 5 things you see
- 4 things you touch
- 3 things you hear
- 2 things you smell
- 1 thing you taste

#### 4. Sleep Stories
**Front:** Icon, title, description  
**Back:** Sleep guidance information

#### 5. 1-Minute Calm
**Front:** Icon, title, description  
**Back:** Mindfulness exercise information

#### 6. Anxiety Timer
**Front:** Icon, title, description  
**Back:** Anxiety tracking information

#### 7. Guided Meditation
**Front:** Icon, title, description  
**Back:** Meditation guidance information

## HTML Structure

### Card Wrapper
```html
<div class="tool-card-wrapper" onclick="flipCard(this)">
    <div class="tool-card">
        <!-- Front Side -->
        <div class="card-front">
            <div class="tool-icon">
                <i class="fas fa-wind"></i>
            </div>
            <h3>4-7-8 Breathing</h3>
            <p>Proven technique to reduce anxiety</p>
        </div>
        
        <!-- Back Side -->
        <div class="card-back">
            <h4>Quick Start</h4>
            <ul>
                <li>Breathe in for 4 counts</li>
                <li>Hold for 7 counts</li>
                <li>Exhale for 8 counts</li>
                <li>Repeat 4 times</li>
            </ul>
            <button class="btn btn-secondary" onclick="startBreathing(event)">Start Exercise</button>
        </div>
    </div>
</div>
```

## CSS Implementation

### Perspective & Transform
```css
.tool-card-wrapper {
    perspective: 1000px;
    cursor: pointer;
    height: 100%;
}

.tool-card {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}

.tool-card-wrapper.flipped .tool-card {
    transform: rotateY(180deg);
}
```

### Card Sides
```css
.card-front,
.card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    text-align: center;
}

.card-front {
    background: white;
    border-radius: 15px;
    box-shadow: var(--shadow);
}

.card-back {
    background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
    border-radius: 15px;
    box-shadow: var(--shadow);
    transform: rotateY(180deg);
}
```

## JavaScript Function

```javascript
// Tool Card Flip Animation
function flipCard(element) {
    const wrapper = element.closest('.tool-card-wrapper');
    wrapper.classList.toggle('flipped');
}
```

**How it works:**
1. User clicks on a card
2. `flipCard()` function is called
3. Finds the `.tool-card-wrapper` parent
4. Toggles the `flipped` class
5. CSS transforms the card 180 degrees
6. Back content becomes visible

## User Interaction

### Click to Flip
- Click any tool card to flip it
- Click again to flip back
- Smooth 3D animation
- Back side shows detailed information
- Button on back side starts the tool

### Visual Feedback
- Cursor changes to pointer on hover
- Smooth transition animation
- Gradient background on back
- Clear, readable content

## Animation Details

| Property | Value |
|----------|-------|
| Transition Duration | 0.6 seconds |
| Transform Style | preserve-3d |
| Rotation Axis | Y-axis (horizontal) |
| Backface Visibility | hidden |
| Perspective | 1000px |

## Styling

### Front Side
- White background
- Shadow effect
- Centered content
- Icon, title, description

### Back Side
- Gradient background (purple to pink)
- Shadow effect
- Centered content
- Detailed information
- Action button

## Files Modified

### index.html
- Updated all 7 tool cards with flip structure
- Added `card-front` and `card-back` divs
- Added detailed content for each card back
- Added `onclick="flipCard(this)"` to wrapper

### styles.css
- Added `.tool-card-wrapper` styles (perspective)
- Added `.tool-card` styles (transform)
- Added `.card-front` and `.card-back` styles
- Added `.tool-card-wrapper.flipped` state
- Added back side content styling

### script.js
- Added `flipCard()` function
- Toggles `flipped` class on wrapper

## Browser Compatibility

✅ Chrome/Edge - Full support  
✅ Firefox - Full support  
✅ Safari - Full support  
✅ Mobile browsers - Full support  

## Testing

✅ Click card to flip  
✅ Click again to flip back  
✅ Animation is smooth  
✅ Content is readable  
✅ Buttons work on back side  
✅ Works on mobile  
✅ Responsive design maintained  

## Summary

**Added:** 3D flip animation to tool cards  
**Effect:** Cards flip on click to reveal detailed content  
**Animation:** Smooth 0.6 second 3D rotation  
**Content:** Each card has front and back sides  
**Interaction:** Click to flip, click again to flip back  

---

**Status:** ✅ Flip Animation Added and Working!

Users can now click any tool card to flip it and see detailed information before starting the exercise.
