import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function RareMedicineForm() {
    const { t, i18n } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        medicine_name: '',
        quantity: 1,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [quantityMessage, setQuantityMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('userToken');
            if (!token) {
                enqueueSnackbar(t('rare_medicine.auth_required'), { variant: 'error' });
                navigate('/login');
                setIsLoading(false);
                return;
            }
            try {
                const response = await axios.get('http://localhost:8000/api/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const { name, phone } = response.data;
                setFormData(prev => ({ ...prev, name, phone }));
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                enqueueSnackbar(t('errors.fetch_error'), { variant: 'error' });
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [t, enqueueSnackbar, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'quantity') {
            if (value < 1 || value > 3) {
                setQuantityMessage(t('rare_medicine.quantity_message'));
            } else {
                setQuantityMessage('');
            }
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.quantity < 1 || formData.quantity > 3) {
            enqueueSnackbar(t('rare_medicine.quantity_message'), { variant: 'error' });
            return;
        }
        try {
            await axios.post('http://localhost:8000/api/store-rare-medicine', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            setShowThankYou(true);
            setTimeout(() => setShowThankYou(false), 5000);
        } catch (error) {
            enqueueSnackbar(t('form.request_failed'), { variant: 'error' });
        }
    };

    return (
        <>
            {showThankYou && (
                <div className="overlay-donation">
                    <div className="thank-you-card position-fixed top-50 start-50 translate-middle">
                        <div className="card text-center">
                            <div className="card-body">
                                <p className="card-text">{t('rare_medicine.request_submitted')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className='container pt-4'>
                <div className='row align-items-center justify-content-center min-vh-100'>
                    <div className='col-md-6 mx-auto'>
                        <h1 className="text-center mb-4">{t('rare_medicine.request_form')}</h1>
                        <form onSubmit={handleSubmit} className='bg-light p-4 rounded shadow'>
                            <div className='mb-3'>
                                <label htmlFor="name" className='form-label'>{t('profile.full_name')}</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    name="name"
                                    value={formData.name}
                                    disabled
                                />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="phone" className='form-label'>{t('profile.phone_number')}</label>
                                <input
                                    type="tel"
                                    className={`form-control ${i18n.language === 'ar' ? 'text-end' : 'text-start'}`}
                                    name="phone"
                                    value={formData.phone}
                                    disabled
                                />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="medicine_name" className='form-label'>{t('rare_medicine.medicine_name')}</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    name="medicine_name"
                                    value={formData.medicine_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="address" className='form-label'>{t('rare_medicine.address')}</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="quantity" className='form-label'>{t('rare_medicine.quantity')}</label>
                                <input
                                    type="number"
                                    className='form-control'
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    min="1"
                                    max="3"
                                    required
                                />
                                {quantityMessage && <div className="text-danger">{quantityMessage}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                                {isLoading ? t('form.sending') : t('rare_medicine.submit_request')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
