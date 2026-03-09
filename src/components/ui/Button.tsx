import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const buttonClasses = [
    'button',
    variant,
    size,
    fullWidth ? 'full-width' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};