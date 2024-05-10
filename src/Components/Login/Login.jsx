import React, { useEffect, useState } from 'react';
import { Link, useNavigate ,useLocation  } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../img/Logo.png';
import لوجو from '../img/all/لوجو.png'
import imgg from '../img/7a473db50a795cb375d2e19267beb169.png';
import './login.css'; 

export default function Login() {
    const { t, i18n } = useTranslation();
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem('rememberedEmail');
        if (storedEmail) {
            setEmail(storedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleRememberMe = () => {
        setRememberMe(!rememberMe);
    };

    const { message } = location.state || {};


    React.useEffect(() => {
    
        if (message) {
            toast.success(message);
        }
    }, [message]);
    

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

     // Validates that the email ends with "@gmail.com"
    const isValidEmail = email.endsWith('@gmail.com');
     // Checks if the form is ready to be submitted
    const isFormReady = isValidEmail && password.length >= 8 && !isLoading;
    

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        toast.info(t('login.logging_in'), { position: "top-center" });
    
        try {
            const response = await axios.post('http://localhost:8000/api/login', {
                email,
                password
            });
            localStorage.setItem('userToken', response.data.token);
            console.log(response.data);
            login(response.data.token);
    
            // Save email to local storage if "Remember Me" is checked
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
    
            navigate('/home');
            setIsLoading(false);
        } catch (error) {
            console.error("Login error:", error);
            setIsLoading(false);
    
            // Use response data or fallback to a default error message
            const errorMessage = error.response?.data?.error || t('login.error_message');
            toast.error(errorMessage, { position: "top-center" });
    
            // Set error for display in the form
            setError(errorMessage);
        }
    };

    return (
        <>
            <ToastContainer />
            <section className='login'>
                <div className='container'>
                    <div className='row align-items-center justify-content-center min-vh-100'>
                        <div className='col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 bg-primary rounded py-5'>
                            <div className='text-center'>
                                <img src={i18n.language === 'ar' ? لوجو : logo} alt="Logo" className="mb-4" />
                                <img src={imgg} className='img-fluid mb-4' alt="Responsive" />
                            </div>
                        </div>
                        <div className='col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 mx-auto rounded shadow-lg p-4 bg-light'>
                            <h1 className="text-center mb-4">{t('login.header')}</h1>
                            {/* Error Message */}
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center" >
                                    <div className="flex-grow-1">
                                        <div className="text-danger">
                                            <i className={`fas fa-exclamation-triangle text-danger ${i18n.language === 'ar' ? 'ms-2' : 'me-2'}`}></i>    
                                            {error}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleLogin}>
                                {/* Email Input */}
                                <div className='mb-3'>
                                    <label htmlFor="email" className='form-label'>{t('login.email')}</label>
                                    <div className='input-group'>
                                        <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`}><i className="fas fa-envelope"></i></span>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className={`form-control ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`}
                                            placeholder={t('login.enter_email')}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Password Input */}
                                <div className='mb-3'>
                                    <label htmlFor="password" className='form-label'>{t('login.password')}</label>
                                    <div className='input-group'>
                                        <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`}><i className="fas fa-lock"></i></span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            id="password"
                                            className="form-control"
                                            placeholder={t('login.enter_password')}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`} onClick={togglePasswordVisibility}>
                                            {showPassword ?  <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                                        </span>
                                    </div>
                                </div>
                                {/* Remember Me & Forgot Password */}
                                <div className="mb-3 form-check d-flex justify-content-between">
                                    <div className='input-group'>
                                        <input type="checkbox" className="form-check-input" id="check" checked={rememberMe} onChange={handleRememberMe}/>
                                        <label className="form-check-label ms-2" htmlFor="check"><Link to='#' className='text-primary text-decoration-none'>{t('login.Remember_me')}</Link></label>
                                    </div>
                                    <div className='w-100 text-end forget'>
                                        <label className="form-label"><Link to='/forget' className='text-primary'>{t('login.forgot_password')}</Link></label>
                                    </div>
                                </div>
                                {/* Submit Button */}
                                <div className='text-center mb-3'>
                                    <button type="submit" className="btn btn-primary px-5" disabled={!isFormReady}>
                                        {isLoading ? <i className='fas fa-spinner fa-spin text-light'></i> : t('login.submit')}
                                    </button>
                                </div>
                                {/* Additional Links */}
                                <div className='text-center'>
                                    <p className="form-label"><Link to='/register' className='text-primary'>{t('login.sign_up')}</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
