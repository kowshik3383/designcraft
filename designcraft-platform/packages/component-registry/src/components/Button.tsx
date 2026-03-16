import React from 'react';

interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  fullWidth = false,
  style = {}
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#007bff',
          color: '#ffffff',
          border: 'none',
          ':hover': { backgroundColor: '#0056b3' }
        };
      case 'secondary':
        return {
          backgroundColor: '#6c757d',
          color: '#ffffff',
          border: 'none',
          ':hover': { backgroundColor: '#545b62' }
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: '#007bff',
          border: '1px solid #007bff',
          ':hover': { backgroundColor: '#007bff', color: '#ffffff' }
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '12px' };
      case 'md':
        return { padding: '8px 16px', fontSize: '14px' };
      case 'lg':
        return { padding: '12px 24px', fontSize: '16px' };
      default:
        return {};
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        borderRadius: '4px',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style
      }}
    >
      {text}
    </button>
  );
};