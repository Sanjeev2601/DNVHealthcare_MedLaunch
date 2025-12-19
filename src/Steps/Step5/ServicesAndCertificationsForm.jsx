import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuote } from '../../context/QuoteContext';
import { IoSearch, IoClose } from 'react-icons/io5';
import { BsPersonGear } from 'react-icons/bs';
import './ServicesAndCertificationsForm.css';
import { DateInput } from '../../components/Dates/Dates';

const ServicesAndCertificationsForm = () => {
    const { data, updateData } = useQuote();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedServices, setSelectedServices] = useState(data.servicesAndCertifications?.services || []);
    const [customServices, setCustomServices] = useState(data.servicesAndCertifications?.customServices || []);
    const [showCustomServiceInput, setShowCustomServiceInput] = useState(false);
    const [newCustomService, setNewCustomService] = useState('');
    const [selectedStandards, setSelectedStandards] = useState(data.servicesAndCertifications?.standards || []);
    const [showCustomStandardInput, setShowCustomStandardInput] = useState(false);
    const [newCustomStandard, setNewCustomStandard] = useState('');
    const [expirationDate, setExpirationDate] = useState(data.servicesAndCertifications?.expirationDate || '');
    const [applicationDate, setApplicationDate] = useState(data.servicesAndCertifications?.applicationDate || '');
    const [thrombolyticDates, setThrombolyticDates] = useState(data.servicesAndCertifications?.thrombolyticDates || []);
    const [thrombolectomyDates, setThrombolectomyDates] = useState(data.servicesAndCertifications?.thrombolectomyDates || []);
    const [newThrombolyticDate, setNewThrombolyticDate] = useState('');
    const [newThrombolectomyDate, setNewThrombolectomyDate] = useState('');

    const serviceGroups = [
        {
            title: 'Emergency & Critical Care',
            services: [
                'Emergency Department',
                'Neonatal Intensive Care Services',
                'Pediatric Intensive Care Services'
            ]
        },
        {
            title: 'Cardiac Services',
            services: [
                'Cardiac Catheterization Laboratory',
                'Open Heart'
            ]
        },
        {
            title: 'Diagnostic Services',
            services: [
                'Magnetic Resonance Imaging (MRI)',
                'Diagnostic Radioisotope Facility',
                'Lithotripsy'
            ]
        }
    ];

    const standardsOptions = [
        'Emergency Department',
        'Inpatient Acute Care',
        'General Anesthetizing Location',
        'Diagnostic Services',
        'Therapy Services',
        'Other'
    ];

    const handleServiceToggle = (service) => {
        setSelectedServices(prev =>
            prev.includes(service)
                ? prev.filter(s => s !== service)
                : [...prev, service]
        );
    };

    const handleCustomServiceToggle = (service) => {
        setSelectedServices(prev =>
            prev.includes(service)
                ? prev.filter(s => s !== service)
                : [...prev, service]
        );
    };

    const addCustomService = () => {
        if (newCustomService.trim() && !customServices.includes(newCustomService.trim())) {
            setCustomServices([...customServices, newCustomService.trim()]);
            setSelectedServices([...selectedServices, newCustomService.trim()]);
            setNewCustomService('');
            setShowCustomServiceInput(false);
        }
    };

    const handleStandardSelect = (e) => {
        const standard = e.target.value;
        if (standard === 'Other') {
            setShowCustomStandardInput(true);
        } else if (standard && !selectedStandards.includes(standard)) {
            setSelectedStandards([...selectedStandards, standard]);
        }
        e.target.value = '';
    };

    const addCustomStandard = () => {
        if (newCustomStandard.trim() && !selectedStandards.includes(newCustomStandard.trim())) {
            setSelectedStandards([...selectedStandards, newCustomStandard.trim()]);
            setNewCustomStandard('');
            setShowCustomStandardInput(false);
        }
    };

    const removeStandard = (standard) => {
        setSelectedStandards(selectedStandards.filter(s => s !== standard));
    };

    const handleThrombolyticDateChange = (e) => {
        const selectedDate = e.target.value;
        if (selectedDate && thrombolyticDates.length < 25 && !thrombolyticDates.includes(selectedDate)) {
            setThrombolyticDates([...thrombolyticDates, selectedDate]);
            setNewThrombolyticDate('');
        }
    };

    const removeThrombolyticDate = (index) => {
        setThrombolyticDates(thrombolyticDates.filter((_, i) => i !== index));
    };

    const handleThrombolectomyDateChange = (e) => {
        const selectedDate = e.target.value;
        if (selectedDate && thrombolectomyDates.length < 15 && !thrombolectomyDates.includes(selectedDate)) {
            setThrombolectomyDates([...thrombolectomyDates, selectedDate]);
            setNewThrombolectomyDate('');
        }
    };

    const removeThrombolectomyDate = (index) => {
        setThrombolectomyDates(thrombolectomyDates.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        const formData = {
            servicesAndCertifications: {
                services: selectedServices,
                customServices,
                standards: selectedStandards,
                expirationDate,
                applicationDate,
                thrombolyticDates,
                thrombolectomyDates
            }
        };
        updateData(formData);
        console.log('Step 5 saved (Save):', { ...data, ...formData });
    };

    const handleContinue = () => {
        const formData = {
            servicesAndCertifications: {
                services: selectedServices,
                customServices,
                standards: selectedStandards,
                expirationDate,
                applicationDate,
                thrombolyticDates,
                thrombolectomyDates
            }
        };
        updateData(formData);
        console.log('Step 5 saved (Continue):', { ...data, ...formData });
        navigate('/step6');
    };

    const handlePrevious = () => {
        navigate('/step4');
    };

    const filteredServices = serviceGroups.map(group => ({
        ...group,
        services: group.services.filter(service =>
            service.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(group => group.services.length > 0);

    return (
        <div className="services-container">
            <div className="services-card">
                {/* Service Offering */}
                <div className="service-offering-section">
                    <h2 className="section-title">Service Offering</h2>
                    <p className="section-subtitle">Primary Site Service offering</p>

                    {/* All Services Tab */}
                    <div className="services-tabs">
                        <button className="service-tab active">All Services</button>
                    </div>

                    <div className="search-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <IoSearch className="search-icon" />
                    </div>

                    <div className="services-grid">
                        {filteredServices.map((group, groupIndex) => (
                            <div key={groupIndex} className="service-group">
                                <h3 className="service-group-title">{group.title}</h3>
                                <div className="service-checkbox-group">
                                    {group.services.map((service, serviceIndex) => (
                                        <div key={serviceIndex} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                id={`service-${groupIndex}-${serviceIndex}`}
                                                checked={selectedServices.includes(service)}
                                                onChange={() => handleServiceToggle(service)}
                                            />
                                            <label htmlFor={`service-${groupIndex}-${serviceIndex}`}>
                                                {service}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {customServices.length > 0 && (
                            <div className="service-group">
                                <h3 className="service-group-title">Other</h3>
                                <div className="service-checkbox-group">
                                    {customServices.map((service, index) => (
                                        <div key={index} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                id={`custom-service-${index}`}
                                                checked={selectedServices.includes(service)}
                                                onChange={() => handleCustomServiceToggle(service)}
                                            />
                                            <label htmlFor={`custom-service-${index}`}>
                                                {service}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {showCustomServiceInput ? (
                        <div className="custom-service-input-wrapper">
                            <input
                                type="text"
                                className="custom-service-input"
                                placeholder="Enter service name..."
                                value={newCustomService}
                                onChange={(e) => setNewCustomService(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addCustomService()}
                            />
                            <button className="btn btn-primary" onClick={addCustomService}>
                                Add
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => {
                                    setShowCustomServiceInput(false);
                                    setNewCustomService('');
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            className="add-other-service-btn"
                            onClick={() => setShowCustomServiceInput(true)}
                        >
                            + Add Other Service
                        </button>
                    )}
                </div>

                {/* Standards to Apply */}
                <div className="standards-section">
                    <h2 className="section-title">Standards to Apply</h2>
                    <select className="standards-dropdown" onChange={handleStandardSelect}>
                        <option value="">Select Standard(s)</option>
                        {standardsOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>

                    {showCustomStandardInput && (
                        <div className="custom-standard-input-wrapper">
                            <input
                                type="text"
                                className="custom-standard-input"
                                placeholder="Enter custom standard..."
                                value={newCustomStandard}
                                onChange={(e) => setNewCustomStandard(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addCustomStandard()}
                            />
                            <button className="btn btn-primary-sm" onClick={addCustomStandard}>
                                Add
                            </button>
                            <button
                                className="btn btn-outline-sm"
                                onClick={() => {
                                    setShowCustomStandardInput(false);
                                    setNewCustomStandard('');
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {selectedStandards.length > 0 && (
                        <div className="selected-standards">
                            {selectedStandards.map((standard, index) => (
                                <div key={index} className="standard-tag">
                                    {standard}
                                    <button className="tag-remove" onClick={() => removeStandard(standard)}>
                                        <IoClose />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Date Fields */}
                <div className="date-fields-section">
                    <div className="date-fields-grid">
                        <DateInput
                            label="Expiration Date of Current Stroke Certification"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                        />
                        <DateInput
                            label="Date of Application"
                            value={applicationDate}
                            onChange={(e) => setApplicationDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Thrombolytic Dates */}
                <div className="date-badge-section">
                    <div className="date-field-group">
                        <label className="date-field-label">
                            Dates of last twenty-five thrombolytic administrations
                        </label>
                        <div className="date-badge-input-row">
                            <input
                                type="date"
                                className="date-input"
                                style={{ flex: 1 }}
                                value={newThrombolyticDate}
                                onChange={handleThrombolyticDateChange}
                            />
                        </div>
                        {thrombolyticDates.length > 0 && (
                            <div className="date-badges-container">
                                {thrombolyticDates.map((date, index) => (
                                    <div key={index} className="date-badge">
                                        {new Date(date).toLocaleDateString()}
                                        <button className="badge-remove" onClick={() => removeThrombolyticDate(index)}>
                                            <IoClose />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Thrombolectomy Dates */}
                <div className="date-badge-section">
                    <div className="date-field-group">
                        <label className="date-field-label">Dates of last fifteen thrombolectomies</label>
                        <div className="date-badge-input-row">
                            <input
                                type="date"
                                className="date-input"
                                style={{ flex: 1 }}
                                value={newThrombolectomyDate}
                                onChange={handleThrombolectomyDateChange}
                            />
                        </div>
                        {thrombolectomyDates.length > 0 && (
                            <div className="date-badges-container">
                                {thrombolectomyDates.map((date, index) => (
                                    <div key={index} className="date-badge">
                                        {new Date(date).toLocaleDateString()}
                                        <button className="badge-remove" onClick={() => removeThrombolectomyDate(index)}>
                                            <IoClose />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* Buttons */}
            <div className="button-group">
                <button type="button" className="btn btn-outline" onClick={handlePrevious}>
                    Previous
                </button>
                <div className="right-buttons">
                    <button type="button" className="btn btn-primary" onClick={handleSave}>
                        Save
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleContinue}>
                        Continue
                    </button>
                </div>
            </div>

            {/* Fixed Support Chat Button */}
            <div className="support-chat-container">
                <button className="btn btn-support">
                    <BsPersonGear className="support-icon" aria-hidden="true" /> Support Chat
                </button>
            </div>
        </div>
    );
};

export default ServicesAndCertificationsForm;
