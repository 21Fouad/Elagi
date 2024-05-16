import React, { useEffect, useState } from 'react';
import './navbar.css';
import axios from 'axios';
import logoNavEn from '../img/logonav.png';
import logoNavAr from '../img/all/لوجو.png';
import vector from '../img/Vector.png';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext'; 

export default function Navbar() {
    const { t, i18n} = useTranslation();
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
        toast.info('🔒 Logging you out... See you again soon!', { position: "top-center" });
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
            toast.success('✨ You have been successfully logged out!', { position: "top-center" });
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Something went wrong. Please try again.', { position: "top-center" });
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

    return (
        <>
            <ToastContainer />
            {showDiv && (
                <header className="container-fluid bg-white text-black text-center py-2 position-fixed top-0">
                    <div className="row align-items-center justify-content-around">
                        <div className="col-11">
                            <img src={vector} alt={t('navigation.offer')} width={24} height={24} />
                            <p className=' ps-md-2 d-inline offerTitle'>{t('navigation.offer')}  
                                <Link to="/products" className='text-primary ms-2 shop'>
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
            <nav className={`navbar navbar-expand-lg ${scroll ? "bg-primary" : "bg-primary"} fixed-top ${!showDiv ? '' : 'mt-5'}`}>
                <div className="container">
                    <a className="navbar-brand" href="/home">
                        <img src={i18n.language === 'ar' ? logoNavAr : logoNavEn} alt="Logo" width="121" height="37" className="d-inline-block align-text-top"/>
                    </a>
                    {/* Icons for small screens */}
                            <div  className='d-lg-none icons ms-auto'>
                                <Link to="/cart" className="nav-link d-inline position-relative mt-1">
                                    <i className="fas fa-shopping-cart text-white fa-2x icon-cart"></i>
                                    {cartQuantity > 0 && <span className="position-absolute top-25 start-75 mt-1 translate-middle badge rounded-pill bg-danger">{cartQuantity}</span>}
                                </Link>
                                <span className='text-white fa-2x px-2 ps-3'>|</span>
                                <a className="nav-link dropdown-toggle d-inline" href="#" role="button" data-bs-toggle="dropdown">
                                    <i className="fas fa-user-circle text-white fa-2x"></i>
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
                    <button className="navbar-toggler" type="button" onClick={() => setIsNavCollapsed(!isNavCollapsed)} data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded={!isNavCollapsed ? true : false} aria-label="Toggle navigation">
                        <span ><i className="fa-solid fa-bars fa-2x"></i></span>
                    </button>
                    <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarNavDropdown">
                        <ul className="navbar-nav mx-auto fw-bold">
                            <li className="nav-item">
                                <Link className="nav-link active bg-transparent" aria-current="page" to="/home">{t('navigation.home')}</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/catagories">{t('navigation.categories')}</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/products">{t('navigation.products')}</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/features">{t('navigation.features')}</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/about">{t('navigation.about_us')}</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/contact">{t('navigation.contact_us')}</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/help">{t('navigation.help_faq')}</Link>
                            </li>
                        </ul>
                        {/* Icons for large screens */}
                        {isLoggedIn ? (
                            <ul className='licons navbar-nav d-none d-lg-flex'>
                                <li className="nav-item position-relative mt-2">
                                    <Link to="/cart" className="nav-link d-inline position-relative">
                                        <i className="fas fa-shopping-cart text-white fa-2x icon-cart"></i>
                                        {cartQuantity > 0 && (
                                            <span className="position-absolute top-25 start-75 translate-middle badge rounded-pill bg-danger cart-badge">
                                                {cartQuantity}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                                <li className='text-white fa-2x ps-1'>|</li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                        <i className="fas fa-user-circle text-white fa-2x"></i>
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
                        <div className="navbar-nav lang mt-2">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {i18n.language === 'ar' ? 'العربية' : 'English'}
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <li><button className="dropdown-item" onClick={() => handleLanguageChange('en')}>English</button></li>
                                <li><button className="dropdown-item" onClick={() => handleLanguageChange('ar')}>العربية</button></li>
                                </ul>
                            </li>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
