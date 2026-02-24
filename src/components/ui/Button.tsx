import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children: ReactNode;
    style?: React.CSSProperties;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    style,
    ...props
}: ButtonProps) {
    const baseClasses = 'ui-btn';
    const variantClasses = `ui-btn-${variant}`;
    const sizeClasses = `ui-btn-${size}`;
    const widthClasses = fullWidth ? 'ui-btn-full' : '';

    return (
        <button
            className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`}
            style={style}
            {...props}
        >
            {leftIcon && <span className="btn-icon left">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="btn-icon right">{rightIcon}</span>}
        </button>
    );
}
