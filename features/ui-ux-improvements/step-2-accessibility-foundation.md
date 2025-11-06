# Step 2: Accessibility Foundation

## Objective
Implement WCAG AA compliant focus indicators, skip-to-content navigation, and proper ARIA labels throughout the application. This ensures the app is fully accessible to keyboard users and screen reader users.

## Prerequisites
- Steps 0-1 completed (navigation and interactive cards working)
- Understanding of WCAG 2.1 AA requirements
- Tailwind CSS configuration accessible

## Implementation Tasks

### 1. Global Focus Indicator Styles
Add visible focus styles to all interactive elements:

```css
/* In /apps/ui/src/index.css */
/* Remove default outline and add custom focus styles */
*:focus {
  outline: none;
}

*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 0.125rem;
}

/* Specific component focus styles */
button:focus-visible {
  box-shadow: 0 0 0 2px var(--color-background),
              0 0 0 4px var(--color-primary);
}

a:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
}
```

### 2. Implement Skip-to-Content Link
Add skip navigation for keyboard users:

```tsx
// In App.tsx or RootLayout
const SkipToContent = () => (
  <a
    href="#main-content"
    className="
      sr-only focus:not-sr-only
      focus:absolute focus:top-4 focus:left-4
      bg-primary text-white px-4 py-2 rounded-md
      z-50 focus:outline-none focus:ring-2 focus:ring-offset-2
    "
  >
    Skip to main content
  </a>
);

// Add id to main content area
<main id="main-content" tabIndex={-1}>
  {/* Page content */}
</main>
```

### 3. Enhanced Button Focus States
Update Button component with proper focus handling:

```tsx
// In Button.tsx
const Button = ({ variant = 'primary', ...props }) => {
  const focusClasses = `
    focus:outline-none
    focus-visible:ring-2
    focus-visible:ring-offset-2
    focus-visible:ring-${variant}
  `;

  return (
    <button
      className={cn(
        baseClasses,
        focusClasses,
        variantClasses[variant]
      )}
      {...props}
    />
  );
};
```

### 4. Add ARIA Labels and Descriptions
Enhance semantic HTML with proper ARIA attributes:

```tsx
// Navigation
<nav aria-label="Main navigation">
  <ul role="list">
    <li><Link to="/">Home</Link></li>
  </ul>
</nav>

// Quiz Cards
<article
  aria-label={`${category.name} quiz category`}
  role="article"
>
  <h2 id={`category-${category.id}`}>{category.name}</h2>
  <p aria-describedby={`category-${category.id}`}>
    {category.description}
  </p>
</article>

// Form Controls
<label htmlFor="answer-input" className="sr-only">
  Your answer
</label>
<input
  id="answer-input"
  type="text"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? "error-message" : undefined}
/>
```

### 5. Focus Management for Dynamic Content
Handle focus for modals, alerts, and dynamic updates:

```tsx
// Focus trap for modals
import { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className="modal"
    >
      {children}
    </div>
  );
};
```

### 6. Keyboard Navigation Enhancement
Ensure all interactive elements are keyboard accessible:

```tsx
// Custom keyboard handling
const handleKeyDown = (e: React.KeyboardEvent) => {
  switch(e.key) {
    case 'Escape':
      closeModal();
      break;
    case 'Tab':
      // Handle focus trap if needed
      break;
  }
};
```

## Files to Create/Modify

- `/apps/ui/src/index.css`: Global focus styles and CSS custom properties
- `/apps/ui/src/App.tsx`: Add skip-to-content link
- `/apps/ui/src/components/ui/Button.tsx`: Enhanced focus states
- `/apps/ui/src/components/layout/Navbar.tsx`: Add ARIA labels
- `/apps/ui/src/components/layout/Footer.tsx`: Add ARIA labels
- `/apps/ui/src/pages/HomePage.tsx`: ARIA labels for quiz cards
- `/apps/ui/src/components/ui/Modal.tsx`: Focus management for modals
- `/apps/ui/src/utils/accessibility.ts`: Create utility functions for focus management

## Testing Approach

### Keyboard Navigation Testing
1. Tab through entire application
2. Verify all interactive elements are reachable
3. Check focus indicators are visible and clear
4. Test Skip to Content link functionality
5. Verify focus doesn't get trapped
6. Test Escape key closes modals

### Screen Reader Testing
1. Test with NVDA (Windows) or VoiceOver (Mac)
2. Verify all content is announced properly
3. Check ARIA labels provide context
4. Ensure dynamic content updates are announced

### Automated Accessibility Testing
```tsx
// Add to test files
import { axe } from '@axe-core/react';

test('has no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual WCAG Checklist
- [ ] Focus indicators have 3:1 contrast ratio
- [ ] All interactive elements are keyboard accessible
- [ ] Focus order is logical
- [ ] Skip links are available
- [ ] ARIA labels are descriptive
- [ ] Error messages are associated with inputs
- [ ] Focus is managed for dynamic content

## Success Criteria
- ✅ All interactive elements have visible focus indicators
- ✅ Tab navigation follows logical order
- ✅ Skip to content link works
- ✅ No keyboard traps exist
- ✅ ARIA labels provide proper context
- ✅ Screen reader can navigate entire app
- ✅ Axe accessibility tests pass
- ✅ Focus indicators meet WCAG contrast requirements

## Code Examples

### Complete Focus Style Implementation:
```css
/* Custom CSS Properties */
:root {
  --focus-color: #3b82f6;
  --focus-offset: 2px;
  --focus-width: 2px;
}

/* Reset and base focus styles */
*:focus {
  outline: none;
}

*:focus-visible {
  position: relative;
}

/* Interactive elements focus */
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[role="button"]:focus-visible,
[tabindex]:not([tabindex="-1"]):focus-visible {
  outline: var(--focus-width) solid var(--focus-color);
  outline-offset: var(--focus-offset);
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  :root {
    --focus-color: #60a5fa;
  }
}
```

### Skip Navigation Implementation:
```tsx
const SkipLinks = () => (
  <div className="skip-links">
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
    <a href="#main-navigation" className="skip-link">
      Skip to navigation
    </a>
  </div>
);

// CSS for skip links
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: 8px 16px;
  z-index: 100;
  text-decoration: none;
  border-radius: 0 0 4px 0;
}

.skip-link:focus {
  top: 0;
}
```

## Notes
- Test with actual assistive technologies, not just automated tools
- Consider users with motor impairments - ensure click targets are large enough
- Focus styles should be consistent across the application
- Don't remove focus indicators, even if design doesn't show them
- Use semantic HTML first, ARIA only when necessary
- Test in high contrast mode
- Consider focus visible polyfill for older browsers