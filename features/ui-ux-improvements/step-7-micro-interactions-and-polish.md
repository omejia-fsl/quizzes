# Step 7: Micro-interactions and Final Polish

## Objective
Add button press effects, implement subtle hover animations, and create delightful user feedback throughout the application. This final step adds the polish that makes the app feel professional and engaging.

## Prerequisites
- Steps 0-6 completed (all major UX improvements in place)
- Understanding of micro-interaction principles
- Animation utilities from Step 6 available

## Implementation Tasks

### 1. Enhanced Button Micro-interactions
Add press effects and ripple animations:

```tsx
// /apps/ui/src/components/ui/RippleButton.tsx
import { useState, useRef, MouseEvent } from 'react';

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export const RippleButton = ({ children, className = '', ...props }) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createRipple = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples([...ripples, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <button
      ref={buttonRef}
      className={`
        relative overflow-hidden
        transform transition-all duration-150
        active:scale-95
        ${className}
      `}
      onMouseDown={createRipple}
      {...props}
    >
      {children}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '100px',
            height: '100px',
          }}
        />
      ))}
    </button>
  );
};

// CSS for ripple animation
const rippleStyles = `
  @keyframes ripple {
    from {
      transform: scale(0);
      opacity: 1;
    }
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .animate-ripple {
    animation: ripple 600ms ease-out;
  }
`;
```

### 2. Input Field Interactions
Enhanced form field feedback:

```tsx
// /apps/ui/src/components/ui/AnimatedInput.tsx
import { useState, useRef, FocusEvent, ChangeEvent } from 'react';

interface AnimatedInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const AnimatedInput = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
}: AnimatedInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    setHasValue(!!e.target.value);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`
          peer w-full px-4 py-3 pt-6
          bg-transparent
          border-2 rounded-lg
          outline-none transition-all duration-200
          ${error
            ? 'border-red-500 focus:border-red-600'
            : 'border-gray-300 dark:border-gray-600 focus:border-primary'
          }
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${label}-error` : undefined}
      />

      {/* Animated label */}
      <label
        htmlFor={inputRef.current?.id}
        className={`
          absolute left-4
          transition-all duration-200 pointer-events-none
          ${isFocused || hasValue
            ? 'top-1 text-xs text-primary'
            : 'top-3.5 text-base text-gray-500'
          }
        `}
      >
        {label}
      </label>

      {/* Focus highlight */}
      <div
        className={`
          absolute bottom-0 left-1/2 -translate-x-1/2
          h-0.5 bg-primary
          transition-all duration-300
          ${isFocused ? 'w-full' : 'w-0'}
        `}
      />

      {/* Error message with animation */}
      {error && (
        <p
          id={`${label}-error`}
          className="mt-1 text-sm text-red-500 animate-shake"
        >
          {error}
        </p>
      )}
    </div>
  );
};
```

### 3. Success/Error Feedback Animations
Create toast notifications with animations:

```tsx
// /apps/ui/src/components/ui/Toast.tsx
import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export const Toast = ({ message, type, duration = 3000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto dismiss
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircleIcon className="h-5 w-5 text-green-400" />,
    error: <XCircleIcon className="h-5 w-5 text-red-400" />,
    info: <InformationCircleIcon className="h-5 w-5 text-blue-400" />,
  };

  const colors = {
    success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50
        flex items-center gap-3
        px-4 py-3 rounded-lg border
        shadow-lg backdrop-blur-sm
        transition-all duration-300
        ${colors[type]}
        ${isVisible && !isLeaving
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
        }
      `}
      role="alert"
    >
      <div className="animate-bounce-subtle">{icons[type]}</div>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setIsLeaving(true);
          setTimeout(onClose, 300);
        }}
        className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close notification"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

// Toast container with queue management
export const ToastContainer = () => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: number }>>([]);

  const addToast = (toast: Omit<ToastProps, 'onClose'>) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id, onClose: () => removeToast(id) }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ transform: `translateY(${index * 60}px)` }}
          className="transition-transform duration-300"
        >
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
};
```

### 4. Card Hover Effects
Add delightful hover states to cards:

```tsx
// /apps/ui/src/components/ui/InteractiveCard.tsx
export const InteractiveCard = ({ children, onClick, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`
        relative overflow-hidden
        bg-white dark:bg-gray-800
        border-2 border-gray-200 dark:border-gray-700
        rounded-lg p-6
        cursor-pointer
        transition-all duration-300
        hover:border-primary hover:shadow-xl
        hover:-translate-y-1
        ${className}
      `}
    >
      {/* Gradient follow effect */}
      {isHovered && (
        <div
          className="absolute inset-0 opacity-5 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
          }}
        />
      )}

      {/* Shine effect */}
      <div
        className={`
          absolute inset-0 opacity-0 pointer-events-none
          bg-gradient-to-r from-transparent via-white/10 to-transparent
          -skew-x-12 transition-all duration-700
          ${isHovered ? 'opacity-100 translate-x-full' : '-translate-x-full'}
        `}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};
