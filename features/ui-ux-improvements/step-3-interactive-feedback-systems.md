# Step 3: Interactive Feedback Systems

## Objective
Implement comprehensive loading states for async operations, hover states for feature cards, and consistent button interaction patterns. This provides users with clear visual feedback during all interactions, reducing uncertainty and improving perceived performance.

## Prerequisites
- Steps 0-2 completed (navigation, interactive cards, and accessibility in place)
- Zustand stores configured for state management
- Understanding of async operations in the app (API calls, quiz loading, etc.)

## Implementation Tasks

### 1. Create Global Loading State Management
Set up Zustand store for loading states:

```typescript
// /apps/ui/src/stores/uiStore.ts
import { create } from 'zustand';

interface LoadingState {
  operations: Map<string, boolean>;
  setLoading: (key: string, isLoading: boolean) => void;
  isLoading: (key: string) => boolean;
  clearLoading: (key: string) => void;
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  operations: new Map(),
  setLoading: (key, isLoading) =>
    set((state) => {
      const ops = new Map(state.operations);
      if (isLoading) {
        ops.set(key, true);
      } else {
        ops.delete(key);
      }
      return { operations: ops };
    }),
  isLoading: (key) => get().operations.get(key) || false,
  clearLoading: (key) =>
    set((state) => {
      const ops = new Map(state.operations);
      ops.delete(key);
      return { operations: ops };
    }),
}));
```

### 2. Implement Loading Spinner Component
Create reusable loading indicators:

```tsx
// /apps/ui/src/components/ui/LoadingSpinner.tsx
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <svg
        className="animate-spin text-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Skeleton loader for content
export const SkeletonLoader = ({ lines = 3, className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"
        style={{ width: `${100 - i * 10}%` }}
      />
    ))}
  </div>
);
```

### 3. Add Loading States to API Calls
Wrap async operations with loading indicators:

```tsx
// Custom hook for API calls with loading
import { useState, useCallback } from 'react';
import { useLoadingStore } from '@/stores/uiStore';

export const useAsyncOperation = (key: string) => {
  const { setLoading, isLoading } = useLoadingStore();
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (operation: () => Promise<any>) => {
    setLoading(key, true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(key, false);
    }
  }, [key, setLoading]);

  return {
    execute,
    isLoading: isLoading(key),
    error,
  };
};
```

### 4. Enhanced Feature Card Hover States
Add clear hover affordances:

```tsx
// /apps/ui/src/components/features/FeatureCard.tsx
export const FeatureCard = ({ feature }) => (
  <div
    className="
      group relative
      bg-white dark:bg-gray-800
      border-2 border-gray-200 dark:border-gray-700
      rounded-lg p-6
      transition-all duration-300
      hover:border-primary hover:shadow-xl
      hover:-translate-y-1
      cursor-pointer
    "
    tabIndex={0}
    role="article"
  >
    {/* Hover indicator */}
    <div className="
      absolute inset-0
      bg-gradient-to-r from-primary/5 to-primary/10
      opacity-0 group-hover:opacity-100
      transition-opacity duration-300
      rounded-lg pointer-events-none
    " />

    {/* Icon with hover animation */}
    <div className="
      relative z-10
      w-12 h-12 mb-4
      text-primary
      transform transition-transform duration-300
      group-hover:scale-110 group-hover:rotate-3
    ">
      {feature.icon}
    </div>

    <h3 className="
      relative z-10
      text-xl font-bold mb-2
      transition-colors duration-300
      group-hover:text-primary
    ">
      {feature.title}
    </h3>

    <p className="relative z-10 text-gray-600 dark:text-gray-400">
      {feature.description}
    </p>
  </div>
);
```

### 5. Consistent Button Interaction Patterns
Standardize button states and feedback:

```tsx
// /apps/ui/src/components/ui/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loadingText = 'Loading...',
    disabled,
    children,
    className = '',
    ...props
  }, ref) => {
    const baseClasses = `
      inline-flex items-center justify-center
      font-medium rounded-md
      transition-all duration-200
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      transform active:scale-95
    `;

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const variantClasses = {
      primary: `
        bg-primary text-white
        hover:bg-primary-dark
        focus-visible:ring-primary
        shadow-md hover:shadow-lg
      `,
      secondary: `
        bg-gray-200 text-gray-900
        dark:bg-gray-700 dark:text-gray-100
        hover:bg-gray-300 dark:hover:bg-gray-600
        focus-visible:ring-gray-500
      `,
      danger: `
        bg-red-600 text-white
        hover:bg-red-700
        focus-visible:ring-red-500
      `,
      ghost: `
        bg-transparent text-gray-700 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-800
        focus-visible:ring-gray-500
      `,
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          ${baseClasses}
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            {loadingText}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### 6. Loading States for Page Transitions
Add loading feedback during navigation:

```tsx
// /apps/ui/src/components/layout/PageTransition.tsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
          <LoadingSpinner size="lg" />
        </div>
      )}
      <div className={isLoading ? 'opacity-50' : 'opacity-100 transition-opacity'}>
        {children}
      </div>
    </div>
  );
};
```

## Files to Create/Modify

- `/apps/ui/src/stores/uiStore.ts`: Create loading state management
- `/apps/ui/src/components/ui/LoadingSpinner.tsx`: Create loading components
- `/apps/ui/src/components/ui/Button.tsx`: Update with loading states
- `/apps/ui/src/components/features/FeatureCard.tsx`: Add hover states
- `/apps/ui/src/hooks/useAsyncOperation.ts`: Create async operation hook
- `/apps/ui/src/components/layout/PageTransition.tsx`: Page loading indicator
- `/apps/ui/src/pages/HomePage.tsx`: Implement loading states
- `/apps/ui/src/pages/QuizPage.tsx`: Add loading for quiz data

## Testing Approach

### Component Testing
```tsx
// Button.test.tsx
test('shows loading spinner when isLoading', () => {
  render(<Button isLoading>Submit</Button>);
  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

test('button is disabled during loading', () => {
  render(<Button isLoading>Submit</Button>);
  expect(screen.getByRole('button')).toBeDisabled();
});

// FeatureCard.test.tsx
test('shows hover state on mouse enter', () => {
  const { container } = render(<FeatureCard feature={mockFeature} />);
  const card = container.firstChild;

  fireEvent.mouseEnter(card);
  expect(card).toHaveClass('hover:shadow-xl');
});
```

### Manual Testing
1. Test all loading states appear during API calls
2. Verify buttons show loading spinner
3. Check feature cards have clear hover states
4. Test skeleton loaders during content loading
5. Verify no loading states get stuck
6. Test on slow network (Chrome DevTools throttling)

## Success Criteria
- ✅ All API calls show loading indicators
- ✅ Buttons display loading state with spinner
- ✅ Feature cards have clear hover affordances
- ✅ No UI jank during loading states
- ✅ Loading states are accessible (proper ARIA)
- ✅ Consistent interaction patterns across all components
- ✅ Loading states clear properly on error
- ✅ Skeleton loaders for content areas

## Notes
- Use debouncing for rapid state changes to prevent flashing
- Consider optimistic updates for better perceived performance
- Ensure loading states don't cause layout shift
- Test with slow network conditions
- Add minimum display time for very fast operations (prevent flash)
- Consider progressive enhancement for critical interactions