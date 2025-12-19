import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/PageWrapper/Header';
import Stepper from './components/PageWrapper/Stepper';
import QuoteRequestForm from './Steps/Step1/QuoteRequestForm';
import FacilityDetailsForm from './Steps/Step2/FacilityDetailsForm';
import LeadershipContactsForm from './Steps/Step3/LeadershipContactsForm';
import SiteInformationForm from './Steps/Step4/SiteInformationForm';
import ServicesAndCertificationsForm from './Steps/Step5/ServicesAndCertificationsForm';
import ReviewAndSubmitForm from './Steps/Step6/ReviewAndSubmitForm';
import Footer from './components/PageWrapper/Footer';
import { QuoteProvider } from './context/QuoteContext';
import './index.css';

const Layout = ({ children }) => {
  const location = useLocation();

  // Determine step based on path
  const determineCurrentStep = () => {
    if (location.pathname === '/') return 1;
    if (location.pathname === '/step2') return 2;
    if (location.pathname === '/step3') return 3;
    if (location.pathname === '/step4') return 4;
    if (location.pathname === '/step5') return 5;
    if (location.pathname === '/step6') return 6;
    return 1;
  };
  let currentStep = determineCurrentStep();

  return (
    <div className="app-container">
      <Header />
      <main>
        <Stepper currentStep={currentStep} />
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <QuoteProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/step1" replace />} />
            <Route path="/step1" element={<QuoteRequestForm />} />
            <Route path="/step2" element={<FacilityDetailsForm />} />
            <Route path="/step3" element={<LeadershipContactsForm />} />
            <Route path="/step4" element={<SiteInformationForm />} />
            <Route path="/step5" element={<ServicesAndCertificationsForm />} />
            <Route path="/step6" element={<ReviewAndSubmitForm />} />
          </Routes>
        </Layout>
      </Router>
    </QuoteProvider>
  );
}

export default App;
