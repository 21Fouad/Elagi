import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import logo from '../img/Logo.png';
import لوجو from '../img/all/لوجو.png'
import imgg from '../img/7a473db50a795cb375d2e19267beb169.png';
import './forget.css'

export default function ForgetPassword() {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Regex to validate if email ends with @gmail.com
    const isValidEmail = email.endsWith('@gmail.com');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:8000/api/forgot-password', { email });
            console.log(response.data); // Show success message or next steps
            toast.success(t('forgotPassword.success_message'));
            navigate('/reset', { state: { email: email } });
        } catch (error) {
            console.error('Error sending email', error);
            toast.error(t('forgotPassword.error_message'));
        }finally{
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <section>
                <div className='container forget'>
                    <div className='row align-items-center justify-content-center min-vh-100'>
                        <div className='col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 bg-primary rounded py-5'>
                            <div className='text-center'>
                                <img src={i18n.language === 'ar' ? لوجو : logo} alt="Logo" className="mb-4" />
                                <img src={imgg} className='img-fluid mb-4' alt="Responsive" />
                            </div>
                        </div>
                        <div className='col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 mx-auto rounded shadow-lg p-4 bg-light'>
                            <h1 className="text-center mb-4">{t('forgotPassword.header')}</h1>
                            <form onSubmit={handleSubmit}>
                                <div className='mb-3'>
                                    <label htmlFor="email" className='form-label'>{t('forgotPassword.email_label')}</label>
                                    <div className='input-group'>
                                        <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`}><i className="fas fa-envelope"></i></span>
                                        <input
                                            type="email"
                                            value={email}
                                            name="email"
                                            id="email"
                                            className={`form-control ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={t('forgotPassword.email_placeholder')}
                                            required
                                        />
                                        </div>
                                        <div className='text-center mt-3'>
                                            <button type="submit" className="btn btn-primary px-5 text-light" disabled={!isValidEmail || isSubmitting}>
                                                {isSubmitting ? t('forgotPassword.sending') : t('forgotPassword.send_button')}
                                            </button>
                                        </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>

    );
}

