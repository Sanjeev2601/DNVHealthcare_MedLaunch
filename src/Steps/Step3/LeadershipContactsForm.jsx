import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useQuote } from '../../context/QuoteContext';
import FormInput from '../../utils/FormInput';
import { BsArrowRepeat } from "react-icons/bs";
import '../Step1/QuoteRequestForm.css';
import './LeadershipContactsForm.css';
import '../../components/Checkbox/Checkbox.css';
import '../../components/Responsiveness/Responsiveness.css';
import { US_STATES } from '../../utils/formUtils';
import { VALIDATION_RULES } from '../../components/Validation/validationRules';
import Footer from '../../components/PageWrapper/Footer';

const LeadershipContactsForm = () => {
    const { data, updateData } = useQuote();
    const navigate = useNavigate();

    // Helper to get default values
    const getDefaultValues = (section) => ({
        firstName: data[section]?.firstName || '',
        lastName: data[section]?.lastName || '',
        phone: data[section]?.phone || '',
        email: data[section]?.email || '',
        sameAsPrimary: data[section]?.sameAsPrimary || false,
        ...(section === 'invoicing' ? {
            address: {
                street: data.invoicing?.address?.street || '',
                city: data.invoicing?.address?.city || '',
                state: data.invoicing?.address?.state || '',
                zip: data.invoicing?.address?.zip || '',
            }
        } : {})
    });

    // Added trigger to destructuring
    const { register, handleSubmit, control, setValue, reset, watch, trigger, formState: { errors } } = useForm({
        defaultValues: {
            ceo: getDefaultValues('ceo'),
            quality: getDefaultValues('quality'),
            invoicing: getDefaultValues('invoicing')
        }
    });

    // Reset handled via context initial state generally
    useEffect(() => {
    }, [data]);

    // Watchers for "Same as Step 1" checkboxes
    const sameCeo = useWatch({ control, name: 'ceo.sameAsPrimary' });
    const sameQuality = useWatch({ control, name: 'quality.sameAsPrimary' });
    const sameInvoicing = useWatch({ control, name: 'invoicing.sameAsPrimary' });

    // Function to populate data from Step 1
    const populateFromStep1 = (section, isChecked) => {
        if (isChecked) {
            setValue(`${section}.firstName`, data.firstName || '', { shouldValidate: true });
            setValue(`${section}.lastName`, data.lastName || '', { shouldValidate: true });
            setValue(`${section}.phone`, data.workPhone || '', { shouldValidate: true });
            setValue(`${section}.email`, data.email || '', { shouldValidate: true });
        }
    };

    useEffect(() => populateFromStep1('ceo', sameCeo), [sameCeo, data]);
    useEffect(() => populateFromStep1('quality', sameQuality), [sameQuality, data]);
    useEffect(() => populateFromStep1('invoicing', sameInvoicing), [sameInvoicing, data]);


    const onSubmit = (formData) => {
        updateData(formData);
        console.log('Step 3 saved (Continue):', formData);
        navigate('/step4');
    };

    // Updated handleSave to validate first
    const handleSave = async () => {
        const isValid = await trigger();
        if (isValid) {
            const formData = watch();
            updateData(formData);
            console.log('Step 3 saved (Save):', formData);
        } else {
            console.log('Step 3 validation failed');
        }
    };

    const onPrevious = () => {
        navigate('/step2');
    };

    const clearEmail = (section) => {
        setValue(`${section}.email`, '', { shouldValidate: true });
    }

    return (
        <>
            <form className="quote-form" onSubmit={handleSubmit(onSubmit)}>

                {/* CEO Section */}
                <div className="contact-card">
                    <div className="form-section">
                        <h2 className="section-title">Chief Executive Officer (CEO)</h2>

                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="ceo.sameAsPrimary"
                                {...register('ceo.sameAsPrimary')}
                                className="form-checkbox"
                            />
                            <label htmlFor="ceo.sameAsPrimary" className="checkbox-label">Same as Primary Contact entered in Step 1</label>
                        </div>

                        <div className="form-row">
                            <FormInput
                                label="First Name"
                                name="ceo.firstName"
                                register={register}
                                validation={{ required: 'First Name is required', ...VALIDATION_RULES.name }}
                                errors={errors}
                                className="flex-1"
                                readOnly={sameCeo}
                            />
                            <FormInput
                                label="Last Name"
                                name="ceo.lastName"
                                register={register}
                                validation={{ required: 'Last Name is required', ...VALIDATION_RULES.name }}
                                errors={errors}
                                className="flex-1"
                                readOnly={sameCeo}
                            />
                        </div>

                        <FormInput
                            label="Phone"
                            name="ceo.phone"
                            register={register}
                            validation={{ required: 'Phone is required', ...VALIDATION_RULES.phone }}
                            errors={errors}
                            readOnly={sameCeo}
                        />

                        <div className="email-group-wrapper">
                            <FormInput
                                label="Email"
                                name="ceo.email"
                                register={register}
                                validation={{
                                    required: 'Email is required',
                                    ...VALIDATION_RULES.email
                                }}
                                errors={errors}
                                readOnly={sameCeo}
                                headerAction={
                                    <BsArrowRepeat
                                        className="refresh-icon-header"
                                        title="Clear Email"
                                        onClick={() => clearEmail('ceo')}
                                    />
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="contact-card">
                    {/* Director of Quality Section */}
                    <div className="form-section">
                        <h2 className="section-title">Director of Quality</h2>
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="quality.sameAsPrimary"
                                {...register('quality.sameAsPrimary')}
                                className="form-checkbox"
                            />
                            <label htmlFor="quality.sameAsPrimary" className="checkbox-label">Same as Primary Contact entered in Step 1</label>
                        </div>

                        <div className="form-row">
                            <FormInput
                                label="First Name"
                                name="quality.firstName"
                                register={register}
                                validation={{ ...VALIDATION_RULES.name }}
                                errors={errors}
                                className="flex-1"
                                readOnly={sameQuality}
                            />
                            <FormInput
                                label="Last Name"
                                name="quality.lastName"
                                register={register}
                                validation={{ ...VALIDATION_RULES.name }}
                                errors={errors}
                                className="flex-1"
                                readOnly={sameQuality}
                            />
                        </div>
                        <FormInput
                            label="Phone"
                            name="quality.phone"
                            register={register}
                            validation={{ ...VALIDATION_RULES.phone }}
                            errors={errors}
                            readOnly={sameQuality}
                        />
                        <div className="email-group-wrapper">
                            <FormInput
                                label="Email"
                                name="quality.email"
                                register={register}
                                validation={{ ...VALIDATION_RULES.email }}
                                errors={errors}
                                readOnly={sameQuality}
                                headerAction={
                                    <BsArrowRepeat
                                        className="refresh-icon-header"
                                        title="Clear Email"
                                        onClick={() => clearEmail('quality')}
                                    />
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="contact-card">
                    {/* Invoicing Contact Section */}
                    <div className="form-section">
                        <h2 className="section-title">Invoicing Contact</h2>
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="invoicing.sameAsPrimary"
                                {...register('invoicing.sameAsPrimary')}
                                className="form-checkbox"
                            />
                            <label htmlFor="invoicing.sameAsPrimary" className="checkbox-label">Same as Primary Contact entered in Step 1</label>
                        </div>

                        <div className="form-row">
                            <FormInput
                                label="First Name"
                                name="invoicing.firstName"
                                register={register}
                                validation={{ required: 'First Name is required', ...VALIDATION_RULES.name }}
                                errors={errors}
                                className="flex-1"
                                readOnly={sameInvoicing}
                            />
                            <FormInput
                                label="Last Name"
                                name="invoicing.lastName"
                                register={register}
                                validation={{ required: 'Last Name is required', ...VALIDATION_RULES.name }}
                                errors={errors}
                                className="flex-1"
                                readOnly={sameInvoicing}
                            />
                        </div>
                        <FormInput
                            label="Phone"
                            name="invoicing.phone"
                            register={register}
                            validation={{ required: 'Phone is required', ...VALIDATION_RULES.phone }}
                            errors={errors}
                            readOnly={sameInvoicing}
                        />
                        <div className="email-group-wrapper">
                            <FormInput
                                label="Email"
                                name="invoicing.email"
                                register={register}
                                validation={{
                                    required: 'Email is required',
                                    ...VALIDATION_RULES.email
                                }}
                                errors={errors}
                                readOnly={sameInvoicing}
                                headerAction={
                                    <BsArrowRepeat
                                        className="refresh-icon-header"
                                        title="Clear Email"
                                        onClick={() => clearEmail('invoicing')}
                                    />
                                }
                            />
                        </div>

                        {/* Billing Address Subsection */}
                        <h3 className="section-title" style={{ marginTop: '20px', fontWeight: 600, color: '#333' }}>Billing Address</h3>
                        <FormInput
                            label="Street Address"
                            name="invoicing.address.street"
                            register={register}
                            validation={{ required: 'Street Address is required' }}
                            errors={errors}
                        />

                        <div className="form-row">
                            <FormInput
                                label="City"
                                name="invoicing.address.city"
                                register={register}
                                validation={{ required: 'City is required', ...VALIDATION_RULES.name }}
                                errors={errors}
                                className="flex-1"
                            />

                            <div className="form-group flex-1">
                                <label className="form-label">State <span className="required">*</span></label>
                                <select
                                    className="form-input"
                                    {...register('invoicing.address.state', { required: 'State is required' })}
                                >
                                    <option value="">Select State</option>
                                    {US_STATES.map(state => (
                                        <option key={state.code} value={state.code}>{state.name}</option>
                                    ))}
                                </select>
                                {/* Manual nested error check for select since it's not using FormInput */}
                                {errors.invoicing?.address?.state && <span className="error-message">{errors.invoicing.address.state.message}</span>}
                            </div>

                            <FormInput
                                label="ZIP Code"
                                name="invoicing.address.zip"
                                register={register}
                                validation={{
                                    required: 'ZIP Code is required',
                                    ...VALIDATION_RULES.zip
                                }}
                                errors={errors}
                                className="flex-1"
                            />
                        </div>
                    </div>

                </div>
            </form>

            {/* Navigation Footer - Outside Card */}
            <Footer
                onContinue={handleSubmit(onSubmit)}
                onSave={handleSave}
                onPrevious={onPrevious}
                showPrevious={true}
            />
        </>
    );
};

export default LeadershipContactsForm;
