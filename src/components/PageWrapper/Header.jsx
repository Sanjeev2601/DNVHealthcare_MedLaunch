import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo-section">
                    <span className="brand-name">DNV Healthcare</span>
                </div>
                <div className="user-section">
                    <div className="details-circle">SGJ</div>
                    <span className="user-name">Sona Grace John</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
