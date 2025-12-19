# DNV Healthcare Quote Request Application

A multi-step form application for healthcare organizations to request quotes for DNV Healthcare services and certifications. Built with React, this application provides a streamlined user experience for collecting facility information, leadership contacts, site details, and service requirements.

## Table of Contents
- [Installation & Setup](#installation--setup)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Development Approach](#development-approach)
- [Assumptions](#assumptions)
- [Known Issues & Limitations](#known-issues--limitations)

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone or download the repository**
   ```bash
   cd medlaunch_backup_latest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or another port if 5173 is in use) 

4. **Open your browser:**
   Navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Tech Stack

### Core Technologies
- **React 19.2.0** - UI library for building component-based interfaces
- **Vite 7.2.4** - Fast build tool and development server with HMR
- **React Router DOM 7.11.0** - Client-side routing for multi-step navigation

### Form Management & Validation
- **React Hook Form 7.68.0** - Performant form state management with built-in validation
- Custom validation rules for phone numbers, emails, ZIP codes, and names

### UI & Styling
-**Pure CSS** - Custom CSS with Flexbox, Grid, animations, and responsive design
- **React Icons 5.5.0** - Icon library (IoSearch, IoClose, BsPersonGear, etc.)

### Additional Libraries
- **jsPDF 3.0.4** - PDF generation for quote summaries (Step 6)
- **Context API** - Global state management for form data persistence

### Development Tools
- **ESLint 9.39.1** - Code linting and quality checks
- **@vitejs/plugin-react 5.1.1** - Vite plugin for React Fast Refresh

## Project Structure

```
src/
├── Steps/                      # Multi-step form components
│   ├── Step1/                  # Quote Request (Organization & Contact Info)
│   ├── Step2/                  # Facility Details
│   ├── Step3/                  # Leadership Contacts (CEO, Quality, Invoicing)
│   ├── Step4/                  # Site Information & Document Upload
│   ├── Step5/                  # Services & Certifications
│   └── Step6/                  # Review & Submit
├── components/
│   ├── PageWrapper/            # Header, Footer, Stepper
│   ├── Buttons/                # Reusable button components
│   ├── Checkbox/               # Checkbox styling
│   ├── Dates/                  # Date input components
│   ├── Responsiveness/         # Responsive design utilities
│   └── Validation/             # Form validation rules
├── context/
│   └── QuoteContext.jsx        # Global state management
├── utils/
│   ├── FormInput.jsx           # Reusable form input component
│   └── formUtils.js            # Form utilities (US states, etc.)
├── App.jsx                     # Main app component with routing
└── main.jsx                    # Application entry point
```

## Development Approach

### Architecture Decisions

1. **Multi-Step Form Pattern**
   - Each step is a separate route (`/step1` through `/step6`)
   - Context API manages form data across steps
   - Data persists when navigating between steps
   - Users can save progress and return later

2. **Component Modularity**
   - Reusable components (`FormInput`, `Button`, `DateInput`)
   - Shared CSS modules for consistency
   - Separation of concerns (UI, validation, state management)

3. **Form Management**
   - React Hook Form for performant form handling
   - Centralized validation rules in `validationRules.js`
   - Real-time validation with user-friendly error messages
   - "Same as Primary Contact" functionality to reduce data entry

4. **State Management**
   - Context API for global form state
   - Local state for component-specific UI (modals, dropdowns, etc.)
   - Form data structure mirrors the application flow

5. **User Experience**
   - Progress indicator (Stepper) shows current step
   - Save and Continue buttons for flexibility
   - Previous button for easy navigation
   - Support chat button (UI only, not functional)
   - Email verification UI (visual only)

6. **File Upload Handling**
   - Step 4 includes document upload interface
   - File preview with remove functionality
   - Drag-and-drop support (UI implemented)

## Assumptions

### Functional Assumptions
1. **Backend Integration**: The application is frontend-only. Backend API endpoints for:
   - Form submission
   - Email verification
   - File uploads
   - Data persistence
   are not implemented and would need to be added.

2. **Authentication**: No user authentication or session management is implemented. In production, this would be required for:
   - Saving partial applications
   - Retrieving saved quotes
   - User account management

3. **Email Verification**: The "Send Verification Email" button is UI-only and doesn't actually send emails.

4. **Support Chat**: The support chat button is a visual element only and doesn't connect to a real chat system.

5. **File Upload**: File upload in Step 4 stores files in component state but doesn't upload to a server.

6. **PDF Generation**: Step 6 generates a PDF summary using jsPDF, but this is client-side only.

### Data Assumptions
1. **US-Only**: The application assumes US-based organizations (US states dropdown, ZIP code validation).

2. **Phone Format**: Phone validation accepts various formats but doesn't enforce a specific format.

3. **Required Fields**: Required fields are marked with asterisks (*) and enforced via validation.

4. **Service Offerings**: The predefined service list is hardcoded and would need to be made dynamic for production.

### Technical Assumptions
1. **Modern Browsers**: The application targets modern browsers with ES6+ support.

2. **JavaScript Enabled**: The application requires JavaScript to function.

3. **Local Storage**: Browser local storage could be used for persistence (not currently implemented).

## Known Issues & Limitations

### Current Limitations

1. **No Data Persistence**
   - Form data is lost on page refresh
   - No backend integration for saving progress
   - **Workaround**: Complete the form in one session

2. **File Upload**
   - Files are stored in memory only
   - No actual upload to server
   - Large files may cause performance issues
   - **Recommendation**: Implement proper file upload service

3. **Email Verification**
   - Verification button is non-functional
   - No actual email sending capability
   - **Status**: UI placeholder only

4. **PDF Generation**
   - Basic PDF formatting
   - Limited styling options
   - May not render complex layouts perfectly
   - **Note**: Uses client-side jsPDF library

5. **Validation Edge Cases**
   - Phone number validation accepts multiple formats but may not catch all invalid numbers
   - ZIP code validation is basic (5 or 9 digits)
   - **Recommendation**: Implement server-side validation

6. **Accessibility**
   - Basic accessibility features implemented
   - Could benefit from enhanced ARIA labels
   - Keyboard navigation works but could be improved
   - **Recommendation**: Full accessibility audit needed

7. **Mobile Responsiveness**
   - Responsive design implemented
   - Some complex forms may be challenging on very small screens
   - **Status**: Tested on common viewport sizes

8. **Browser Compatibility**
   - Optimized for modern browsers (Chrome, Firefox, Safari, Edge)
   - May have issues with older browsers
   - **Recommendation**: Add polyfills if older browser support needed
