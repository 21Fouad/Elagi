import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './donation.css';
import donationImg from "../img/Home/donationImg.jpg";

export default function Donation() {
    const { t ,i18n} = useTranslation();
    const [donationAmount, setDonationAmount] = useState('');
    const [donorName, setDonorName] = useState('');
    const [loading, setLoading] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);

    const handleDonation = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:8000/api/donate', {
                amount: donationAmount,
                donorName: donorName,
            });
            setShowThankYou(true);
            setTimeout(() => {
                setShowThankYou(false);
                window.location.href = data.paymentUrl;
            }, 5000);
        } catch (error) {
            console.error('Donation error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {showThankYou && (
                <div className="overlay">
                    <div className="thank-you-card position-fixed top-50 start-50 translate-middle">
                        <div className="card text-center">
                            <div className="card-body">
                                <p className="card-text">{t('donation.thank_you')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="container d-flex justify-content-center align-items-center" style={{ height: "75vh" }}>
                <div className="row w-100">
                    <div className='col-md-5'>
                        <img src={donationImg} alt="Donation"className={`img-fluid ${i18n.language === 'ar' ? 'rtl-flip-image' : ''}`}/>
                    </div>
                    <div className="col-md-8 col-lg-6 ms-auto my-auto">
                        <form onSubmit={handleDonation} className="p-4 shadow rounded">
                            <div className="mb-3">
                                <label htmlFor="donationAmount" className="form-label">{t('donation.donation_amount')}</label>
                                <div className='input-group donation-amount'>
                                    <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`} id="basic-addon1"><i className="fas fa-hand-holding-usd"></i></span>
                                    <input
                                        type="number"
                                        className={`form-control ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`}
                                        id="donationAmount"
                                        value={donationAmount}
                                        onChange={(e) => setDonationAmount(e.target.value)}
                                        placeholder={t('donation.donation_amount_placeholder')}
                                        required
                                        min="1"
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="donorName" className="form-label">{t('donation.your_name')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="donorName"
                                    value={donorName}
                                    onChange={(e) => setDonorName(e.target.value)}
                                    placeholder={t('donation.your_name_placeholder')}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={loading || !donationAmount || donationAmount <= 0}>
                                {loading ? t('donation.processing') : t('donation.donate_button')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
