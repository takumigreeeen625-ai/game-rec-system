import { ReactNode } from 'react';

export interface BadgeProps {
    variant?: 'info' | 'success' | 'warning' | 'danger' | 'default' | 'accent';
    children: ReactNode;
    icon?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export default function Badge({
    variant = 'default',
    children,
    icon,
    className = '',
    style
}: BadgeProps) {
    return (
        <span className={`ui-badge ui-badge-${variant} ${className}`} style={style}>
            {icon && <span className="badge-icon">{icon}</span>}
            {children}
        </span>
    );
}
