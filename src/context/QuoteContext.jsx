import React, { createContext, useState, useContext } from 'react';

const QuoteContext = createContext();

export const useQuote = () => useContext(QuoteContext);

export const QuoteProvider = ({ children }) => {
    const [data, setData] = useState({
        // Step 1
        legalEntityName: '',
        dbaName: '',
        sameAsLegal: false,
        firstName: '',
        lastName: '',
        title: '',
        workPhone: '',
        cellPhone: '',
        email: '',

        // Step 2
        facilityType: '',

        // Step 3
        ceo: {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            sameAsPrimary: false
        },
        quality: {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            sameAsPrimary: false
        },
        invoicing: {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            sameAsPrimary: false,
            address: {
                street: '',
                city: '',
                state: '',
                zip: ''
            }
        },

        // Step 4
        siteInfo: {
            type: '' // 'single' | 'multiple'
        },
        practiceLocations: [], // Array of practice locations from CSV upload

        // Step 5
        servicesAndCertifications: {
            services: [],
            standards: [],
            expirationDate: '',
            applicationDate: '',
            thrombolyticDates: [],
            thrombolectomyDates: []
        }
    });

    const updateData = (newData) => {
        setData(prev => ({ ...prev, ...newData }));
    };

    return (
        <QuoteContext.Provider value={{ data, updateData }}>
            {children}
        </QuoteContext.Provider>
    );
};
