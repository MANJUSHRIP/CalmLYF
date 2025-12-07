# Testing Checklist - Login/Signup System

## Pre-Testing Setup
- [ ] All files saved (index.html, script.js, styles.css)
- [ ] No syntax errors in console
- [ ] Browser cache cleared
- [ ] localStorage cleared (for fresh testing)

---

## Test 1: Initial Page Load

### Expected Behavior:
- Auth modal appears with dark overlay
- "Welcome to CalmLYF" heading visible
- "Select your role to get started" text visible
- Two role buttons visible (Client and Doctor)
- Guest button visible

### Test Steps:
1. [ ] Open index.html in browser
2. [ ] Verify auth modal appears
3. [ ] Verify dark overlay is visible
4. [ ] Verify all buttons are clickable
5. [ ] Verify modal is centered on screen

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 2: Select Client Role

### Expected Behavior:
- User type selection hides
- Login/Signup forms appear
- "Login" tab is active by default
- Login form displays with email and password fields
- Back button appears

### Test Steps:
1. [ ] Click "I'm a Client" button
2. [ ] Verify selection screen disappears
3. [ ] Verify login form appears
4. [ ] Verify email field is visible
5. [ ] Verify password field is visible
6. [ ] Verify back button is visible

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 3: Select Doctor Role

### Expected Behavior:
- User type selection hides
- Login/Signup forms appear
- "Login" tab is active by default
- Login form displays with email and password fields
- Back button appears

### Test Steps:
1. [ ] Click "I'm a Doctor" button
2. [ ] Verify selection screen disappears
3. [ ] Verify login form appears
4. [ ] Verify email field is visible
5. [ ] Verify password field is visible
6. [ ] Verify back button is visible

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 4: Back Button Functionality

### Expected Behavior:
- Returns to user type selection screen
- Forms are hidden
- Role selection buttons are visible again
- Can select a different role

### Test Steps:
1. [ ] Click "I'm a Client"
2. [ ] Click back button (←)
3. [ ] Verify role selection screen appears
4. [ ] Verify forms are hidden
5. [ ] Click "I'm a Doctor" (different role)
6. [ ] Verify Doctor role is selected

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 5: Login Form - Empty Fields

### Expected Behavior:
- Shows error message when submitting empty form
- Error message: "Please fill in all fields"
- Form doesn't submit

### Test Steps:
1. [ ] Select a role (Client or Doctor)
2. [ ] Leave email field empty
3. [ ] Leave password field empty
4. [ ] Click "Login" button
5. [ ] Verify error message appears

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 6: Login Form - Valid Submission

### Expected Behavior:
- Form submits successfully
- Data stored in localStorage
- Auth modal closes
- Website loads with full access
- Navbar is visible
- Home section is visible

### Test Steps:
1. [ ] Select a role
2. [ ] Enter email: test@example.com
3. [ ] Enter password: password123
4. [ ] Click "Login" button
5. [ ] Verify modal closes
6. [ ] Verify website loads
7. [ ] Verify navbar is visible
8. [ ] Verify home section is visible

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 7: Sign Up Tab - Switch from Login

### Expected Behavior:
- Login form hides
- Sign up form appears
- "Sign Up" tab becomes active
- "Login" tab becomes inactive
- Sign up form shows 4 input fields (Name, Email, Password, Confirm)

### Test Steps:
1. [ ] Select a role
2. [ ] Click "Sign Up" tab
3. [ ] Verify login form disappears
4. [ ] Verify sign up form appears
5. [ ] Verify all 4 input fields are visible
6. [ ] Verify "Sign Up" tab is highlighted

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 8: Sign Up Form - Empty Fields

### Expected Behavior:
- Shows error message when submitting empty form
- Error message: "Please fill in all fields"
- Form doesn't submit

### Test Steps:
1. [ ] Select a role
2. [ ] Click "Sign Up" tab
3. [ ] Leave all fields empty
4. [ ] Click "Create Account" button
5. [ ] Verify error message appears

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 9: Sign Up Form - Password Mismatch

### Expected Behavior:
- Shows error message when passwords don't match
- Error message: "Passwords do not match"
- Form doesn't submit

### Test Steps:
1. [ ] Select a role
2. [ ] Click "Sign Up" tab
3. [ ] Enter name: John Doe
4. [ ] Enter email: john@example.com
5. [ ] Enter password: password123
6. [ ] Enter confirm password: password456 (different)
7. [ ] Click "Create Account" button
8. [ ] Verify error message appears

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 10: Sign Up Form - Short Password

### Expected Behavior:
- Shows error message when password is less than 6 characters
- Error message: "Password must be at least 6 characters"
- Form doesn't submit

