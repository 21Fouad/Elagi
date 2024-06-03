import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './profile.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

export default function Profile() {
    const { t, i18n } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [initialUserData, setInitialUserData] = useState({ name: '', email: '', phone: '' });
    const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
    const [validationError, setValidationError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isNameEditable, setIsNameEditable] = useState(false);
    const [isPhoneEditable, setIsPhoneEditable] = useState(false);
    const nameInputRef = useRef(null);
    const phoneInputRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('userToken');
            try {
                const response = await axios.get('http://localhost:8000/api/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(response.data); 
                setInitialUserData(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                enqueueSnackbar(t('errors.fetch_error'), { variant: 'error' });
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [t,enqueueSnackbar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'phone') {
            if (value.length !== 11) {
                setValidationError(t('validation.phone_length'));
            } else {
                setValidationError('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validationError) {
            enqueueSnackbar(validationError, { variant: 'error' });
            return;
        }
        setIsLoading(true);
        const token = localStorage.getItem('userToken');
        try {
            await axios.post('http://localhost:8000/api/user/update', userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            enqueueSnackbar(t('profile.update_success'), { variant: 'success' });
            setIsNameEditable(false);
            setIsPhoneEditable(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            enqueueSnackbar(t('profile.update_fail'), { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const hasDataChanged = () => {
        return JSON.stringify(userData) !== JSON.stringify(initialUserData) && !validationError;
    };

    useEffect(() => {
        if (isNameEditable) {
            nameInputRef.current.focus();
        }
    }, [isNameEditable]);
    
    useEffect(() => {
        if (isPhoneEditable) {
            phoneInputRef.current.focus();
        }
    }, [isPhoneEditable]);

    const handleEditClick = (field) => {
        if (field === 'name') {
            setIsNameEditable(true);
            nameInputRef.current.focus();
        } else if (field === 'phone') {
            setIsPhoneEditable(true);
            phoneInputRef.current.focus();
        }
    };

    return (
        <>
            <section>
                <div className='container pt-4'>
                    <div className='row align-items-center justify-content-center min-vh-100'>
                        <div className='col-12 col-sm-8 col-md-6 col-lg-4 profile rounded py-5'>
                            <div>
                                <h2>{t('profile.my_account')}</h2>
                                <Link to='/favorite' className={`text-black text-start btn btn-outline-primary my-2 profile-link ${i18n.language === 'ar' && 'text-end'}`}>{t('profile.my_favourite')}</Link>
                                <Link to='/order' className={`text-black text-start btn btn-outline-primary my-2 profile-link ${i18n.language === 'ar' && 'text-end'}`}>{t('profile.my_orders')}</Link>
                                <Link to='/feedback' className={`text-black text-start btn btn-outline-primary my-2 profile-link ${i18n.language === 'ar' && 'text-end'}`}>{t('profile.my_feedback')}</Link>
                            </div>
                        </div>
                        <div className='col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 mx-auto rounded shadow-lg p-4 bg-light'>
                            <h1 className="text-center mb-4">{t('profile.profile')}</h1>
                            <form onSubmit={handleSubmit} className='profile-form'>
                                <div className='mb-3'>
                                    <label htmlFor="name" className='form-label'>{t('profile.full_name')}</label>
                                    <div className='input-group'>
                                        <span className="input-group-text"><i className="fas fa-user"></i></span>
                                        <input
                                            className='form-control'
                                            value={userData.name}
                                            onChange={handleChange}
                                            name="name"
                                            type="text"
                                            disabled={!isNameEditable}
                                            ref={nameInputRef}
                                        />
                                        <span className="input-group-text" onClick={() => handleEditClick('name')}><i className="fas fa-edit"></i></span>
                                    </div>
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="email" className='form-label'>{t('profile.email')}</label>
                                    <input
                                        className='form-control'
                                        value={userData.email}
                                        name="email"
                                        type="email"
                                        disabled
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="phone" className='form-label'>{t('profile.phone_number')}</label>
                                    <div className='input-group phone'>
                                        <span className="input-group-text text-white" id="basic-addon3">+2</span>
                                        <input
                                            className='form-control'
                                            value={userData.phone}
                                            onChange={handleChange}
                                            name="phone"
                                            type="tel"
                                            disabled={!isPhoneEditable}
                                            ref={phoneInputRef}
                                        />
                                        <span className="input-group-text bg-light" onClick={() => handleEditClick('phone')}><i className="fas fa-edit"></i></span>
                                    </div>
                                    {validationError && <div className="text-danger mt-2">{validationError}</div>}
                                </div>
                                <div className='text-center mt-3'>
                                    <button type="submit" className="btn btn-primary px-5" disabled={!hasDataChanged() || isLoading}>
                                        {isLoading ? t('profile.saving') : t('profile.save_changes')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
