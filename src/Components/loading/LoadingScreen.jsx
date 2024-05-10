import React from 'react';
import logoNavEn from '../img/logonav.png';
import './loading.css'; 


export default function LoadingScreen() {
    return (
        <div className="loading-screen">
            <img src={logoNavEn} alt="Logo" className="loading-logo" />
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

