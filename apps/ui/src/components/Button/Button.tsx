import { forwardRef, type ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  asChild?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      className = '',
      children,
      disabled = false,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl',
      secondary:
        'border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-500',
      ghost:
        'text-slate-700 dark:text-slate-300 bg-transparent hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-500',
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    const combinedClassName = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      widthStyles,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={combinedClassName}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-5 w-5 mr-2"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
