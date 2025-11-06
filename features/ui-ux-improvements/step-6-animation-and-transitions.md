# Step 6: Animation and Transitions

## Objective
Add smooth scroll behavior, implement hero section entrance animations, and improve dark mode transitions. This creates a more polished and engaging user experience with thoughtful motion design.

## Prerequisites
- Steps 0-5 completed (core UX improvements in place)
- Understanding of CSS animations and transitions
- Awareness of performance implications

## Implementation Tasks

### 1. Implement Smooth Scroll Behavior
Add smooth scrolling throughout the application:

```css
/* /apps/ui/src/index.css */
/* Global smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```tsx
// /apps/ui/src/hooks/useSmoothScroll.ts
export const useSmoothScroll = () => {
  const scrollToElement = (elementId: string, offset = 0) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return { scrollToElement, scrollToTop };
};

// Scroll-to-top button component
// /apps/ui/src/components/ui/ScrollToTop.tsx
import { useEffect, useState } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-8 right-8 z-50
        bg-primary text-white
        p-3 rounded-full shadow-lg
        transition-all duration-300
        hover:bg-primary-dark hover:scale-110
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10 pointer-events-none'
        }
      `}
      aria-label="Scroll to top"
    >
      <ArrowUpIcon className="h-5 w-5" />
    </button>
  );
};
```

### 2. Hero Section Entrance Animations
Create engaging entrance animations for hero content:

```tsx
// /apps/ui/src/components/animations/FadeInView.tsx
import { useEffect, useRef, useState, ReactNode } from 'react';

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export const FadeInView = ({
  children,
  delay = 0,
  duration = 600,
  direction = 'up',
  className = '',
}: FadeInViewProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const directionClasses = {
    up: 'translate-y-10',
    down: '-translate-y-10',
    left: 'translate-x-10',
    right: '-translate-x-10',
  };

  return (
    <div
      ref={ref}
      className={`
        transition-all
        ${isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${directionClasses[direction]}`}
        ${className}
      `}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Hero section with animations
// /apps/ui/src/components/sections/HeroSection.tsx
export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 animate-gradient" />

      <div className="relative max-w-7xl mx-auto px-4">
        <FadeInView delay={0} direction="up">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-6">
            Master AI Development
          </h1>
        </FadeInView>

        <FadeInView delay={200} direction="up">
          <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Test your knowledge with interactive quizzes on prompt engineering,
            model selection, and agent design.
          </p>
        </FadeInView>

        <FadeInView delay={400} direction="up">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="animate-pulse-subtle">
              Start Quiz
            </Button>
            <Button variant="secondary" size="lg">
              View Categories
            </Button>
          </div>
        </FadeInView>

        {/* Floating elements animation */}
        <div className="absolute top-10 left-10 animate-float">
          <div className="w-20 h-20 bg-primary/20 rounded-full" />
        </div>
        <div className="absolute bottom-10 right-10 animate-float-delayed">
          <div className="w-32 h-32 bg-secondary/20 rounded-full" />
        </div>
      </div>
    </section>
  );
};
```

### 3. CSS Animation Definitions
Define custom animations:

```css
/* /apps/ui/src/styles/animations.css */
@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse-subtle {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Apply animations */
.animate-gradient {
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 6s ease-in-out infinite;
  animation-delay: 3s;
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s ease-in-out infinite;
}

.animate-slide-in-right {
  animation: slide-in-right 0.5s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}
```

### 4. Improve Dark Mode Transitions
Smooth theme switching animations:

```tsx
// /apps/ui/src/components/theme/ThemeTransition.tsx
import { useEffect, useState } from 'react';

export const ThemeTransition = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleThemeChange = () => {
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 300);
    };

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Theme transition overlay */}
      <div
        className={`
          fixed inset-0 pointer-events-none z-50
          bg-gray-900 transition-opacity duration-300
          ${isTransitioning ? 'opacity-10' : 'opacity-0'}
        `}
      />
      <div
        className={`
          transition-all duration-300
          ${isTransitioning ? 'scale-[0.99]' : 'scale-100'}
        `}
      >
        {children}
      </div>
    </>
  );
};

// Enhanced theme toggle with animation
// /apps/ui/src/components/theme/ThemeToggle.tsx
export const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleTheme = () => {
    setIsAnimating(true);

    setTimeout(() => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', newTheme);
    }, 150);

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-lg
        bg-gray-200 dark:bg-gray-700
        transition-all duration-300
        hover:scale-110
        focus:outline-none focus-visible:ring-2
        ${isAnimating ? 'rotate-180 scale-125' : ''}
      `}
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        {/* Sun icon */}
        <svg
          className={`
            absolute inset-0 w-6 h-6
            transition-all duration-300
            ${theme === 'light'
              ? 'opacity-100 rotate-0'
              : 'opacity-0 rotate-90'
            }
          `}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {/* Sun path */}
        </svg>

        {/* Moon icon */}
        <svg
          className={`
            absolute inset-0 w-6 h-6
            transition-all duration-300
            ${theme === 'dark'
              ? 'opacity-100 rotate-0'
              : 'opacity-0 -rotate-90'
            }
          `}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {/* Moon path */}
        </svg>
      </div>
    </button>
  );
};
```

### 5. Page Transition Animations
Smooth transitions between pages:

```tsx
// /apps/ui/src/components/animations/PageTransition.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

export const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
```

## Files to Create/Modify

- `/apps/ui/src/index.css`: Add smooth scroll and animation utilities
- `/apps/ui/src/styles/animations.css`: Define keyframe animations
- `/apps/ui/src/components/animations/FadeInView.tsx`: Create fade-in component
- `/apps/ui/src/components/ui/ScrollToTop.tsx`: Create scroll-to-top button
- `/apps/ui/src/components/theme/ThemeToggle.tsx`: Enhance theme toggle
- `/apps/ui/src/components/theme/ThemeTransition.tsx`: Theme transition wrapper
- `/apps/ui/src/components/sections/HeroSection.tsx`: Animate hero section
- `/apps/ui/src/hooks/useSmoothScroll.ts`: Smooth scroll utilities

## Testing Approach

### Performance Testing
```tsx
// Test animation performance
test('animations do not cause layout shift', () => {
  const { container } = render(<HeroSection />);
  const hero = container.querySelector('.hero-section');

  // Check no layout shift during animation
  const initialHeight = hero.getBoundingClientRect().height;

  // Trigger animation
  fireEvent.scroll(window, { target: { scrollY: 100 } });

  const finalHeight = hero.getBoundingClientRect().height;
  expect(initialHeight).toBe(finalHeight);
});
```

### Accessibility Testing
- Verify animations respect prefers-reduced-motion
- Ensure animations don't interfere with screen readers
- Test keyboard navigation still works with animations

## Success Criteria
- ✅ Smooth scroll works on all navigation
- ✅ Hero section has entrance animations
- ✅ Dark mode transitions smoothly
- ✅ Animations respect reduced motion preference
- ✅ No janky animations on low-end devices
- ✅ Scroll-to-top button appears on scroll
- ✅ Page transitions are smooth
- ✅ Animations enhance, not distract from content

## Notes
- Test animations on low-end devices
- Consider battery impact on mobile
- Use CSS animations over JavaScript when possible
- Ensure animations don't delay critical content
- Test with reduced motion preference enabled
- Keep animations subtle and purposeful
- Monitor Core Web Vitals (CLS, FID, LCP)