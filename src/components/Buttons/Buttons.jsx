import React from 'react';
import './Buttons.css';

export const Button = ({ children, className = '', type = 'button', ...props }) => {
    return (
        <button type={type} className={`btn ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
