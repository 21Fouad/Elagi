import React, { useState, useEffect } from 'react';
import axios from 'axios';
import contactImg from '../img/Contact us-amico 1.jpg';
import './contact.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

export default function Contact() {
    const { t, i18n } = useTranslation();
    const [userData, setUserData] = useState({
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('userToken');
            if (!token) {
                toast.error(t('contact.login_required'));
                setIsLoading(false);
                return;
            }
            try {
                const response = await axios.get('http://localhost:8000/api/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const { name, email } = response.data;
                setUserData(prev => ({ ...prev, name, email }));
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error(t('contact.fetch_failed'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [t]);  // Add t to dependency array to re-run effect when language changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post('http://localhost:8000/api/contact/save', userData);
            toast.success(t('contact.message_sent'));
            setUserData({ ...userData, message: '' });
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error(t('contact.message_failed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <section>
                <div>
                    <h1 className="text-center pt-5">{t('contact.title')}</h1>
                </div>
                <div className='container my-5'>
                    <div className='row my-5 justify-content-center'>
                        <div className='col-12 col-sm-8 col-md-6 col-lg-6 col-xl-5 order-2 order-md-1 mx-auto rounded shadow-sm p-4 bg-light'>
                            <form onSubmit={handleSubmit} className='contact-form'>
                                <div className='mb-3'>
                                    <label htmlFor="name" className='form-label'>{t('contact.full_name')}</label>
                                    <div className='input-group'>
                                        <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`}>
                                            <i className="fas fa-user"></i>
                                        </span>
                                        <input 
                                            type="text" 
                                            className={`form-control ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`} 
                                            value={userData.name} 
                                            name="name" 
                                            disabled 
                                        />
                                    </div>
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="email" className='form-label'>{t('contact.email')}</label>
                                    <div className='input-group'>
                                        <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`}>
                                            <i className="fas fa-envelope"></i>
                                        </span>
                                        <input 
                                            type="email" 
                                            className={`form-control ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`} 
                                            value={userData.email} 
                                            name="email" 
                                            disabled 
                                        />
                                    </div>
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="message" className='form-label'>{t('contact.message')}</label>
                                    <textarea 
                                        className='form-control' 
                                        value={userData.message} 
                                        onChange={handleChange} 
                                        name="message" 
                                        rows="5" 
                                        placeholder={t('contact.enter_your_message')} 
                                        required>
                                    </textarea>
                                </div>
                                <div className='text-center mt-3'>
                                    <button type="submit" className="btn btn-primary w-100 px-5" disabled={isLoading || !(userData.message?.trim())}>
                                        {isLoading ? t('contact.sending') : t('contact.send_message')}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className='col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 order-1 order-md-2  mx-auto'>
                            <div className='text-center'>
                                <img src={i18n.language === 'ar' ? contactImg : contactImg} alt={t('contact.title')} className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </div>
            </section> 
            <section>
                <div className="map-container d-flex justify-content-center rounded mt-2">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d215.99616008078812!2d31.340086686224183!3d29.981195631214877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583968e093ce8f%3A0xeef17860c4d9fd97!2sBavaria%20Town%20compound!5e0!3m2!1sen!2seg!4v1711479138684!5m2!1sen!2seg"
                        width="100%"
                        height="350"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </section>
        </>
    );
}


