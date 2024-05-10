import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../img/Logo.png';
import logoAr from '../img/all/لوجو.png';
import imgg from '../img/7a473db50a795cb375d2e19267beb169.png';
import './reset.css'

export default function ResetPassword() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOtpChange = (element, index) => {
        if (!/^[0-9]$/.test(element.value)) return;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        if (element.value && index < 5) {
            element.form[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            const newOtp = [...otp];
            // Check if there's a value to clear at the current index; if not, move to the previous one
            if (otp[index]) {
                newOtp[index] = ''; // Clear the current input
                setOtp(newOtp);
            } else if (index > 0) {
                // If the current input is already empty, clear the previous one and focus it
                newOtp[index - 1] = '';
                setOtp(newOtp);
                e.preventDefault(); // Prevent the default backspace behavior
                // Focus the previous input box after a slight delay to ensure the state updates
                setTimeout(() => e.target.form.elements[index - 1].focus(), 0);
            }
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error(t('resetPassword.passwordMismatch'));
            return;
        }
        setIsSubmitting(true);
        try {
            const fullOtp = otp.join('');
            await axios.post('http://localhost:8000/api/reset-password', {
                email, otp: fullOtp, newPassword
            });
            toast.success(t('resetPassword.resetSuccess'));
            navigate('/login');
        } catch (error) {
            toast.error(t('resetPassword.resetError'));
        } finally {
            setIsSubmitting(false);
        }
    };
    const isFormReady = otp.every(num => num) && newPassword.length >= 8 && confirmPassword && (newPassword === confirmPassword);
    return (
        <>
        
        <section>
            <ToastContainer/>
            <div className='container'>
                <div className='row align-items-center justify-content-center min-vh-100'>
                    <div className='col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 bg-primary rounded py-5'>
                        <div>
                            <div className='text-center mt-2'>
                            <img src={i18n.language === 'ar' ? logoAr : logo} alt={t('resetPassword.title')} className="mb-4" />                                <img src={imgg} className='w-100'  alt="error"/>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 mx-auto rounded shadow-lg p-4 bg-light'>
                        <div>
                            <h1 className="text-center">{t('resetPassword.title')}</h1>
                            <p>{t('resetPassword.instruction')}</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                        {/* OTP fields */}
                            <label htmlFor="otp" className='form-label'>{t('resetPassword.otpLabel')}</label>
                            <div className="otp-field mb-4 d-flex justify-content-between">
                                    {otp.map((value, index) => (
                                        <input
                                            key={index}
                                            type="tel"
                                            className="form-control"
                                            maxLength="1"
                                            id='otp'
                                            value={value}
                                            onChange={e => handleOtpChange(e.target, index)}
                                            onKeyDown={e => handleKeyDown(e, index)}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    ))}
                            </div>
                            {/* Password field */}
                            <div className='mb-3 reset'>
                                <label htmlFor="password" className='form-label'>{t('resetPassword.newPassword')}</label>
                                <div className='input-group'>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`form-control ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder={t('resetPassword.newPasswordPlaceholder')}
                                        required
                                    />
                                    <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`} onClick={togglePasswordVisibility}>
                                        {showPassword ?  <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                                    </span>
                                    <br />
                                </div>
                                <p className="text-danger">Must be at least 8 char</p>
                            </div>
                            {/* Confirm Password field */}
                            <div className='mb-3 reset'>
                                <label htmlFor="confirm-password" className='form-label'>{t('resetPassword.confirmPassword')}</label>
                                <div className='input-group'>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={`form-control ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder={t('resetPassword.confirmPasswordPlaceholder')}
                                        required
                                    />
                                    <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`} onClick={toggleConfirmPasswordVisibility}>
                                        {showConfirmPassword ?  <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                                    </span>                                
                                </div>
                                <p className="text-danger">Must be as password</p>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={!isFormReady || isSubmitting}>
                                {isSubmitting ? t('resetPassword.loadingText') : t('resetPassword.confirmButton')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </section>
        
        
        
        </>
    )
}
