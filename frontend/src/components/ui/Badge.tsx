import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide';
  
  const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-[#133b63]/15 text-[#133b63]',
    success: 'bg-[#1d7a72]/15 text-[#16645d]',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-700',
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;