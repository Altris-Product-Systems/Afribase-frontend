import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
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
    primary: 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl dark:bg-white dark:text-black dark:hover:bg-gray-200',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-black text-black hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-900',
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
