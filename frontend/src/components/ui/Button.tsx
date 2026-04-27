import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
  
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-[#133b63] text-white hover:-translate-y-0.5 hover:bg-[#0f2f50] hover:shadow-lg hover:shadow-[#133b63]/30 focus:ring-[#133b63]/60',
    secondary: 'bg-[#d9e5f0] text-[#133b63] hover:-translate-y-0.5 hover:bg-[#cfe0ef] focus:ring-[#133b63]/40',
    outline: 'border border-[#133b63]/25 bg-white/70 text-[#133b63] hover:bg-[#133b63]/8 focus:ring-[#133b63]/35',
    danger: 'bg-[#c0392b] text-white hover:bg-[#a93226] focus:ring-[#c0392b]/60',
    success: 'bg-[#1d7a72] text-white hover:bg-[#16645d] focus:ring-[#1d7a72]/60',
  };
  
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;
  
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;