import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuote } from '../../context/QuoteContext';
import { IoChevronUp, IoChevronDown } from 'react-icons/io5';
import { BsPersonGear } from 'react-icons/bs';
import jsPDF from 'jspdf';
import './ReviewAndSubmitForm.css';

const ReviewAndSubmitForm = () => {
    const { data } = useQuote();
    const navigate = useNavigate();

    // Format phone number as (123) 456-7890
    const formatPhoneNumber = (phone) => {
        if (!phone) return '-';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length !== 10) return phone;
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    };

    const [expandedSections, setExpandedSections] = useState({
        hospital: true,
        facility: true,
        leadership: true,
        site: true,
        services: true
    });
    const [confirmed, setConfirmed] = useState(false);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handlePrevious = () => {
        navigate('/step5');
    };


    const handleSubmit = () => {
        if (confirmed) {
            console.log('='.repeat(60));
            console.log('DNV QUOTE REQUEST - FINAL SUBMISSION');
            console.log('='.repeat(60));
            console.log('\n📋 COMPLETE FORM PAYLOAD:\n');
            console.log(JSON.stringify(data, null, 2));
            console.log('\n' + '='.repeat(60));
            console.log('✅ Submission Time:', new Date().toLocaleString());
            console.log('='.repeat(60));
            alert('Application submitted successfully! Check console for payload details.');
        }
    };

    const handleSubmitAttempt = () => {
        if (!confirmed) {
            alert('⚠️ Please check the confirmation checkbox to certify that all information is accurate before submitting your application.');
        } else {
            handleSubmit();
        }
    };



    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        let yPos = 20;
        const lineHeight = 7;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;

        // Helper function to add text with page break check
        const addText = (text, x, y, options = {}) => {
            if (y > pageHeight - margin) {
                doc.addPage();
                return margin;
            }
            doc.text(text, x, y, options);
            return y;
        };

        // Title
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        yPos = addText('DNV Quote Request Form', 105, yPos, { align: 'center' });
        yPos += lineHeight * 2;

        // Hospital Information
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        yPos = addText('Basic Information', 20, yPos);
        yPos += lineHeight;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        yPos = addText(`Legal Entity Name: ${data.legalEntityName || '-'}`, 20, yPos);
        yPos += lineHeight;
        yPos = addText(`d/b/a Name: ${data.dbaName || '-'}`, 20, yPos);
        yPos += lineHeight;
        yPos = addText(`Primary Contact: ${data.firstName || ''} ${data.lastName || ''}`, 20, yPos);
        yPos += lineHeight;
        yPos = addText(`Email: ${data.email || '-'}`, 20, yPos);
        yPos += lineHeight;
        yPos = addText(`Phone: ${formatPhoneNumber(data.workPhone)}`, 20, yPos);
        yPos += lineHeight * 2;

        // Facility Details
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        yPos = addText('Facility Details', 20, yPos);
        yPos += lineHeight;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        yPos = addText(`Facility Type: ${data.facilityType || '-'}`, 20, yPos);
        yPos += lineHeight * 2;

        // Leadership Contacts
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        yPos = addText('Leadership Contacts', 20, yPos);
        yPos += lineHeight;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        // CEO
        yPos = addText(`CEO: ${data.ceo?.firstName || ''} ${data.ceo?.lastName || ''}`, 20, yPos);
        yPos += lineHeight;
        yPos = addText(`  Phone: ${formatPhoneNumber(data.ceo?.phone)}`, 20, yPos);
        yPos += lineHeight;
        yPos = addText(`  Email: ${data.ceo?.email || '-'}`, 20, yPos);
        yPos += lineHeight;

        // Director of Quality
        yPos = addText(`Director of Quality: ${data.quality?.firstName || ''} ${data.quality?.lastName || ''}`, 20, yPos);
        yPos += lineHeight;
        yPos = addText(`  Phone: ${formatPhoneNumber(data.quality?.phone)}`, 20, yPos);
        yPos += lineHeight;
        yPos = addText(`  Email: ${data.quality?.email || '-'}`, 20, yPos);
        yPos += lineHeight;

        // Invoicing Contact
        yPos = addText(`Invoicing Contact: ${data.invoicing?.firstName || ''} ${data.invoicing?.lastName || ''}`, 20, yPos);
        yPos += lineHeight;
        yPos = addText(`  Phone: ${formatPhoneNumber(data.invoicing?.phone)}`, 20, yPos);
        yPos += lineHeight;
        yPos = addText(`  Email: ${data.invoicing?.email || '-'}`, 20, yPos);
        yPos += lineHeight;
        if (data.invoicing?.address?.street) {
            yPos = addText(`  Billing Address: ${data.invoicing.address.street}`, 20, yPos);
            yPos += lineHeight;
            if (data.invoicing.address.city && data.invoicing.address.state && data.invoicing.address.zip) {
                yPos = addText(`    ${data.invoicing.address.city}, ${data.invoicing.address.state} ${data.invoicing.address.zip}`, 20, yPos);
                yPos += lineHeight;
            }
        }
        yPos += lineHeight * 2;

        // Site Information
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        yPos = addText('Site Information', 20, yPos);
        yPos += lineHeight;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const siteType = data.siteInfo?.type === 'single' ? 'Single Location' :
            `Multiple Locations (${data.practiceLocations?.length || 0} sites)`;
        yPos = addText(`Site Configuration: ${siteType}`, 20, yPos);
        yPos += lineHeight;

        if (data.practiceLocations && data.practiceLocations.length > 0) {
            data.practiceLocations.forEach((location, index) => {
                if (yPos > pageHeight - 40) {
                    doc.addPage();
                    yPos = margin;
                }
                yPos = addText(`Practice Location ${index + 1}:`, 20, yPos);
                yPos += lineHeight;
                yPos = addText(`  ${location.address || '-'}`, 20, yPos);
                yPos += lineHeight;
                yPos = addText(`  FTEs: ${location.ftes || '-'} | Shifts: ${location.shifts || '-'} | Miles to Main: ${location.milesToMain || '-'}`, 20, yPos);
                yPos += lineHeight;
                yPos = addText(`  Days Open: ${location.daysOpen || '-'}`, 20, yPos);
                yPos += lineHeight;
            });
        }
        yPos += lineHeight;

        // Services & Certifications
        if (yPos > pageHeight - 60) {
            doc.addPage();
            yPos = margin;
        }

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        yPos = addText('Services & Certifications', 20, yPos);
        yPos += lineHeight;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        if (data.servicesAndCertifications?.services?.length > 0) {
            yPos = addText(`Services: ${data.servicesAndCertifications.services.join(', ')}`, 20, yPos, { maxWidth: 170 });
            yPos += lineHeight * 2;
        }

        if (data.servicesAndCertifications?.standards?.length > 0) {
            yPos = addText(`Standards: ${data.servicesAndCertifications.standards.join(', ')}`, 20, yPos, { maxWidth: 170 });
            yPos += lineHeight * 2;
        }

        // Certification Dates
        if (data.servicesAndCertifications?.expirationDate) {
            yPos = addText(`Expiration Date of Current Stroke Certification: ${new Date(data.servicesAndCertifications.expirationDate).toLocaleDateString()}`, 20, yPos);
            yPos += lineHeight;
        }

        if (data.servicesAndCertifications?.applicationDate) {
            yPos = addText(`Date of Application: ${new Date(data.servicesAndCertifications.applicationDate).toLocaleDateString()}`, 20, yPos);
            yPos += lineHeight * 2;
        }

        // Thrombolytic Dates
        if (data.servicesAndCertifications?.thrombolyticDates?.length > 0) {
            if (yPos > pageHeight - 40) {
                doc.addPage();
                yPos = margin;
            }
            yPos = addText('Dates of last twenty-five thrombolytic administrations:', 20, yPos);
            yPos += lineHeight;
            const thrombolyticDatesStr = data.servicesAndCertifications.thrombolyticDates
                .map(date => new Date(date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }))
                .join(', ');
            const lines = doc.splitTextToSize(thrombolyticDatesStr, 170);
            lines.forEach(line => {
                if (yPos > pageHeight - margin) {
                    doc.addPage();
                    yPos = margin;
                }
                yPos = addText(line, 20, yPos);
                yPos += lineHeight;
            });
            yPos += lineHeight;
        }

        // Thrombectomy Dates
        if (data.servicesAndCertifications?.thrombolectomyDates?.length > 0) {
            if (yPos > pageHeight - 40) {
                doc.addPage();
                yPos = margin;
            }
            yPos = addText('Dates of last fifteen thrombolectomies:', 20, yPos);
            yPos += lineHeight;
            const thrombectomyDatesStr = data.servicesAndCertifications.thrombolectomyDates
                .map(date => new Date(date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }))
                .join(', ');
            const lines = doc.splitTextToSize(thrombectomyDatesStr, 170);
            lines.forEach(line => {
                if (yPos > pageHeight - margin) {
                    doc.addPage();
                    yPos = margin;
                }
                yPos = addText(line, 20, yPos);
                yPos += lineHeight;
            });
        }

        // Save PDF
        doc.save('medlaunch_form.pdf');
    };

    const handleExportCSV = () => {
        console.log('Export CSV clicked');
        alert('CSV export functionality would be implemented here');
    };

    return (
        <div className="review-container">
            {/* Parent Card for all sections */}
            <div className="review-parent-card">
                <h2 className="review-main-title">Hospital Information</h2>

                {/* Hospital Information */}
                <div className="review-section">
                    <div className="section-header" onClick={() => toggleSection('hospital')}>
                        {expandedSections.hospital ? <IoChevronUp /> : <IoChevronDown />}
                        <h3>Basic Information</h3>
                        <a href="#" className="edit-link" onClick={(e) => { e.stopPropagation(); navigate('/'); }}>
                            Edit
                        </a>
                    </div>
                    {expandedSections.hospital && (
                        <div className="section-content">
                            <div className="info-grid">
                                <div className="info-label">Legal Entity Name</div>
                                <div className="info-value">{data.legalEntityName || '-'}</div>
                            </div>
                            <div className="info-grid">
                                <div className="info-label">d/b/a Name</div>
                                <div className="info-value">{data.dbaName || '-'}</div>
                            </div>

                            <div className="info-grid" style={{ alignItems: 'flex-start' }}>
                                <div className="info-label">Primary Contact</div>
                                <div className="info-value">
                                    <div className="contact-group">
                                        <div className="contact-name">{`${data.firstName || ''} ${data.lastName || ''}`.trim() || '-'}</div>
                                        <div className="contact-detail">{data.title || 'Chief Executive Officer'}</div>
                                        <div className="contact-detail">
                                            Work: {formatPhoneNumber(data.workPhone)}
                                            {data.cellPhone && ` | Cell: ${formatPhoneNumber(data.cellPhone)}`}
                                        </div>
                                        <div className="contact-detail">
                                            Email: {data.email || '-'}
                                            {data.email && (
                                                <span className={`verification-badge ${data.emailVerified ? 'verified' : 'not-verified'}`}>
                                                    {data.emailVerified ? 'Verified' : 'Not Verified'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="contact-detail">
                                            Address: {data.address1 ?
                                                `${data.address1}${data.address2 ? `, ${data.address2}` : ''}, ${data.city}, ${data.state} ${data.zipCode}`
                                                : '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Facility Details */}
                <div className="review-section">
                    <div className="section-header" onClick={() => toggleSection('facility')}>
                        {expandedSections.facility ? <IoChevronUp /> : <IoChevronDown />}
                        <h3>Facility Details</h3>
                        <a href="#" className="edit-link" onClick={(e) => { e.stopPropagation(); navigate('/step2'); }}>
                            Edit
                        </a>
                    </div>
                    {expandedSections.facility && (
                        <div className="section-content">
                            <div className="info-grid">
                                <div className="info-label">Facility Type</div>
                                <div className="info-value">{data.facilityType || '-'}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Leadership Contacts */}
                <div className="review-section">
                    <div className="section-header" onClick={() => toggleSection('leadership')}>
                        {expandedSections.leadership ? <IoChevronUp /> : <IoChevronDown />}
                        <h3>Leadership Contacts</h3>
                        <a href="#" className="edit-link" onClick={(e) => { e.stopPropagation(); navigate('/step3'); }}>
                            Edit
                        </a>
                    </div>
                    {expandedSections.leadership && (
                        <div className="section-content">
                            <div className="info-grid" style={{ alignItems: 'flex-start' }}>
                                <div className="info-label">CEO</div>
                                <div className="info-value">
                                    <div className="contact-group">
                                        <div className="contact-name">
                                            {data.ceo?.firstName || data.ceo?.lastName ?
                                                `${data.ceo.firstName || ''} ${data.ceo.lastName || ''}`.trim() : '-'}
                                        </div>
                                        <div className="contact-detail">Phone: {formatPhoneNumber(data.ceo?.phone)}</div>
                                        <div className="contact-detail">Email: {data.ceo?.email || '-'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="info-grid" style={{ alignItems: 'flex-start' }}>
                                <div className="info-label">Director of Quality</div>
                                <div className="info-value">
                                    <div className="contact-group">
                                        <div className="contact-name">
                                            {data.quality?.firstName || data.quality?.lastName ?
                                                `${data.quality.firstName || ''} ${data.quality.lastName || ''}`.trim() : '-'}
                                        </div>
                                        <div className="contact-detail">Phone: {formatPhoneNumber(data.quality?.phone)}</div>
                                        <div className="contact-detail">Email: {data.quality?.email || '-'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="info-grid" style={{ alignItems: 'flex-start' }}>
                                <div className="info-label">Invoicing Contact</div>
                                <div className="info-value">
                                    <div className="contact-group">
                                        <div className="contact-name">
                                            {data.invoicing?.firstName || data.invoicing?.lastName ?
                                                `${data.invoicing.firstName || ''} ${data.invoicing.lastName || ''}`.trim() : '-'}
                                        </div>
                                        <div className="contact-detail">Phone: {formatPhoneNumber(data.invoicing?.phone)}</div>
                                        <div className="contact-detail">Email: {data.invoicing?.email || '-'}</div>
                                        {data.invoicing?.address?.street && (
                                            <div className="contact-detail">
                                                Billing Address: {data.invoicing.address.street}
                                                {data.invoicing.address.city && data.invoicing.address.state && data.invoicing.address.zip &&
                                                    `, ${data.invoicing.address.city}, ${data.invoicing.address.state} ${data.invoicing.address.zip}`}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Site Information */}
                <div className="review-section">
                    <div className="section-header" onClick={() => toggleSection('site')}>
                        {expandedSections.site ? <IoChevronUp /> : <IoChevronDown />}
                        <h3>Site Information</h3>
                        <a href="#" className="edit-link" onClick={(e) => { e.stopPropagation(); navigate('/step4'); }}>
                            Edit
                        </a>
                    </div>
                    {expandedSections.site && (
                        <div className="section-content">
                            <div className="info-grid">
                                <div className="info-label">Site Configuration</div>
                                <div className="info-value">
                                    {data.siteInfo?.type === 'single' ? 'Single Location' :
                                        data.siteInfo?.type === 'multiple' ? `Multiple Locations (${data.practiceLocations?.length || 0} sites)` : '-'}
                                </div>
                            </div>
                            <div className="info-grid no-border">
                                <div className="info-label">Input Method</div>
                                <div className="info-value">{data.siteInfo?.type === 'multiple' ? 'File Upload' : '-'}</div>
                            </div>
                            {data.practiceLocations && data.practiceLocations.length > 0 && (
                                <>
                                    {data.practiceLocations.map((location, index) => (
                                        <div key={index} className="info-grid no-border" style={{ alignItems: 'flex-start', marginTop: index === 0 ? '1rem' : '0' }}>
                                            <div className="info-label"></div>
                                            <div className="info-value">
                                                <div className="location-card">
                                                    <div className="location-title">Practice Location {index + 1}</div>
                                                    <div className="location-address">{location.address || '-'}</div>
                                                    <div className="location-metrics">
                                                        FTEs: {location.ftes || '-'} | Shifts: {location.shifts || '-'} | Miles to Main: {location.milesToMain || '-'}
                                                    </div>
                                                    <div className="location-days">Days Open: {location.daysOpen || '-'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Services & Certifications */}
                <div className="review-section">
                    <div className="section-header" onClick={() => toggleSection('services')}>
                        {expandedSections.services ? <IoChevronUp /> : <IoChevronDown />}
                        <h3>Services & Certifications</h3>
                        <a href="#" className="edit-link" onClick={(e) => { e.stopPropagation(); navigate('/step5'); }}>
                            Edit
                        </a>
                    </div>
                    {expandedSections.services && (
                        <div className="section-content">
                            <div className="info-grid">
                                <div className="info-label">Services Provided</div>
                                <div className="info-value">
                                    {data.servicesAndCertifications?.services?.length > 0 ? (
                                        <div className="tags-container">
                                            {data.servicesAndCertifications.services.map((service, index) => (
                                                <span key={index} className="tag-item">{service}</span>
                                            ))}
                                        </div>
                                    ) : '-'}
                                </div>
                            </div>
                            <div className="info-grid">
                                <div className="info-label">Standards to Apply</div>
                                <div className="info-value">
                                    {data.servicesAndCertifications?.standards?.length > 0 ? (
                                        <div className="tags-container">
                                            {data.servicesAndCertifications.standards.map((standard, index) => (
                                                <span key={index} className="tag-item-standards">{standard}</span>
                                            ))}
                                        </div>
                                    ) : '-'}
                                </div>
                            </div>
                            <div className="info-grid">
                                <div className="info-label">Date of Application</div>
                                <div className="info-value">
                                    {data.servicesAndCertifications?.applicationDate ?
                                        new Date(data.servicesAndCertifications.applicationDate).toLocaleDateString() : '-'}
                                </div>
                            </div>
                            <div className="info-grid">
                                <div className="info-label">Expiration Date of Current Stroke Certification</div>
                                <div className="info-value">
                                    {data.servicesAndCertifications?.expirationDate ?
                                        new Date(data.servicesAndCertifications.expirationDate).toLocaleDateString() : '-'}
                                </div>
                            </div>
                            <div className="info-grid">
                                <div className="info-label">Dates of last twenty-five thrombolytic administrations</div>
                                <div className="info-value">
                                    {data.servicesAndCertifications?.thrombolyticDates?.length > 0 ? (
                                        <div className="date-links">
                                            {data.servicesAndCertifications.thrombolyticDates.map((date, index) => (
                                                <span key={index}>
                                                    <span className="date-link">
                                                        {new Date(date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                                                    </span>
                                                    {index < data.servicesAndCertifications.thrombolyticDates.length - 1 && ', '}
                                                </span>
                                            ))}
                                        </div>
                                    ) : '-'}
                                </div>
                            </div>
                            <div className="info-grid">
                                <div className="info-label">Dates of last fifteen thrombolectomies</div>
                                <div className="info-value">
                                    {data.servicesAndCertifications?.thrombolectomyDates?.length > 0 ? (
                                        <div className="date-links">
                                            {data.servicesAndCertifications.thrombolectomyDates.map((date, index) => (
                                                <span key={index}>
                                                    <span className="date-link">
                                                        {new Date(date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                                                    </span>
                                                    {index < data.servicesAndCertifications.thrombolectomyDates.length - 1 && ', '}
                                                </span>
                                            ))}
                                        </div>
                                    ) : '-'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>


                {/* Ready to Submit */}
                <div className="submission-card">
                    <h2 className="submission-title">Ready to Submit?</h2>
                    <div className="confirmation-checkbox">
                        <input
                            type="checkbox"
                            id="confirm"
                            checked={confirmed}
                            onChange={(e) => setConfirmed(e.target.checked)}
                        />
                        <label htmlFor="confirm">
                            I certify that all information provided is accurate and complete to the best of my knowledge
                        </label>
                    </div>
                    <p className="submission-note">
                        By submitting this form, you agree to our terms and conditions. DNV will review your application and contact you within 2-3 business days.
                    </p>
                    <div className="action-buttons">
                        <button className="btn-download" onClick={handleDownloadPDF}>
                            Download as PDF
                        </button>
                        <button className="btn-export" onClick={handleExportCSV}>
                            Export to CSV
                        </button>
                    </div>
                </div> {/* End of review-parent-card */}
            </div>


            {/* Navigation Buttons */}
            <div className="button-group">
                <button type="button" className="btn btn-outline" onClick={handlePrevious}>
                    Previous
                </button>
                <div className="right-buttons">
                    <button
                        type="button"
                        className={`btn btn-primary ${!confirmed ? 'btn-disabled' : ''}`}
                        onClick={handleSubmitAttempt}
                    >
                        Submit Application
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

export default ReviewAndSubmitForm;
