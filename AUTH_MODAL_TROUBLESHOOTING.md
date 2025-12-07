# Auth Modal Troubleshooting Guide

## Problem
Login form is not appearing when the page loads.

## Solutions

### Solution 1: Clear Browser Cache & localStorage

**Option A: Automatic (Code)**
1. Open `index.html` in a text editor
2. Find line 1047: `// localStorage.clear();`
3. Uncomment it: `localStorage.clear();`
4. Refresh the page
5. Auth modal should appear
6. Comment it back out after testing

**Option B: Manual (Browser)**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Type: `localStorage.clear()`
4. Press Enter
5. Refresh the page
6. Auth modal should appear

**Option C: Browser Settings**
1. Open browser settings
2. Find "Clear browsing data"
3. Select "Cookies and cached images and files"
4. Click "Clear"
5. Refresh the page

### Solution 2: Check Browser Console

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for these messages:
   - `Page loaded` ✓
   - `isLoggedIn: null` or `isLoggedIn: false` ✓
   - `Auth modal element: [div#authModal]` ✓
   - `Auth modal should be visible now` ✓

If you don't see these messages, there's a JavaScript error.

### Solution 3: Check CSS

1. Open Developer Tools (F12)
2. Go to Elements/Inspector tab
3. Find the `#authModal` element
4. Check its styles:
   - Should have `display: flex` ✓
   - Should have `z-index: 2000` ✓
   - Should have `position: fixed` ✓

### Solution 4: Force Reset

Add this to your browser console:
```javascript
// Clear all storage
localStorage.clear();
sessionStorage.clear();

// Reload page
location.reload();
```

### Solution 5: Check HTML Structure

Verify the auth modal is in the HTML:
1. Open `index.html`
2. Check line 12: `<div id="authModal" class="modal active">`
3. Should have `class="modal active"`
4. Should have `id="authModal"`

---

## How Auth Modal Should Work

### On First Visit
```
Page Load
    ↓
Check localStorage.isLoggedIn
    ↓
It's empty/null
    ↓
Auth modal gets 'active' class
    ↓
Auth modal style.display = 'flex'
    ↓
Auth modal appears ✓
```

### After Login
```
User fills form
    ↓
Click Login/Signup
    ↓
localStorage.setItem('isLoggedIn', 'true')
    ↓
closeAuthModal() called
    ↓
Modal gets 'active' class removed
    ↓
Website appears ✓
```

### On Return Visit
```
Page Load
    ↓
Check localStorage.isLoggedIn
    ↓
It's 'true'
    ↓
Auth modal removed
    ↓
Website appears directly ✓
```

---

## Debug Steps

### Step 1: Check if Modal Exists
```javascript
// In browser console
const modal = document.getElementById('authModal');
console.log('Modal exists:', !!modal);
console.log('Modal HTML:', modal.outerHTML.substring(0, 100));
```

### Step 2: Check Modal Visibility
```javascript
// In browser console
const modal = document.getElementById('authModal');
const styles = window.getComputedStyle(modal);
console.log('Display:', styles.display);
console.log('Visibility:', styles.visibility);
console.log('Opacity:', styles.opacity);
console.log('Z-index:', styles.zIndex);
```

### Step 3: Force Show Modal
```javascript
// In browser console
const modal = document.getElementById('authModal');
modal.classList.add('active');
modal.style.display = 'flex';
modal.style.visibility = 'visible';
modal.style.opacity = '1';
console.log('Modal forced to show');
```

### Step 4: Check localStorage
```javascript
// In browser console
console.log('All localStorage:');
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(key, ':', localStorage.getItem(key));
}
```

---

## Common Issues & Fixes

### Issue 1: Modal Hidden Behind Website
**Fix:** Clear localStorage and refresh
```javascript
localStorage.clear();
location.reload();
```

### Issue 2: Modal Not Centered
**Fix:** Check CSS for `.modal.active`
- Should have `display: flex`
- Should have `align-items: center`
- Should have `justify-content: center`

### Issue 3: Modal Appears Then Disappears
**Fix:** Check if `isLoggedIn` is set to true
```javascript
localStorage.removeItem('isLoggedIn');
location.reload();
```

### Issue 4: Buttons Not Working
**Fix:** Check if JavaScript functions are defined
```javascript
console.log('selectUserType:', typeof selectUserType);
console.log('handleLogin:', typeof handleLogin);
console.log('handleSignup:', typeof handleSignup);
```

### Issue 5: Form Not Submitting
**Fix:** Check browser console for errors
- Open F12
- Go to Console tab
- Look for red error messages
- Fix the errors

---

## Quick Reset Instructions

### For Testing
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Copy and paste:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```
4. Press Enter
5. Page will reload with auth modal visible

### For Production
1. Users should clear browser cache
2. Or use incognito/private browsing mode
3. Or try a different browser

---

## Files to Check

### index.html
- Line 12: Auth modal should have `class="modal active"`
- Line 1044-1066: Debug script should be present
- Line 1067: `script.js` should be loaded

### script.js
- Line 135-156: DOMContentLoaded event handler
- Line 20-24: selectUserType function
- Line 54-76: handleLogin function
- Line 78-108: handleSignup function

### styles.css
- Line 2084-2089: `#authModal.modal.active` styles
- Line 2265-2282: `.modal` and `.modal.active` styles
- Line 2317-2330: `.navbar` and `.section` visibility

---

## Testing Checklist

- [ ] Clear localStorage
- [ ] Refresh page
- [ ] Auth modal appears
- [ ] "Who are you?" visible
- [ ] Client button clickable
- [ ] Doctor button clickable
- [ ] Login form appears
- [ ] Signup form appears
- [ ] Guest button clickable
- [ ] Form submission works
- [ ] Website appears after auth
- [ ] Returning users bypass auth

---

## Summary

**If auth modal still doesn't appear:**

1. **Clear localStorage:** `localStorage.clear()`
2. **Check console:** F12 → Console tab
3. **Force show modal:** Copy debug code above
4. **Check HTML:** Verify modal exists in HTML
5. **Check CSS:** Verify modal styles are correct
6. **Check JavaScript:** Verify functions are defined

---

**Status:** Follow these steps to troubleshoot auth modal display issues

**Last Updated:** 2024
