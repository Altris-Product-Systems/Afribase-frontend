import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  href?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95';

  const variantStyles = {
    primary: 'bg-brand-primary text-white hover:bg-[#0052CC] shadow-lg hover:shadow-xl',
    secondary: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/10 shadow-lg',
    outline: 'border-2 border-white text-white hover:bg-white/10',
    cta: 'bg-linear-to-r from-[#0066FF] to-[#FFD700] text-white hover:from-[#0052CC] hover:to-[#FFB347] shadow-lg hover:shadow-xl',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
