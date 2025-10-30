import { useState } from 'react';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'accent';
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-3xl',
};

const variantClasses = {
  primary: 'bg-blue-500 text-white dark:bg-blue-600',
  secondary: 'bg-gray-500 text-white dark:bg-gray-600',
  accent: 'bg-purple-500 text-white dark:bg-purple-600',
};

export const Avatar = ({
  src,
  name,
  size = 'md',
  variant = 'primary',
}: AvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const getInitial = () => {
    return name.charAt(0).toUpperCase();
  };

  const showFallback = !src || imageError;

  return (
    <div
      className={`
        inline-flex items-center justify-center
        overflow-hidden font-semibold
        ${sizeClasses[size]}
        ${showFallback ? variantClasses[variant] : ''}
      `}
      style={{
        borderRadius: '20%',
      }}
      role="img"
      aria-label={name}
    >
      {showFallback ? (
        <span>{getInitial()}</span>
      ) : (
        <img
          src={src}
          alt={name}
          onError={handleImageError}
          onLoad={handleImageLoad}
          className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
};

export default Avatar;