```

### 5. Loading Skeleton Animations
Improved skeleton loaders:

```tsx
// /apps/ui/src/components/ui/SkeletonLoader.tsx
export const SkeletonLoader = ({ variant = 'text', className = '' }) => {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-48 w-full rounded-lg',
    button: 'h-10 w-24 rounded-md',
  };

  return (
    <div
      className={`
        ${variants[variant]}
        bg-gray-200 dark:bg-gray-700
        relative overflow-hidden
        ${className}
      `}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
};

// CSS for shimmer
const shimmerStyles = `
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;
```

### 6. Confetti Effect for Success
Celebration animation for quiz completion:

```tsx
// /apps/ui/src/components/effects/Confetti.tsx
import { useEffect, useState } from 'react';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  delay: number;
}

export const Confetti = ({ trigger, duration = 3000 }) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];
    const newParticles: ConfettiParticle[] = [];

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 1000,
      });
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [trigger, duration]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-fall"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animationDelay: `${particle.delay}ms`,
          }}
        />
      ))}
    </div>
  );
};

// CSS for confetti
const confettiStyles = `
  @keyframes fall {
    0% {
      transform: translateY(-100vh) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }

  .animate-fall {
    animation: fall 3s linear;
  }
`;
```

### 7. Sound Effects (Optional)
Add subtle sound feedback:

```tsx
// /apps/ui/src/hooks/useSound.ts
export const useSound = () => {
  const sounds = {
    click: '/sounds/click.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3',
    hover: '/sounds/hover.mp3',
  };

  const playSound = (type: keyof typeof sounds, volume = 0.3) => {
    if (typeof window === 'undefined') return;

    const audio = new Audio(sounds[type]);
    audio.volume = volume;
    audio.play().catch(() => {
      // Ignore errors if sound can't play
    });
  };

  return { playSound };
};

// Usage in button
const InteractiveButton = ({ children, ...props }) => {
  const { playSound } = useSound();

  return (
    <button
      onMouseEnter={() => playSound('hover', 0.1)}
      onClick={() => playSound('click', 0.2)}
      {...props}
    >
      {children}
    </button>
  );
};
```

## Files to Create/Modify

- `/apps/ui/src/components/ui/RippleButton.tsx`: Button with ripple effect
- `/apps/ui/src/components/ui/AnimatedInput.tsx`: Enhanced input fields
- `/apps/ui/src/components/ui/Toast.tsx`: Toast notifications
- `/apps/ui/src/components/ui/InteractiveCard.tsx`: Cards with hover effects
- `/apps/ui/src/components/ui/SkeletonLoader.tsx`: Enhanced skeleton loaders
- `/apps/ui/src/components/effects/Confetti.tsx`: Celebration animation
- `/apps/ui/src/hooks/useSound.ts`: Sound effects hook
- `/apps/ui/src/styles/micro-interactions.css`: Animation styles

## Testing Approach

### Interaction Testing
```tsx
test('button shows ripple effect on click', () => {
  const { container } = render(<RippleButton>Click me</RippleButton>);
  const button = screen.getByRole('button');

  fireEvent.mouseDown(button);

  const ripple = container.querySelector('.animate-ripple');
  expect(ripple).toBeInTheDocument();
});

test('toast notification appears and auto-dismisses', async () => {
  render(<Toast message="Success!" type="success" duration={1000} onClose={jest.fn()} />);

  expect(screen.getByText('Success!')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText('Success!')).not.toBeInTheDocument();
  }, { timeout: 1500 });
});
```

### Performance Testing
- Monitor animation frame rate
- Check for memory leaks from animations
- Verify no layout thrashing occurs
- Test on low-end devices

## Success Criteria
- ✅ Buttons have satisfying press feedback
- ✅ Form inputs have smooth focus animations
- ✅ Toast notifications appear with animations
- ✅ Cards have engaging hover effects
- ✅ Success states trigger celebrations
- ✅ All micro-interactions feel smooth
- ✅ Animations don't impact performance
- ✅ Sound effects are subtle (if implemented)

## Notes
- Keep micro-interactions subtle and fast
- Test with users to ensure interactions feel natural
- Consider user preferences for motion and sound
- Ensure animations don't distract from content
- Monitor performance impact of all effects
- Test on various devices and browsers
- Consider A11y implications of all interactions