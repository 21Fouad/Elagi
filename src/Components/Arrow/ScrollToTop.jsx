import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import if not already imported
import './ScrollToTop.css';

export default function ScrollToTop() {
    const { i18n } = useTranslation(); // Use the useTranslation hook
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 50) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className={`scroll-to-top ${i18n.language === 'ar' ? 'rtl' : ''}`}>
            {isVisible && 
                <div onClick={scrollToTop}>
                    <i className="fa-solid fa-circle-arrow-up icon"></i>
                </div>
            }
        </div>
    );
}
