import React  from 'react';
import { useTranslation } from 'react-i18next';
import footerLogo from '../img/footerLogo.png';
import footerLogoAr from '../img/all/لوجو.png';
import { Link } from 'react-router-dom';
import './footer.css';

export default function Footer() {
    const { t, i18n } = useTranslation();


    return (
        <>
            <section className='footer text-white'>
                <div className='container pt-4'>
                    <div className="row">
                        {/* Adjust the logo source based on the language */}
                        <div className='col-lg-4 col-md-6 col-sm-12 mb-4 mb-lg-0'>
                            <div>
                                <img src={i18n.language === 'ar' ? footerLogoAr : footerLogo} alt="Logo" className="img-fluid" />
                                <p>{t('footer.welcome_message')}</p>
                            </div>
                        </div>

                        {/* Reversed column order for RTL */}
                        <div className='col-lg-8 col-md-6 col-sm-12'>
                            <div className="row">
                                <div className={`col-6 col-md-6 col-lg-3 ${i18n.language === 'ar' ? 'order-2' : ''}`}>
                                    <h4>{t('footer.main_pages')}</h4>
                                    <ul>
                                        <li><Link to="/home">{t('footer.home_page')}</Link></li>
                                        <li><Link to="/features/prescription">{t('footer.scan_medicine')}</Link></li>
                                        <li><Link to="/donation">{t('footer.donation')}</Link></li>
                                    </ul>
                                </div>
                                <div className={`col-6 col-md-6 col-lg-3 ${i18n.language === 'ar' ? 'order-3' : ''}`}>
                                    <h4>{t('footer.other_pages')}</h4>
                                    <ul>
                                        <li><Link to="/about">{t('footer.about_us')}</Link></li>
                                        <li><Link to="/contact">{t('footer.contact_us')}</Link></li>
                                        <li><Link to="/help">{t('footer.faqs')}</Link></li>
                                    </ul>
                                </div>
                                <div className={`col-6 col-md-6 col-lg-3 ${i18n.language === 'ar' ? 'order-4' : ''}`}>
                                    <h4>{t('footer.privacy_policy')}</h4>
                                    <ul>
                                        <li><Link to="/terms">{t('footer.terms_conditions')}</Link></li>
                                        <li><Link to="/terms">{t('footer.usage_policy')}</Link></li>
                                    </ul>
                                </div>
                                <div className={`col-6 col-md-6 col-lg-3 ${i18n.language === 'ar' ? 'order-5' : ''}`}>
                                    <h4>{t('footer.contact_us_header')}</h4>
                                    <ul className="list-unstyled">
                                        <li className='d-flex align-items-center'>
                                            <i className="fas fa-phone-alt text-white me-2"></i>
                                            <p className="mb-0">+20 Xxxxxx</p>
                                        </li>
                                        <li className='d-flex align-items-center'>
                                            <i className="fas fa-envelope text-white me-2"></i>
                                            <p className="mb-0">email@example.com</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div className="row">
                        <div className="col-12">
                            <p className='text-center'>{t('footer.all_rights_reserved')}</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
