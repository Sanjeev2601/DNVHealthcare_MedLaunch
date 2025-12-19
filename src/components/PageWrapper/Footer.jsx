import React from 'react';
import './Footer.css';
import { BsPersonGear } from "react-icons/bs";
import { Button } from '../Buttons/Buttons';

const Footer = ({ onSave, onContinue, onPrevious, showPrevious }) => {
    return (
        <>
            <footer className="footer">
                <div className="footer-content">
                    {showPrevious ? (
                        <Button type="button" className="btn-outline" onClick={onPrevious}>Previous</Button>
                    ) : (
                        <Button type="button" className="btn-outline">Exit</Button>
                    )}

                    <div className="footer-actions">
                        {/* Actions handled by form actions usually, but placing global actions here too */}
                        <Button type="button" className="btn-primary" onClick={onSave} >Save</Button>
                        <Button type="submit" className="btn-primary" onClick={onContinue}>Continue</Button>
                    </div>
                </div>
            </footer>

            {/* Fixed Support Chat Button */}
            <div className="support-chat-container">
                <Button className="btn-support">
                    <BsPersonGear className="support-icon" aria-hidden="true" /> Support Chat
                </Button>
            </div>
        </>
    );
};

export default Footer;
