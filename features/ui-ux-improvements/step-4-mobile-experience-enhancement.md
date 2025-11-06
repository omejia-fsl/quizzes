# Step 4: Mobile Experience Enhancement

## Objective
Fix mobile menu outside click behavior, improve touch target sizes, and optimize animations for mobile performance. This ensures a smooth and intuitive experience for mobile and tablet users.

## Prerequisites
- Steps 0-3 completed (navigation, cards, accessibility, and loading states working)
- Mobile viewport testing capability
- Understanding of touch interaction requirements

## Implementation Tasks

### 1. Fix Mobile Menu Outside Click
Implement click-outside detection to close menu:

```tsx
// /apps/ui/src/hooks/useClickOutside.ts
import { useEffect, useRef } from 'react';

export const useClickOutside = (
  handler: () => void,
  isActive: boolean = true
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const handleClick = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    // Add both mouse and touch events
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [handler, isActive]);

  return ref;
};

// Update Navbar to use the hook
// /apps/ui/src/components/layout/Navbar.tsx
import { useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useClickOutside(
    () => setIsMobileMenuOpen(false),
    isMobileMenuOpen
  );

  return (
    <nav className="relative">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2"
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
      >
        {/* Hamburger icon */}
      </button>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        className={`
          absolute top-full left-0 right-0
          bg-white dark:bg-gray-800
          shadow-lg rounded-b-lg
          transform transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}
          md:hidden
        `}
      >
        {/* Menu items */}
      </div>

      {/* Overlay for better UX */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
};
```

### 2. Improve Touch Target Sizes
Ensure all interactive elements meet 44x44px minimum:

```tsx
// /apps/ui/src/styles/mobile.css
/* Minimum touch target sizes */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Apply to small buttons and links */
@media (pointer: coarse) {
  button,
  a,
  input,
  select,
  textarea,
  [role="button"],
  [tabindex]:not([tabindex="-1"]) {
    min-height: 44px;
    padding: 12px;
  }

  /* Small icon buttons need larger tap area */
  .icon-button {
    position: relative;
  }

  .icon-button::before {
    content: '';
    position: absolute;
    inset: -8px;
    /* Creates larger touch target without visual change */
  }
}
```

### 3. Mobile-Optimized Button Component
Update Button with mobile considerations:

```tsx
// /apps/ui/src/components/ui/Button.tsx updates
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size = 'md', ...props }, ref) => {
    // Mobile-friendly size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm min-h-[44px] md:min-h-[32px]',
      md: 'px-4 py-2 text-base min-h-[44px]',
      lg: 'px-6 py-3 text-lg min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        className={`
          ${baseClasses}
          ${sizeClasses[size]}
          touch-manipulation /* Prevents double-tap zoom */
        `}
        {...props}
      />
    );
  }
);
```

### 4. Optimize Animations for Mobile
Reduce motion for better performance:

```tsx
// /apps/ui/src/hooks/useReducedMotion.ts
import { useEffect, useState } from 'react';

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Use in components
const QuizCard = ({ category }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`
        card
        ${!prefersReducedMotion ? 'transition-all duration-300 hover:scale-105' : ''}
      `}
    >
      {/* Content */}
    </div>
  );
};
```

### 5. Swipe Gestures for Mobile Navigation
Add touch gestures for better mobile UX:

```tsx
// /apps/ui/src/hooks/useSwipe.ts
import { useRef, TouchEvent } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const useSwipe = (handlers: SwipeHandlers, threshold = 50) => {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (!touchStart.current) return;

    const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStart.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
        } else {
          handlers.onSwipeLeft?.();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
        } else {
          handlers.onSwipeUp?.();
        }
      }
    }

    touchStart.current = null;
  };

  return {
    onTouchStart,
    onTouchEnd,
  };
};

// Usage in quiz navigation
const QuizQuestion = ({ onNext, onPrevious }) => {
  const swipeHandlers = useSwipe({
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious,
  });

  return (
    <div {...swipeHandlers} className="quiz-question">
      {/* Question content */}
    </div>
  );
};
```

### 6. Mobile-First Responsive Design Updates
Ensure all components are mobile-optimized:

```tsx
// Update responsive utilities
// /apps/ui/src/utils/responsive.ts
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
```

## Files to Create/Modify

- `/apps/ui/src/hooks/useClickOutside.ts`: Create click-outside detection hook
- `/apps/ui/src/hooks/useSwipe.ts`: Create swipe gesture hook
- `/apps/ui/src/hooks/useReducedMotion.ts`: Create reduced motion detection
- `/apps/ui/src/hooks/useMediaQuery.ts`: Create responsive utilities
- `/apps/ui/src/components/layout/Navbar.tsx`: Fix mobile menu behavior
- `/apps/ui/src/components/ui/Button.tsx`: Update touch targets
- `/apps/ui/src/styles/mobile.css`: Add mobile-specific styles
- `/apps/ui/src/components/quiz/QuizQuestion.tsx`: Add swipe navigation

## Testing Approach

### Mobile Device Testing
1. Test on real devices (iOS Safari, Android Chrome)
2. Use Chrome DevTools device emulation
3. Test different orientations (portrait/landscape)
4. Verify touch targets are large enough
5. Test swipe gestures work smoothly
6. Verify animations don't cause jank

### Responsive Testing Checklist
- [ ] Mobile menu opens and closes properly
- [ ] Clicking outside closes mobile menu
- [ ] All buttons are easily tappable
- [ ] No horizontal scroll on mobile
- [ ] Text is readable without zooming
- [ ] Forms are easy to fill on mobile
- [ ] Animations are smooth (60fps)

### Accessibility on Mobile
```tsx
// Test touch and keyboard work together
test('mobile menu is keyboard accessible', () => {
  render(<Navbar />);
  const menuButton = screen.getByLabelText('Toggle menu');

  // Keyboard interaction
  menuButton.focus();
  fireEvent.keyDown(menuButton, { key: 'Enter' });
  expect(screen.getByRole('navigation')).toBeVisible();

  // Touch interaction
  fireEvent.touchStart(menuButton);
  fireEvent.touchEnd(menuButton);
  expect(screen.getByRole('navigation')).not.toBeVisible();
});
```

## Success Criteria
- ✅ Mobile menu closes when clicking outside
- ✅ All touch targets are at least 44x44px
- ✅ No accidental taps on adjacent elements
- ✅ Swipe gestures work for quiz navigation
- ✅ Animations are smooth on mobile devices
- ✅ No horizontal scrolling on mobile
- ✅ Forms are easy to use on mobile
- ✅ Reduced motion preference is respected

## Notes
- Test on actual devices, not just emulators
- Consider battery consumption with animations
- Ensure good performance on 3G networks
- Test with one-handed use scenarios
- Consider thumb reach for important actions
- Avoid hover-only interactions
- Test with mobile screen readers (TalkBack, VoiceOver)