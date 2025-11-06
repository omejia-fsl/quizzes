# Step 0: Navigation System Refactor

## Objective
Replace all `<a>` HTML anchor tags with React Router `<Link>` components to prevent full page reloads and maintain single-page application behavior. This ensures smooth navigation with preserved application state and improved performance.

## Prerequisites
- React Router DOM is installed and configured
- Understanding of current navigation structure
- Development server running (`pnpm dev:ui`)

## Implementation Tasks

### 1. Update Navbar Component
Replace anchor tags with Link components in the main navigation:

```typescript
// Import Link from react-router-dom
import { Link } from 'react-router-dom';

// Replace <a href="/"> with <Link to="/">
// Replace <a href="/about"> with <Link to="/about">
// Maintain all existing className and styling
```

### 2. Update Footer Component
Convert footer navigation links:

```typescript
// Replace all anchor tags in footer
// Maintain responsive classes and dark mode styles
// Ensure proper Link imports
```

### 3. Update Any Page-Level Navigation
Search for and replace anchor tags in:
- HomePage quiz category cards (if using anchors)
- AboutPage internal links
- Any other components with navigation

### 4. Add Active Link Styling (Optional Enhancement)
Use NavLink for active state indication:

```typescript
import { NavLink } from 'react-router-dom';

// Use NavLink with className function for active state
<NavLink
  to="/path"
  className={({ isActive }) =>
    `base-classes ${isActive ? 'active-classes' : ''}`
  }
>
```

## Files to Create/Modify

- `/apps/ui/src/components/layout/Navbar.tsx`: Replace all `<a>` tags with `<Link>` components
- `/apps/ui/src/components/layout/Footer.tsx`: Convert footer links to use React Router
- `/apps/ui/src/pages/HomePage.tsx`: Check for any anchor tags in quiz cards
- `/apps/ui/src/pages/AboutPage.tsx`: Update any internal navigation links

## Testing Approach

### Manual Testing
1. Start dev server: `pnpm dev:ui`
2. Click each navigation link in the navbar
3. Verify no page reload occurs (watch for flash/spinner)
4. Check browser DevTools Network tab - should see no document requests
5. Test browser back/forward buttons work correctly
6. Verify scroll position is maintained on navigation

### Automated Testing
Create or update tests:

```typescript
// Navbar.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './Navbar';

test('renders navigation links', () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  // Verify links exist and are React Router Links
  const homeLink = screen.getByRole('link', { name: /home/i });
  expect(homeLink).toHaveAttribute('href', '/');
});
```

### Accessibility Testing
- Tab through all links - ensure focus is visible
- Test with screen reader - links should announce properly
- Verify keyboard navigation (Enter key) works

## Success Criteria
- ✅ No full page reloads when clicking navigation links
- ✅ Browser URL updates without reload
- ✅ Back/forward buttons work correctly
- ✅ All existing styles are preserved
- ✅ No TypeScript errors
- ✅ Tests pass: `pnpm test:ui`
- ✅ No console errors or warnings

## Code Examples

### Before (Incorrect):
```tsx
const Navbar = () => {
  return (
    <nav>
      <a href="/" className="nav-link">Home</a>
      <a href="/about" className="nav-link">About</a>
    </nav>
  );
};
```

### After (Correct):
```tsx
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/about" className="nav-link">About</Link>
    </nav>
  );
};
```

## Notes
- Preserve all existing className attributes and styles
- External links (e.g., to documentation) should remain as `<a>` tags with `target="_blank"` and `rel="noopener noreferrer"`
- If using any onClick handlers on anchors, ensure they're preserved on Link components
- Consider using NavLink for navigation items that need active state styling
- Watch for any custom hover/focus styles that might need adjustment