import React, { useEffect, useState } from 'react';
import './navbar.css';
import axios from 'axios';
import logoNavEn from '../img/logonav.png';
import logoNavAr from '../img/all/لوجو.png';
import vector from '../img/Vector.png';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext'; 

export default function Navbar() {
    const { t, i18n} = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showDiv, setShowDiv] = useState(true);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const { cartItems } = useCart(); 
    const [scroll, setScroll] = useState(false);
    const cartQuantity = cartItems.length;
    const { isLoggedIn, logout } = useAuth()

    useEffect(() => {
        const handleScroll = () => {
            setScroll(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = async () => {
        setIsLoading(true);
        enqueueSnackbar('🔒 Logging you out... See you again soon!', { variant: 'info' });
        try {
            const token = localStorage.getItem('userToken');
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            localStorage.removeItem('userToken');
            logout(); 
            navigate('/login', { replace: true });
            enqueueSnackbar('✨ You have been successfully logged out!', { variant: 'success' });
        } catch (error) {
            console.error('Logout error:', error);
            enqueueSnackbar('Something went wrong. Please try again.', { variant: 'error' });

        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    }, [i18n.language]);

    const handleLanguageChange = (language) => {
        i18n.changeLanguage(language);
    };

    // Toggle function for the language based on checkbox state
    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        handleLanguageChange(newLang);
    };
    

    return (
        <>
            {showDiv && (
                <header className="container-fluid bg-white text-black text-center py-2 position-fixed top-0">
                    <div className="row align-items-center justify-content-around">
                        <div className="col-11">
                            <img src={vector} alt={t('navigation.offer')} width={30} height={30} className='bg-white' />
                            <p className=' ps-md-2 d-inline offerTitle'>{t('navigation.offer')}  
                                <Link to="/medicines" className='text-primary ms-2 shop'>
                                    {t('navigation.shop_now')}
                                    <i className={`fas ${i18n.language === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'} ps-1`}></i>
                                </Link>
                            </p>
                        </div>
                        <div className='col-1'>
                            <button onClick={() => setShowDiv(false)} className={`close-btn ${i18n.language === 'ar' ? 'float-start p-0' : 'float-end'}`}>X</button>
                        </div>
                    </div>
                </header>
            )}
            <nav className={`navbar navbar-expand-lg nav-tabs ${scroll ? "bg-primary" : "bg-primary"} fixed-top ${!showDiv ? '' : 'mt-5'}`}>
                <div className="container">
                    <a className="navbar-brand" href="/home">
                        <img src={i18n.language === 'ar' ? logoNavAr : logoNavEn} alt="Logo" width="121" height="37" className="d-inline-block align-text-top"/>
                    </a>
                    {/* Icons for small screens */}
                            <div  className='d-lg-none icons ms-auto'>
                                <Link to="/cart" className="nav-link d-inline position-relative mt-1">
                                    <span className='rounded-circle bg-white px-1'>
                                        <i className="bi bi-cart3 text-primary fa-1x icon-cart"></i>
                                    </span>
                                    {cartQuantity > 0 && <span className="position-absolute top-25 start-75 mt-3 translate-middle badge rounded-pill bg-danger">{cartQuantity}</span>}
                                </Link>
                                <span className='text-white fa-2x px-2'>|</span>
                                <a className="nav-link dropdown-toggle d-inline" href="#" role="button" data-bs-toggle="dropdown">
                                    <span className='rounded-circle bg-white px-1'>
                                        <i className="bi bi-person text-primary fa-1x"></i>
                                    </span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link to="/profile" state={{ fromNavbar: true }} className="dropdown-item text-black">
                                        {t('navigation.profile')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" onClick={handleLogout} className="dropdown-item text-black">
                                        {isLoading ? "Logging out..." : t('navigation.logout')}
                                        </Link>
                                    </li>
                                </ul>
                            </div>                        
                    <button className="navbar-toggler mt-2" type="button" onClick={() => setIsNavCollapsed(!isNavCollapsed)} data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded={!isNavCollapsed ? true : false} aria-label="Toggle navigation">
                        <span ><i className="fa-solid fa-bars fa-1x"></i></span>
                    </button>
                    <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarNavDropdown">
                    <ul className="navbar-nav nav-tabs mx-auto fw-bold">
    <li className="nav-item">
        <NavLink className={({ isActive }) => "nav-link" + (isActive ? " text-primary bg-white" : "")} aria-current="page" to="/home">{t('navigation.home')}</NavLink>
    </li>
    <li className="nav-item">
        <NavLink className={({ isActive }) => "nav-link" + (isActive ? " text-primary bg-white" : "")} to="/Categories">{t('navigation.categories')}</NavLink>
    </li>
    <li className="nav-item">
        <NavLink className={({ isActive }) => "nav-link" + (isActive ? " text-primary bg-white" : "")} to="/medicines">{t('navigation.products')}</NavLink>
    </li>
    <li className="nav-item">
        <NavLink className={({ isActive }) => "nav-link" + (isActive ? " text-primary bg-white" : "")} to="/features">{t('navigation.features')}</NavLink>
    </li>
    <li className="nav-item">
        <NavLink className={({ isActive }) => "nav-link" + (isActive ? " text-primary bg-white" : "")} to="/about">{t('navigation.about_us')}</NavLink>
    </li>
    <li className="nav-item">
        <NavLink className={({ isActive }) => "nav-link" + (isActive ? " text-primary bg-white" : "")} to="/contact">{t('navigation.contact_us')}</NavLink>
    </li>
    <li className="nav-item">
        <NavLink className={({ isActive }) => "nav-link" + (isActive ? " text-primary bg-white" : "")} to="/help">{t('navigation.help_faq')}</NavLink>
    </li>
</ul>

                        {/* Icons for large screens */}
                        {isLoggedIn ? (
                            <ul className='licons navbar-nav d-none d-lg-flex align-items-baseline'>
                                <li className="nav-item position-relative mt-2">
                                    <Link to="/cart" className="nav-link d-inline position-relative">
                                        <span className='rounded-circle bg-white px-1'>
                                            <i className="bi bi-cart3 text-primary fa-1x icon-cart"></i>
                                        </span>
                                        {cartQuantity > 0 && (
                                            <span className="position-absolute top-25 start-75 translate-middle badge rounded-pill bg-danger cart-badge">
                                                {cartQuantity}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                                <li className='text-white fa-2x ps-1'>|</li>
                                <li className="nav-item dropdown mt-2">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                    <span className='rounded-circle bg-white px-1'>
                                        <i className="bi bi-person text-primary fa-1x icon-cart"></i>
                                    </span>
                                    </a>
                                    <ul className="dropdown-menu ">
                                        <li>
                                            <Link to="/profile" className="dropdown-item text-black">{t('navigation.profile')}</Link>
                                        </li>
                                        <li>
                                            <Link to="#" onClick={handleLogout} className="dropdown-item text-black">
                                            {isLoading ? "Logging out..." : t('navigation.logout')}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        ) : (
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link text-white">{t('navigation.login')}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/register" className="nav-link text-white">{t('navigation.register')}</Link>
                                </li>
                            </ul>
                        )}
                        <div className="navbar-nav lang">
                            <div className="switch">
                                <input id="language-toggle" className="check-toggle check-toggle-round-flat" type="checkbox" checked={i18n.language === 'en'} onChange={toggleLanguage}/>
                                <label htmlFor="language-toggle"></label>
                                <span className="on">AR</span>
                                <span className="off">EN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
