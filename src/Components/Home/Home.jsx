import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import headerImg1 from '../img/Home/header-image.png';
import firstLogo from '../img/Home/first-brand.png';
import secondLogo from '../img/Home/second-brand.png';
import thirdLogo from '../img/Home/third-brand.png';
import fourthLogo from '../img/Home/fourth-brand.png';
import fifthLogo from '../img/Home/fifth-brand.png';
import sixthLogo from '../img/Home/sixth-brand.png';
import offerLogo from '../img/Home/offer-logo.png';
import scanLogo from '../img/Home/scan-logo.png';
import './Home.css';
import { useTranslation } from 'react-i18next';

export default function Home() {
    const [feedbackList, setFeedbackList] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/feedback');
                setFeedbackList(response.data);
            } catch (error) {
                console.error('Error fetching feedback:', error);
            }
        };
        fetchFeedback();
    }, []);

    const chunkedFeedbackList = (feedbackList, chunkSize) => {
        let result = [];
        for (let i = 0; i < feedbackList.length; i += chunkSize) {
            result.push(feedbackList.slice(i, i + chunkSize));
        }
        return result;
    };

    const feedbackGroups = chunkedFeedbackList(feedbackList, 3);

    return (
        <>
            <section className='header-home'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-6 mt-5'>
                            <div>
                                <h1 className='title'><span>{t('home.intro')}</span> {t('home.intro_span')}</h1>
                                <p className='text-capitalize fs-5'>{t('home.description')}</p>
                                <div className='d-flex align-items-baseline'>
                                    <i className="fas fa-check-circle me-1"></i>
                                    <p>{t('home.scan')}</p>
                                </div>
                                <div className='d-flex align-items-baseline'>
                                    <i className="fas fa-check-circle me-1"></i>
                                    <p>{t('home.scanTest')}</p>
                                </div>
                                <div className='d-flex align-items-baseline'>
                                    <i className="fas fa-check-circle me-1"></i>
                                    <p>{t('home.payment')}</p>
                                </div>
                                <div className='discover'>
                                    <button type="button" className="btn btn-primary btn-lg d-flex align-items-center">
                                        <div>
                                            <Link to='/features' className='text-decoration-none'>
                                                <i className="fas fa-file-medical-alt text-white pe-4 fa-2x"></i>
                                                {t('home.discover')}
                                                <i className="fas fa-chevron-right text-white ps-4 fa-2x"></i>
                                            </Link>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <img src={headerImg1} alt={t('home.headerAlt')} className='img-fluid'/>
                        </div>
                    </div>
                </div>
            </section>

            <section className='featured_brands my-5'>
                <div className='container'>
                    <div className='d-flex justify-content-between'>
                        <h1>{t('home.Featured Brands')}</h1>
                        <Link to='#' className='text-primary text-decoration-none'>{t('home.View More')} <i className="fas fa-chevron-right"></i></Link>
                    </div>
                    <div className='row my-4'>
                        <img src={firstLogo} alt={t('home.firstBrand')} className='col-4 col-md-2 img-fluid'/>
                        <img src={secondLogo} alt={t('home.secondBrand')} className='col-4 col-md-2 img-fluid'/>
                        <img src={thirdLogo} alt={t('home.thirdBrand')} className='col-4 col-md-2 img-fluid'/>
                        <img src={fourthLogo} alt={t('home.fourthBrand')} className='col-4 col-md-2 img-fluid'/>
                        <img src={fifthLogo} alt={t('home.fifthBrand')} className='col-4 col-md-2 img-fluid'/>
                        <img src={sixthLogo} alt={t('home.sixthBrand')} className='col-4 col-md-2 img-fluid'/>
                    </div>
                </div>
            </section>

            <section className='my-5'>
                <div className='container mt-5'>
                    <div className="row justify-content-evenly">
                        <div className="col-md-5 get-offer rounded d-flex justify-content-between align-items-center p-3">
                            <div className='ms-2'>
                                <h4 className='text-white fa-2x offerTitile'>{t('home.offerTitle')}</h4>
                                <button role='button' className='btn btn-light'>
                                    <Link to='/products' className='text-black text-decoration-none'>{t('home.buyNow')}</Link>
                                </button>
                            </div>
                            <img src={offerLogo} alt={t('home.offerAlt')} className='img-fluid w-50'/>
                        </div>
                        <div className="col-md-5 mt-4 mt-md-0 scan-prescription rounded d-flex justify-content-between align-items-center">
                            <div className='ms-2'>
                                <h4 className='text-white fa-2x scanTitile'>{t('home.scanTitle')}</h4>
                                <button role='button' className='btn btn-light'>
                                    <Link to='/prescription' className='text-black text-decoration-none'>{t('home.scanNow')}</Link>
                                </button>
                            </div>
                            <img src={scanLogo} alt={t('home.scanAlt')} className='img-fluid w-50'/>
                        </div>
                    </div>
                </div>
            </section>

            <section className='my-5 overlay-offer position-relative'>
                <div className='container py-5 text-center'>
                    <div className='row justify-content-center'>
                        <div className='col-6 col-md-3 text-white'>
                            <h2 className='mb-0'>20M</h2>
                            <p>{t('home.supporters')}</p>
                        </div>
                        <div className='col-6 col-md-3 text-white'>
                            <h2 className='mb-0'>15K+</h2>
                            <p>{t('home.volunteers')}</p>
                        </div>
                        <div className='col-6 col-md-3 text-white'>
                            <h2 className='mb-0'>68K+</h2>
                            <p>{t('home.raised')}</p>
                        </div>
                        <div className='col-6 col-md-3 text-white'>
                            <h2 className='mb-0'>10M+</h2>
                            <p>{t('home.funded')}</p>
                        </div>
                    </div>
                </div>
                <div className='position-absolute bottom-50 start-50 translate-middle w-100 mb-5 mb-md-0 mb-lg-3 '>
                    <div className='container'>
                        <div className='bg-white p-3 shadow d-flex justify-content-between align-items-center rounded'>
                            <p className='mb-0'>
                                {t('home.generosityMessage')}
                            </p>
                            <button className='btn btn-primary'>
                                <Link to="/donation" className='text-decoration-none'>{t('home.donateNow')}</Link>
                                <i className="fas fa-heart ms-2 text-white heart-icon"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="container my-5">
                    <h2 className="mb-4 text-center">{t('home.feedbackTitle')}</h2>
                    <div id="feedbackCarousel" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {feedbackGroups.map((group, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <div className="row justify-content-center">
                                        {group.map((feedback, idx) => (
                                            <div key={idx} className="col-sm-6 col-md-4 d-flex align-items-stretch">
                                                <div className="card m-2 w-100">
                                                    <div className="card-body text-center">
                                                        <i className="far fa-user-circle fa-2x"></i>
                                                        <h5 className="card-title">{feedback.name}</h5>
                                                        <p>{t('home.customer')}</p>
                                                        <ReactStars value={feedback.rating} edit={false} size={24} activeColor="#ffd700"/>
                                                        <p className="card-text text-start">{feedback.feedback}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="carousel-indicators mt-5">
                            {feedbackGroups.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    data-bs-target="#feedbackCarousel"
                                    data-bs-slide-to={index}
                                    className={index === 0 ? "active" : ""}
                                    aria-current={index === 0 ? "true" : undefined}
                                    aria-label={`Slide ${index + 1}`}
                                    style={{backgroundColor: 'var(--bs-primary)'}}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
