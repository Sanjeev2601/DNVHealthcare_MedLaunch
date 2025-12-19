import React from 'react';
import './Dates.css';

export const DateInput = ({ label, value, onChange, className = '', ...props }) => {
    return (
        <div className={`date-field-group ${className}`}>
            {label && <label className="date-field-label">{label}</label>}
            <input
                type="date"
                className="date-input"
                value={value}
                onChange={onChange}
                {...props}
            />
        </div>
    );
};

export default DateInput;