### Test Steps:
1. [ ] Select a role
2. [ ] Click "Sign Up" tab
3. [ ] Enter name: John Doe
4. [ ] Enter email: john@example.com
5. [ ] Enter password: pass (5 characters)
6. [ ] Enter confirm password: pass
7. [ ] Click "Create Account" button
8. [ ] Verify error message appears

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 11: Sign Up Form - Valid Submission

### Expected Behavior:
- Form submits successfully
- Data stored in localStorage
- Auth modal closes
- Website loads with full access
- Navbar is visible
- Home section is visible

### Test Steps:
1. [ ] Select a role
2. [ ] Click "Sign Up" tab
3. [ ] Enter name: John Doe
4. [ ] Enter email: john@example.com
5. [ ] Enter password: password123
6. [ ] Enter confirm password: password123
7. [ ] Click "Create Account" button
8. [ ] Verify modal closes
9. [ ] Verify website loads
10. [ ] Verify navbar is visible

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 12: Guest Access

### Expected Behavior:
- Auth modal closes
- Website loads
- User can access website without account
- Limited features may be available

### Test Steps:
1. [ ] Open website (fresh page)
2. [ ] Scroll down to see "Continue as Guest" button
3. [ ] Click "Continue as Guest" button
4. [ ] Verify modal closes
5. [ ] Verify website loads
6. [ ] Verify navbar is visible

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 13: Session Persistence - Login

### Expected Behavior:
- User stays logged in after page reload
- Auth modal doesn't appear
- Website loads directly
- User data is preserved

### Test Steps:
1. [ ] Complete login (Test 6)
2. [ ] Refresh page (F5)
3. [ ] Verify auth modal doesn't appear
4. [ ] Verify website loads directly
5. [ ] Verify navbar is visible
6. [ ] Open browser console
7. [ ] Check localStorage for isLoggedIn = "true"

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 14: Session Persistence - Sign Up

### Expected Behavior:
- User stays logged in after page reload
- Auth modal doesn't appear
- Website loads directly
- User data is preserved

### Test Steps:
1. [ ] Complete sign up (Test 11)
2. [ ] Refresh page (F5)
3. [ ] Verify auth modal doesn't appear
4. [ ] Verify website loads directly
5. [ ] Verify navbar is visible
6. [ ] Open browser console
7. [ ] Check localStorage for isLoggedIn = "true"

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 15: localStorage Data Storage

### Expected Behavior:
- isLoggedIn is stored as "true" or "false"
- userType is stored as "client", "doctor", or "guest"
- userData contains user information

### Test Steps:
1. [ ] Complete login or sign up
2. [ ] Open browser DevTools (F12)
3. [ ] Go to Application → localStorage
4. [ ] Verify isLoggedIn key exists
5. [ ] Verify userType key exists
6. [ ] Verify userData key exists
7. [ ] Check values are correct

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 16: Responsive Design - Desktop

### Expected Behavior:
- Modal is centered on screen
- Modal width is appropriate (max 500px)
- All elements are properly spaced
- Buttons are clickable
- Text is readable

### Test Steps:
1. [ ] Open website on desktop (1920x1080)
2. [ ] Verify modal is centered
3. [ ] Verify modal width is appropriate
4. [ ] Verify all buttons are clickable
5. [ ] Verify text is readable
6. [ ] Verify spacing is good

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 17: Responsive Design - Tablet

### Expected Behavior:
- Modal adapts to tablet screen size
- Modal width is appropriate
- All elements are visible
- Buttons are clickable
- Text is readable

### Test Steps:
1. [ ] Open website on tablet (768x1024)
2. [ ] Verify modal is visible
3. [ ] Verify modal width is appropriate
4. [ ] Verify all buttons are clickable
5. [ ] Verify text is readable
6. [ ] Verify no horizontal scrolling

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 18: Responsive Design - Mobile

### Expected Behavior:
- Modal adapts to mobile screen size
- Modal width is 90% of screen
- All elements are visible
- Buttons are clickable
- Text is readable
- No horizontal scrolling

### Test Steps:
1. [ ] Open website on mobile (375x667)
2. [ ] Verify modal is visible
3. [ ] Verify modal width is appropriate
4. [ ] Verify all buttons are clickable
5. [ ] Verify text is readable
6. [ ] Verify no horizontal scrolling
7. [ ] Verify forms are easy to fill

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 19: Animations - Modal Appearance

### Expected Behavior:
- Modal fades in smoothly
- Modal slides up from bottom
- Animation is smooth (not jerky)
- Animation duration is ~0.4 seconds

### Test Steps:
1. [ ] Open website
2. [ ] Watch modal appear
3. [ ] Verify smooth fade-in effect
4. [ ] Verify smooth slide-up effect
5. [ ] Verify animation is not too fast or slow

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 20: Animations - Form Transitions

### Expected Behavior:
- Forms fade in/out smoothly
- Tab switching is smooth
- No jarring transitions
- Animations are ~0.3 seconds

