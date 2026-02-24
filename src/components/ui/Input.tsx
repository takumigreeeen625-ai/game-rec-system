import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, leftIcon, rightIcon, helperText, className = '', id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

        return (
            <div className={`ui-input-group ${className}`}>
                {label && <label htmlFor={inputId} className="ui-label">{label}</label>}

                <div className={`ui-input-wrapper ${error ? 'has-error' : ''} ${leftIcon ? 'has-left-icon' : ''} ${rightIcon ? 'has-right-icon' : ''}`}>
                    {leftIcon && <div className="input-icon left">{leftIcon}</div>}

                    <input
                        id={inputId}
                        ref={ref}
                        className="ui-input"
                        {...props}
                    />

                    {rightIcon && <div className="input-icon right">{rightIcon}</div>}
                </div>

                {error && <p className="ui-error-text">{error}</p>}
                {helperText && !error && <p className="ui-helper-text">{helperText}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;
