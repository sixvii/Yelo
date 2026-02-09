interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-9',
    lg: 'h-12',
  };

  return (
    <img
      src="/logoo.png"
      alt="Yello"
      className={`w-auto ${sizeClasses[size]} [filter:invert(1)] dark:[filter:invert(0)] ${className}`}
    />
  );
}
