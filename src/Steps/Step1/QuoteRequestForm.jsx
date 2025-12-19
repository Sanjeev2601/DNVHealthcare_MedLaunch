import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useQuote } from '../../context/QuoteContext';
import { BsArrowRepeat } from "react-icons/bs";
import FormInput from '../../utils/FormInput';
import Footer from '../../components/PageWrapper/Footer';
import './QuoteRequestForm.css';
import '../../components/Checkbox/Checkbox.css';
import '../../components/Responsiveness/Responsiveness.css';
import { Button } from '../../components/Buttons/Buttons';
import { VALIDATION_RULES } from '../../components/Validation/validationRules';

const QuoteRequestForm = () => {
    const { data, updateData } = useQuote();
    const navigate = useNavigate();

    const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            legalEntityName: data.legalEntityName,
            dbaName: data.dbaName,
            sameAsLegal: data.sameAsLegal,
            firstName: data.firstName,
            lastName: data.lastName,
            title: data.title,
            workPhone: data.workPhone,
            cellPhone: data.cellPhone,
            email: data.email
        }
    });

    useEffect(() => {
        reset(data);
    }, [data, reset]);

    const sameAsLegal = useWatch({ control, name: 'sameAsLegal' });
    const legalEntityName = useWatch({ control, name: 'legalEntityName' });

    useEffect(() => {
        if (sameAsLegal) {
            setValue('dbaName', legalEntityName, { shouldValidate: true });
        }
    }, [sameAsLegal, legalEntityName, setValue]);

    const onSubmit = (formData) => {
        updateData(formData);
        console.log('Step 1 saved:', formData);
        navigate('/step2');
    };

    const handleSave = () => {
        console.log('Save clicked');
    };

    const handleContinue = () => {
        handleSubmit(onSubmit)();
    };

    return (
        <>
            <form className="quote-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-section">
                    <h2 className="section-title">Identify Healthcare Organization</h2>

                    <FormInput
                        label="Legal Entity Name"
                        name="legalEntityName"
                        register={register}
                        validation={{ required: 'Legal Entity Name is required' }}
                        errors={errors}
                    />

                    <FormInput
                        label="Doing Business As (d/b/a) Name"
                        name="dbaName"
                        register={register}
                        validation={{ required: 'DBA Name is required' }}
                        errors={errors}
                        readOnly={sameAsLegal}
                    />

                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="sameAsLegal"
                            {...register('sameAsLegal')}
                            className="form-checkbox"
                        />
                        <label htmlFor="sameAsLegal" className="checkbox-label">Same as Legal Entity Name</label>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title">Primary Contact Information</h2>
                    <p className="section-subtitle">Primary contact receives all DNV Healthcare official communications</p>

                    <div className="form-row">
                        <FormInput
                            label="First Name"
                            name="firstName"
                            register={register}
                            validation={{
                                required: 'First Name is required',
                                ...VALIDATION_RULES.name
                            }}
                            errors={errors}
                            className="flex-1"
                        />
                        <FormInput
                            label="Last Name"
                            name="lastName"
                            register={register}
                            validation={{
                                required: 'Last Name is required',
                                ...VALIDATION_RULES.name
                            }}
                            errors={errors}
                            className="flex-1"
                        />
                    </div>

                    <FormInput
                        label="Title"
                        name="title"
                        register={register}
                        validation={{ required: 'Title is required' }}
                        errors={errors}
                    />

                    <div className="form-row">
                        <FormInput
                            label="Work Phone"
                            name="workPhone"
                            register={register}
                            validation={{
                                required: 'Work Phone is required',
                                ...VALIDATION_RULES.phone
                            }}
                            errors={errors}
                            className="flex-1"
                        />
                        <FormInput
                            label="Cell Phone"
                            name="cellPhone"
                            register={register}
                            validation={{
                                required: false,
                                ...VALIDATION_RULES.phone
                            }}
                            errors={errors}
                            className="flex-1"
                        />
                    </div>

                    <div className="email-group-wrapper">
                        <FormInput
                            label="Email"
                            name="email"
                            register={register}
                            validation={{
                                required: 'Email is required',
                                ...VALIDATION_RULES.email
                            }}
                            errors={errors}
                            headerAction={
                                <BsArrowRepeat
                                    className="refresh-icon-header"
                                    title="Clear Email"
                                    onClick={() => setValue('email', '', { shouldValidate: true })}
                                />
                            }
                        />
                    </div>

                    <div className="verification-row">
                        <Button type="button" className="btn-outline btn-verify">Send Verification Email</Button>
                        <span className="badge-not-verified">Not verified</span>
                    </div>

                </div>
            </form>

            {/* Navigation Footer - Outside Card */}
            <Footer onSave={handleSave} onContinue={handleContinue} showPrevious={false} />
        </>
    );
};

export default QuoteRequestForm;
