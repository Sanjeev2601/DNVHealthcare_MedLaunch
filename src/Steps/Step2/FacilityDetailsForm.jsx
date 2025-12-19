import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useQuote } from '../../context/QuoteContext';
import '../Step1/QuoteRequestForm.css'; // Reusing form styles for consistency
import Footer from '../../components/PageWrapper/Footer';


const FacilityDetailsForm = () => {
    const { data, updateData } = useQuote();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            facilityType: data.facilityType
        }
    });

    const onSubmit = (formData) => {
        updateData(formData);
        console.log('Step 2 saved:', formData);
        navigate('/step3');
    };

    const handlePrevious = () => {
        navigate('/');
    };

    const handleSave = () => {
        console.log('Save clicked');
    };

    const handleContinue = () => {
        handleSubmit(onSubmit)();
    };

    return (
        <>
            <form className="quote-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-section">
                    <h2 className="section-title">Facility and Organization Type</h2>

                    <div className="form-group">
                        <label className="form-label">Facility Type <span className="required">*</span></label>
                        <div className="radio-group">
                            {['Short-Term Acute Care', 'Long-Term Acute Care', 'Critical Access', "Children's", 'Free-Standing Psychiatric', 'Other'].map((option) => (
                                <div key={option} className="radio-option">
                                    <input
                                        type="radio"
                                        id={option}
                                        value={option}
                                        {...register('facilityType', { required: 'Please select a facility type' })}
                                    />
                                    <label htmlFor={option}>{option}</label>
                                </div>
                            ))}
                        </div>
                        {errors.facilityType && <span className="error-message">{errors.facilityType.message}</span>}
                    </div>
                </div>
            </form>

            {/* Navigation Footer - Outside Card */}
            <Footer
                onSave={handleSave}
                onContinue={handleContinue}
                onPrevious={handlePrevious}
                showPrevious={true}
            />
        </>
    );
};

export default FacilityDetailsForm;
