import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuote } from '../../context/QuoteContext';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { FiUploadCloud } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { BsPersonGear } from 'react-icons/bs';
import './SiteInformationForm.css';
import { Button } from '../../components/Buttons/Buttons';

const SiteInformationForm = () => {
    const { data, updateData } = useQuote();
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState(data.siteInfo?.type || '');
    const [uploadMethodSelected, setUploadMethodSelected] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [parsedLocations, setParsedLocations] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (data.siteInfo?.type) {
            setSelectedType(data.siteInfo.type);
        }
    }, [data.siteInfo]);

    const handleSelect = (type) => {
        setSelectedType(type);
        // Reset upload state when changing selection
        if (type === 'single') {
            setUploadMethodSelected(false);
            setUploadedFile(null);
            setParsedLocations([]);
        }
    };

    const handleSave = () => {
        updateData({ siteInfo: { type: selectedType } });
        console.log('Step 4 saved (Save):', { ...data, siteInfo: { type: selectedType } });
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
            parseCSV(file);
        }
    };

    const parseCSV = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const rows = text.split('\n').filter(row => row.trim());

            if (rows.length < 2) {
                alert('CSV file is empty or invalid');
                return;
            }

            // Helper function to parse CSV row respecting quotes
            const parseCSVRow = (row) => {
                const values = [];
                let current = '';
                let inQuotes = false;

                for (let i = 0; i < row.length; i++) {
                    const char = row[i];
                    const nextChar = row[i + 1];

                    if (char === '"') {
                        if (inQuotes && nextChar === '"') {
                            // Handle escaped quote
                            current += '"';
                            i++; // Skip next quote
                        } else {
                            // Toggle quote state
                            inQuotes = !inQuotes;
                        }
                    } else if (char === ',' && !inQuotes) {
                        // End of field
                        values.push(current.trim());
                        current = '';
                    } else {
                        current += char;
                    }
                }
                // Push last field
                values.push(current.trim());
                return values;
            };

            // Parse header and data rows
            const headers = parseCSVRow(rows[0]);
            const locations = [];

            for (let i = 1; i < rows.length; i++) {
                const values = parseCSVRow(rows[i]);
                const location = {
                    address: values[headers.indexOf('Address')] || '',
                    zipCode: values[headers.indexOf('Zip Code')] || '',
                    ftes: values[headers.indexOf('FTEs')] || '',
                    shifts: values[headers.indexOf('Shifts')] || '',
                    milesToMain: values[headers.indexOf('Miles to Main')] || values[headers.indexOf('Miltes to Main')] || '',
                    daysOpen: values[headers.indexOf('Days Open')] || ''
                };
                locations.push(location);
            }

            setParsedLocations(locations);
            console.log('CSV Parsed:', locations);
        };
        reader.readAsText(file);
    };

    const onContinue = () => {
        if (!selectedType) {
            alert('Please select an option to continue.');
            return;
        }

        // Validation for Multiple Locations
        if (selectedType === 'multiple') {
            if (!uploadMethodSelected) {
                alert('Please select an input method to continue.');
                return;
            }
            if (parsedLocations.length === 0) {
                alert('Please upload a file with site information to continue.');
                return;
            }
        }

        const updatedData = {
            siteInfo: { type: selectedType },
            practiceLocations: selectedType === 'multiple' ? parsedLocations : []
        };

        updateData(updatedData);

        if (selectedType === 'multiple' && parsedLocations.length > 0) {
            parsedLocations.forEach((location, index) => {
                console.log(`Practice Location ${index + 1}:`, location);
            });
            console.log('Step 4 saved (Continue) - All Locations:', {
                ...data,
                ...updatedData
            });
        } else {
            console.log('Step 4 saved (Continue):', { ...data, siteInfo: { type: selectedType } });
        }
        navigate('/step5');
    };

    const onPrevious = () => {
        navigate('/step3');
    };

    const handleDownloadTemplate = (e) => {
        e.preventDefault();
        const link = document.createElement('a');
        link.href = '/src/assets/Template.csv';
        link.download = 'Template.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setUploadedFile(file);
            parseCSV(file);
        }
    };


    return (
        <>
            <div className="site-info-card">
                <div className="site-info-container">
                    <h2 className="site-selection-title">Do you have multiple sites or locations?</h2>

                    <div className="site-cards-container">
                        <div
                            className={`site-card ${selectedType === 'single' ? 'selected' : ''}`}
                            onClick={() => handleSelect('single')}
                        >
                            <h3>Single Location</h3>
                            <p>We operate from one facility only</p>
                        </div>

                        <div
                            className={`site-card ${selectedType === 'multiple' ? 'selected' : ''}`}
                            onClick={() => handleSelect('multiple')}
                        >
                            <h3>Multiple Locations</h3>
                            <p>We have multiple facilities or practice locations</p>
                        </div>
                    </div>

                    {selectedType === 'multiple' && (
                        <div className="upload-container">
                            <h3 className="upload-section-title">How would you like to add your site information?</h3>

                            <div
                                className={`upload-method-card ${uploadMethodSelected ? 'selected' : ''}`}
                                onClick={() => setUploadMethodSelected(true)}
                            >
                                <div className="upload-method-header">
                                    <h4>Upload CSV / Excel</h4>
                                    <p>Upload a spreadsheet with all site information</p>
                                </div>
                            </div>

                            {uploadMethodSelected && (
                                <div className="upload-wrapper">
                                    <div
                                        className={`upload-section ${dragActive ? 'drag-active' : ''}`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <FiUploadCloud className="upload-icon" />
                                        <div className="upload-text">Upload Site Information</div>
                                        <div className="upload-subtext">
                                            Drag and drop your CSV or Excel file here, or click to select
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                            accept=".csv,.xlsx,.xls"
                                            style={{ display: 'none' }}
                                        />
                                        <Button
                                            type="button"
                                            className="btn-upload"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRef.current?.click();
                                            }}
                                        >
                                            Select file
                                        </Button>
                                        <a href="#" className="download-template" onClick={handleDownloadTemplate}>Download CSV Template</a>
                                    </div>

                                    {uploadedFile && (
                                        <div className="uploaded-files-inline">
                                            <h5>Uploaded</h5>
                                            <div className="uploaded-file-item">
                                                <IoDocumentTextOutline className="file-icon" />
                                                <div className="file-details">
                                                    <span className="file-name">{uploadedFile.name}</span>
                                                    <span className="file-preview"> • Preview</span>
                                                </div>
                                                <span className="file-size">{(uploadedFile.size / 1024).toFixed(1)}KB</span>
                                                <Button
                                                    className="remove-file-btn-circle"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setUploadedFile(null);
                                                        setParsedLocations([]);
                                                    }}
                                                >
                                                    <IoMdClose />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Buttons - Outside Card */}
            <div className="button-group">
                <Button type="button" className="btn-outline" onClick={onPrevious}>Previous</Button>
                <div className="right-buttons">
                    <Button type="button" className="btn-primary" onClick={handleSave}>Save</Button>
                    <Button type="button" className="btn-primary" onClick={onContinue}>Continue</Button>
                </div>
            </div>

            {/* Fixed Support Chat Button */}
            <div className="support-chat-container">
                <Button className="btn-support">
                    <BsPersonGear className="support-icon" aria-hidden="true" /> Support Chat
                </Button>
            </div>
        </>
    );
};

export default SiteInformationForm;
