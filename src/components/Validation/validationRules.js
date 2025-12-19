// Centralized validation rules for form inputs

export const VALIDATION_RULES = {
    name: {
        pattern: {
            value: /^[A-Za-z\s]+$/,
            message: 'Name must contain only letters and spaces'
        }
    },

    phone: {
        pattern: {
            value: /^[2-9]\d{2}[2-9]\d{2}\d{4}$/,
            message: 'Phone number must be exactly 10 digits (e.g., 2025551234). No special characters or spaces allowed.'
        },
        minLength: {
            value: 10,
            message: 'Phone number must be exactly 10 digits'
        },
        maxLength: {
            value: 10,
            message: 'Phone number must be exactly 10 digits'
        }
    },

    email: {
        pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|edu|org|net|io|info|biz|name|gov|mil|app|dev|xyz|store|tech|cloud|online|site)$/,
            message: 'Please enter a valid email address'
        }
    },

    zip: {
        pattern: {
            value: /^\d{5}(-\d{4})?$/,
            message: 'ZIP code must be 5 digits or 5+4 format (e.g., 12345 or 12345-6789)'
        }
    }
};

// Helper function to get validation rules with required field
export const getValidationRules = (fieldType, isRequired = true) => {
    const rules = { ...VALIDATION_RULES[fieldType] };

    if (isRequired) {
        rules.required = `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} is required`;
    }

    return rules;
};
