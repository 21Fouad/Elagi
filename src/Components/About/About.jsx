import React from 'react';
import { useTranslation } from 'react-i18next';
import aboutImg from '../img/about.png';
import './about.css';

export default function About() {
    const { t, i18n } = useTranslation();

    const isArabic = i18n.language === 'ar';

    return (
        <>
            <section className='mt-5 py-5'>
                <div className='container'>
                    <div className="row align-items-center">
                        <div className={`col-12 col-md-6 mb-4 mb-md-0 bg-primary aboutImg-Background ${isArabic ? 'flip-horizontal' : ''}`}>
                            <img src={aboutImg} alt={t('about.title')} className='img-fluid' />
                        </div>
                        {/* Text column */}
                        <div className='col-12 col-md-6'>
                            <h3 className='hAbout'>{t('about.title')}</h3>
                            <p className='pAbout'>{t('about.description')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className='mt-3 pt-3 featuresImg text-white position-relative'>
                <div className='overlay'></div>
                <div className='container py-5 about-feature-content'>
                    <div className='row py-5'>
                        <div className='col-md-4'>
                            <h2 className='fa-2x text-center py-5'>{t('about.Ftitle')}</h2>
                        </div>
                        <div className='col-md-8 my-auto'>
                            <div className='d-flex justify-content-around text-center'>
                                <div>
                                    <i className="fas fa-headset text-white fa-2x"></i>
                                    <h3>{t('about.support247')}</h3>
                                </div>
                                <div>
                                    <i className="fas fa-motorcycle text-white fa-2x"></i>
                                    <h3>{t('about.fastShipping')}</h3>
                                </div>
                                <div>
                                    <i className="far fa-star text-white fa-2x"></i>
                                    <h3>{t('about.qualityAssurance')}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
