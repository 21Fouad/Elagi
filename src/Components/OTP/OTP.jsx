import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "./Otp.css"; // Make sure the path is correct based on your project structure
import logo from '../img/Logo.png';
import لوجو from '../img/all/لوجو.png'
import imgg from '../img/7a473db50a795cb375d2e19267beb169.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function OTP() {
    const { t, i18n} = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email; // Extract email from location state

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
    

    const resendOtp = async () => {
        try {
            // Explicitly clear the verification error before attempting to resend the OTP
            setError('');
            const response = await axios.post('http://localhost:8000/api/resend-otp', { email });
            if (response.data.message) {
                // Inform the user about the OTP resend
                toast.info(response.data.message);
                // Reset the OTP fields to empty, allowing the user to input the new OTP
                setOtp(Array(6).fill(''));
            }
        } catch (error) {
            // Log the error for debugging
            console.error('Resend OTP Error:', error.response || error);
            // Display a toast message to inform the user that the OTP resend failed
            toast.error('Failed to resend OTP. Please try again.');
        }
    };
    
    const verifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true); 
        try {
            const response = await axios.post('http://localhost:8000/api/verify-otp', { email, otp: otp.join('') });
            if (response.data.message === 'OTP verified successfully. Account created.') {
                navigate('/login', { state: { message: 'OTP verified successfully. Please log in with your credentials.' } });
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Verification Error:', error.response || error);
            setError('An error occurred during OTP verification. Please try again.');
        } finally {
            setIsLoading(false); // Stop loading regardless of outcome
        }
    };
    const isOtpComplete = otp.every(value => /^[0-9]$/.test(value));

    
    

    return (
        <>
            <ToastContainer />
            <section>
                <div className='container'>
                    <div className='row align-items-center justify-content-center min-vh-100'>
                        <div className='col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 bg-primary rounded py-5 text-center'>
                            <img src={i18n.language === 'ar' ? لوجو : logo} alt="Logo" className='img-fluid'/>
                            <img src={imgg} className='w-100' alt="Decorative"/>
                        </div>
                        <div className='col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 mx-auto rounded shadow-lg p-4 bg-light'>
                            <div>
                                <h1 className='otp-title'>{t('otp.emailVerification')}</h1>
                                <p>{t('otp.verificationCodeSent')} {email ? `(${email})` : ''}, {t('otp.enterCodeHere')}</p>
                            </div>
                            <form className="otp-form" onSubmit={verifyOtp}>
                                <div className="otp-field mb-4 d-flex justify-content-between flex-row">
                                    {otp.map((data, index) => (
                                        <input
                                            key={index}
                                            type="tel"
                                            className='form-control'
                                            maxLength={1}
                                            value={data}
                                            onChange={e => handleOtpChange(e.target, index)}
                                            onKeyDown={e => handleKeyDown(e, index)}
                                            onFocus={e => e.target.select()}
                                        />
                                    ))}
                                </div>
                                {error && <div className="text-danger text-center">{error}</div>}
                                <div className="text-center">
                                    <button type="button" onClick={resendOtp} className="btn btn-link">{t('otp.resendCode')}</button>
                                </div>
                                <div className='text-center mb-3'>
                                <div className='text-center mb-3'>
                                    <button type="submit" className="btn btn-primary px-5" disabled={isLoading || !isOtpComplete}>
                                        {isLoading ? t('totp.verifying') : t('otp.confirm')}
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
