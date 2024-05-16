import React, { useState } from 'react';
import './register.css';
import logo from '../img/Logo.png';
import لوجو from '../img/all/لوجو.png'
import imgg from '../img/7a473db50a795cb375d2e19267beb169.png';
import Glogo from '../img/Google__G__logo.svg'
import { Link , useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth } from '../../firebase-config.js';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import axios from 'axios';

export default function Register() {
    const { t, i18n } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        // Enforce account selection every time the user tries to sign in
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            });
    };

        const navigate = useNavigate();
        const [isLoading, setIsLoading] = useState(false);
        const [errors, setErrors] = useState({});
        const [successMessage, setSuccessMessage] = useState('');
        const [user, setUser] = useState({
            "fullname" : "",
            "email": "",
            "phone":"",
            "password": "",
            "password_confirmation": ""
})
    
    function getUser(e){
        const { name, value } = e.target;
        setUser(prevState => ({ ...prevState, [name]: value }));
    }

    async function submitRegister(e) {
        e.preventDefault();
        setIsLoading(true)
        setErrors({});
        setSuccessMessage('');

        try {
            await axios.post('http://localhost:8000/api/register', user)
                .then(() => { // Removed the 'response' argument since it's not used
                    // Update the success message state to inform the user
                    setIsLoading(false)
                    setSuccessMessage('Registration successful. Please check your email to verify.');
                    navigate('/OTP', { state: { email: user.email } });

                    // Optionally navigate to another page. For example, to the login page:
                    // navigate('/login');
                });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Assuming error response structure includes errors object for field-specific messages
                setIsLoading(false)
                setErrors(error.response.data.errors);
            } else {
                setIsLoading(false)
                // Handle other errors
                console.error("An error occurred:", error);
            }
        }
    }


    return (
        <>
            <section className='register'>
                <div className='container'>
                    <div className='row align-items-center justify-content-center min-vh-100'>
                        <div className='col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 bg-primary rounded py-5 text-center'>
                            <img src={i18n.language === 'ar' ? لوجو : logo} alt="Logo" className="mb-4" />
                            <img src={imgg} className='w-100' alt="Decorative"/>
                        </div>
                        <div className='col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 my-3 mx-auto rounded shadow-lg p-4 bg-light'>
                            <h1>{t('register.title')}</h1>
                            <p>{t('register.info')}</p>
                            {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
                            <form onSubmit={submitRegister}>
                                {/* Form Input */}
                                <div className='mb-3'>
                                    <label htmlFor="name" className='form-label'>{t('register.full_name')}</label>
                                    <div  className='input-group'>
                                        <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`} id="basic-addon1"><i className="fas fa-user"></i></span>
                                        <input onChange={getUser} type="text" name="fullname" id="name" className={`form-control ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`} placeholder={t('register.enter_name')} required/>
                                    </div>
                                    {errors.fullname && <div className="text-danger">{errors.fullname}</div>}
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="email" className='form-label'>{t('register.email')}</label>
                                    <div className='input-group'>
                                        <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`} id="basic-addon2"><i className="fas fa-envelope"></i></span>
                                        <input onChange={getUser}  type="email" name="email" id="email" className={`form-control ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`} placeholder={t('register.enter_email')} required/>
                                    </div>
                                    {errors.email && <div className="text-danger">{errors.email}</div>}
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="phone" className='form-label'>{t('register.phone')}</label>
                                    <div className='input-group phone'>
                                        <span className={`input-group-text text-white ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`} id="basic-addon3">+2</span>
                                        <input onChange={getUser} type="tel" name="phone" id="phone" className={`form-control phone-text ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`} placeholder={t('register.enter_phone')} required/>
                                    </div>
                                    {errors.phone && <div className="text-danger">{errors.phone}</div>}
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="password" className='form-label'>{t('register.password')}</label>
                                    <div className='input-group'>
                                        <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`} id="basic-addon4"><i className="fas fa-lock"></i></span>
                                        <input onChange={getUser} type={showPassword ? "text" : "password"} name="password" id="password" className='form-control' placeholder={t('register.enter_password')} required/>
                                        <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`} onClick={togglePasswordVisibility}>
                                            {showPassword ?  <i className="fas fa-eye-slash"></i>:<i className="fas fa-eye"></i> }
                                        </span>
                                    </div>
                                    {errors.password && <div className="text-danger">{errors.password}</div>}
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="confirm-password" className='form-label'>{t('register.confirm_password')}</label>
                                    <div className='input-group'>
                                        <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`} id="basic-addon5"><i className="fas fa-lock"></i></span>
                                        <input onChange={getUser} type={showConfirmPassword ? "text" : "password"} name="password_confirmation" id="confirm-password" className='form-control'placeholder={t('register.retype_password')} required/>
                                        <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`} onClick={toggleConfirmPasswordVisibility}>
                                            {showConfirmPassword ?  <i className="fas fa-eye-slash"></i> :<i className="fas fa-eye"></i>}
                                        </span>
                                    </div>
                                    {errors.password_confirmation && <div className="text-danger">{errors.password_confirmation}</div>}
                                </div>
                                {/* Confirm all terms and conditions */}
                                <div className="mb-3 form-check d-flex align-items-center">
                                            <input type="checkbox" className="form-check-input" id="check" required/>
                                            <label className="form-check-label ms-2" htmlFor="check"><Link to='/terms' className='text-primary'>{t('register.terms')}</Link></label>
                                </div>
                                {/* Submit Button */}
                                <div className='text-center mb-3'>
                                    <button type="submit" className="btn btn-primary px-5"> {isLoading?<i className='fas fa-spinner fa-spin'></i>:t('register.sign_up')}</button>
                                </div>
                            </form>
                              {/* Additional Links */}
                            <div className='text-center'>
                                <button onClick={signInWithGoogle} className="btn btn-outline-dark my-2 p-2">
                                    <img src={Glogo} alt="Not Loded" className='me-3 google-img'/>
                                    {t('register.google_sign_in')}                                
                                </button>
                            </div>
                            <div className='text-center '>
                                <p>{t('register.already_account')}  <Link to='/login' className='text-primary'>{t('register.login')}</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
