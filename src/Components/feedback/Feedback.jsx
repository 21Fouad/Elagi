import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import { useTranslation } from 'react-i18next';

const FeedbackForm = () => {
    const { t , i18n} = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [showThankYou, setShowThankYou] = useState(false);
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get('http://localhost:8000/api/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setName(data.name);
                setEmail(data.email);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/feedback', {
                name,
                email,
                feedback,
                rating,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
        setShowThankYou(true);
        setTimeout(() => {
            setShowThankYou(false);
        }, 5000);
    };

    return (
        <>
            {showThankYou && (
                <>
                    <div className="overlay-donation"></div>
                    <div className="thank-you-card position-fixed top-50 start-50 translate-middle">
                        <div className="card text-center">
                            <div className="card-body">
                                <p className="card-text">{t('feedback.thank_you')}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="userName" className="form-label">{t('feedback.name')}</label>
                                <div className='input-group'>
                                    <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`} id="basic-addon1">
                                        <i className="fas fa-user"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        id="userName" 
                                        className={`form-control ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`} 
                                        value={name} 
                                        readOnly 
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="userEmail" className="form-label">{t('feedback.email')}</label>
                                <div className='input-group'>
                                    <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`} id="basic-addon2">
                                        <i className="fas fa-envelope"></i>
                                    </span>
                                    <input 
                                        type="email" 
                                        id="userEmail" 
                                        className={`form-control ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`} 
                                        value={email} 
                                        readOnly 
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="userFeedback" className="form-label">{t('feedback.feedback')}</label>
                                <textarea id="userFeedback" className="form-control" rows="3" value={feedback} onChange={e => setFeedback(e.target.value)} required></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">{t('feedback.rating')}</label>
                                <ReactStars count={5} onChange={setRating} size={24} activeColor="#ffd700" value={rating} />
                            </div>
                            <button type="submit" className="btn btn-primary">{t('feedback.submit')}</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FeedbackForm;
