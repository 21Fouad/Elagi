import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import './Checkout.css';

export default function CheckOut() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [cartItems, setCartItems] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const { data } = await axios.get('http://localhost:8000/api/cart', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCartItems(data);
            } catch (error) {
                console.error('Failed to fetch cart items:', error);
            }
        };

        fetchCartItems();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestData = { address, paymentMethod, cartItems };

        try {
            const { data } = await axios.post('http://localhost:8000/api/checkout', requestData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (paymentMethod === 'card') {
                window.location.href = data.paymentUrl;
            } else {
                // Display success message
                setMessageContent(t('checkout.success_message'));
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                    navigate('/order');
                }, 5000); 
            }
        } catch (error) {
            setMessageContent(t('checkout.failure_message'));
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 5000);
            console.error(error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            {showMessage && (
                <>
                    <div className="overlay-donation"></div>
                    <div className="message-card position-fixed top-50 start-50 translate-middle">
                        <div className="card">
                            <div className="card-body">
                                {messageContent}
                            </div>
                        </div>
                    </div>
                </>
            )}
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <form onSubmit={handleSubmit} className="p-4 shadow rounded">
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">{t('checkout.address_label')}</label>
                            <div className='input-group checkout'>
                                <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`} id="basic-addon1">
                                    <i className="fas fa-map-marked-alt"></i>
                                </span>
                                <input 
                                    type="text" 
                                    className={`form-control ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`} 
                                    id="address" value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                    required />
                            </div>
                            
                        </div>
                        <div className="mb-3">
                            <label htmlFor="paymentMethod" className="form-label">{t('checkout.payment_method_label')}</label>
                            <select className="form-select form-select-sm" id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="cash">{t('checkout.payment_options.cash')}</option>
                                <option value="card">{t('checkout.payment_options.card')}</option>
                            </select>
                        </div>
                        <div className='text-center'> 
                        <button type="submit" className="w-75 btn btn-primary">{t('checkout.complete_order_button')}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
