import React from 'react';
import './Checkbox.css';

export const Checkbox = ({
    id,
    name,
    checked,
    onChange,
    label,
    className = '',
    variant = 'default' // 'default', 'service', 'confirmation'
}) => {
    const checkboxClass = variant === 'confirmation' ? 'confirmation-checkbox' :
        variant === 'service' ? 'checkbox-item' :
            'checkbox-group';

    const inputClass = variant === 'default' ? 'form-checkbox' : '';

    return (
        <div className={`${checkboxClass} ${className}`}>
            <input
                type="checkbox"
                id={id}
                name={name}
                checked={checked}
                onChange={onChange}
                className={inputClass}
            />
            <label htmlFor={id} className={variant === 'default' ? 'checkbox-label' : ''}>
                {label}
            </label>
        </div>
    );
};
