import React from 'react';
import './Stepper.css';

const Stepper = ({ currentStep = 1, totalSteps = 6 }) => {
    const steps = [
        "DNV Quote Request",
        "Facility Details",
        "Leadership Contacts",
        "Site Information",
        "Services & Certifications",
        "Review & Submit"
    ];

    const stepTitles = [
        "New DNV Quote Request",
        "Facility Details",
        "Leadership Contacts",
        "Site Information",
        "Services & Certifications",
        "Review & Submit"
    ];

    return (
        <div className="stepper-container">
            <div className="stepper-header">
                <h1 className="page-title">{stepTitles[currentStep - 1]}</h1>
                <span className="step-count">Step {currentStep} of {totalSteps}</span>
            </div>
            <div className="stepper-track">
                {steps.map((label, index) => {
                    const isActive = index + 1 === currentStep;
                    const isCompleted = index + 1 < currentStep;
                    return (
                        <div key={index} className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                            <div className="step-bar"></div>
                            <span className="step-label">{label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Stepper;
