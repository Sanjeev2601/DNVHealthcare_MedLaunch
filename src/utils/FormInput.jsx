import React from 'react';
import './FormInput.css';

const FormInput = ({ label, name, type = 'text', register, validation, errors, placeholder, className, readOnly, headerAction }) => {
    // Helper to access nested errors (e.g. "invoicing.email")
    const error = name.split('.').reduce((obj, key) => obj && obj[key], errors);

    return (
        <div className={`form-group ${className || ''}`}>
            <div className="form-header">
                <label htmlFor={name} className="form-label">
                    {label} {validation?.required && <span className="required">*</span>}
                </label>
                {headerAction}
            </div>
            <input
                id={name}
                type={type}
                className={`form-input ${error ? 'error' : ''}`}
                placeholder={placeholder}
                readOnly={readOnly}
                {...register(name, validation)}
            />
            {error && <span className="error-message">{error.message}</span>}
        </div>
    );
};

export default FormInput;