### Test Steps:
1. [ ] Select a role
2. [ ] Click between Login and Sign Up tabs
3. [ ] Verify smooth fade transitions
4. [ ] Verify forms appear/disappear smoothly
5. [ ] Verify no visual glitches

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 21: Button Hover Effects

### Expected Behavior:
- Buttons change appearance on hover
- Hover effect is smooth
- Cursor changes to pointer
- Effect is visible

### Test Steps:
1. [ ] Open website
2. [ ] Hover over "I'm a Client" button
3. [ ] Verify hover effect appears
4. [ ] Hover over other buttons
5. [ ] Verify all buttons have hover effects
6. [ ] Verify cursor changes to pointer

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 22: Input Focus Effects

### Expected Behavior:
- Input fields show focus state when clicked
- Border color changes
- Box shadow appears
- Focus state is clear

### Test Steps:
1. [ ] Select a role
2. [ ] Click on email input field
3. [ ] Verify focus effect appears
4. [ ] Verify border color changes
5. [ ] Verify box shadow appears
6. [ ] Click on other fields
7. [ ] Verify all fields have focus effects

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 23: Browser Compatibility - Chrome

### Expected Behavior:
- All features work correctly
- No console errors
- Animations are smooth
- Forms work properly

### Test Steps:
1. [ ] Open website in Chrome
2. [ ] Complete login/signup flow
3. [ ] Open DevTools console (F12)
4. [ ] Verify no errors
5. [ ] Test all features

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 24: Browser Compatibility - Firefox

### Expected Behavior:
- All features work correctly
- No console errors
- Animations are smooth
- Forms work properly

### Test Steps:
1. [ ] Open website in Firefox
2. [ ] Complete login/signup flow
3. [ ] Open DevTools console (F12)
4. [ ] Verify no errors
5. [ ] Test all features

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 25: Browser Compatibility - Safari

### Expected Behavior:
- All features work correctly
- No console errors
- Animations are smooth
- Forms work properly

### Test Steps:
1. [ ] Open website in Safari
2. [ ] Complete login/signup flow
3. [ ] Open Developer Tools
4. [ ] Verify no errors
5. [ ] Test all features

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 26: Browser Compatibility - Edge

### Expected Behavior:
- All features work correctly
- No console errors
- Animations are smooth
- Forms work properly

### Test Steps:
1. [ ] Open website in Edge
2. [ ] Complete login/signup flow
3. [ ] Open DevTools console (F12)
4. [ ] Verify no errors
5. [ ] Test all features

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 27: Accessibility - Keyboard Navigation

### Expected Behavior:
- Can navigate using Tab key
- Can submit forms using Enter key
- Focus is visible on all elements
- All buttons are accessible

### Test Steps:
1. [ ] Open website
2. [ ] Press Tab key repeatedly
3. [ ] Verify focus moves through elements
4. [ ] Verify focus is visible
5. [ ] Press Enter on buttons
6. [ ] Verify buttons respond

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 28: Accessibility - Screen Reader

### Expected Behavior:
- Form labels are associated with inputs
- Buttons have descriptive text
- Modal has proper structure
- Screen reader can navigate

### Test Steps:
1. [ ] Open website
2. [ ] Enable screen reader (if available)
3. [ ] Navigate through form
4. [ ] Verify labels are read
5. [ ] Verify buttons are read
6. [ ] Verify structure is clear

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 29: Error Handling - Network Issues

### Expected Behavior:
- Form validation works offline
- No network errors shown
- User can still interact with form

### Test Steps:
1. [ ] Open website
2. [ ] Disconnect internet
3. [ ] Try to submit form
4. [ ] Verify validation still works
5. [ ] Verify no network errors

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Test 30: Performance - Page Load Time

### Expected Behavior:
- Page loads quickly
- Auth modal appears within 1 second
- No lag or delays
- Smooth interactions

### Test Steps:
1. [ ] Open website
2. [ ] Measure load time
3. [ ] Verify modal appears quickly
4. [ ] Verify no lag
5. [ ] Verify interactions are responsive

### Result:
- [ ] PASS
- [ ] FAIL (describe issue: ___________________)

---

## Summary

### Total Tests: 30
### Passed: _____ / 30
### Failed: _____ / 30
### Pass Rate: _____%

### Critical Issues Found:
- [ ] None
- [ ] (List issues: ___________________)

### Minor Issues Found:
- [ ] None
- [ ] (List issues: ___________________)

### Overall Status:
- [ ] READY FOR DEPLOYMENT
- [ ] NEEDS FIXES (describe: ___________________)

### Notes:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

**Tested By:** _____________________
**Date:** _____________________
**Browser/Device:** _____________________
**Status:** ✅ Complete / ❌ Incomplete
