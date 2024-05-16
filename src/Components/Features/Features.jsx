import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import botImg from '../img/featureImgs/Chatbots-for-pharma.jpg';
import medicalTestImg from '../img/featureImgs/calcium-blood-test-logo.avif';
import preImg from '../img/featureImgs/prescription-img.jpg';
import donationImg from '../img/featureImgs/donation-img.jpg';
import './features.css';
import bootstrapBundleMin from 'bootstrap/dist/js/bootstrap.bundle.min';


export default function Features() {
    const { t } = useTranslation();
    const navigate = useNavigate(); 

    useEffect(() => {
        // This function initializes all tooltips
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrapBundleMin.Popover(popoverTriggerEl);
        });
    }, []);
        // Function to programmatically open the chatbot
        const openChatbot = () => {
            // Trigger chatbot to open
            // This might involve simulating a click on the chatbot's button
            // Or calling a method provided by the chatbot's API
            const chatbotButton = document.querySelector('#chatbase-bubble-button'); // Update selector to match your chatbot's button
            if (chatbotButton) {
                chatbotButton.click();
            }
        };
        const features = [
            { name: t("features.chat_bot"), img: botImg, description: t("features.description.chat_bot") ,action: openChatbot },
            { name: t("features.medical_tests"), img: medicalTestImg, description: t("features.description.medical_tests"), slug: "medicalTest" },
            { name: t("features.prescription"), img: preImg, description: t("features.description.prescription"), slug: "prescription" },
            { name: t("features.donation"), img: donationImg, description: t("features.description.donation"), slug: "donation" }
        ];

    const handleFeatureClick = (feature) => {
        if (feature.action) {
            // If there's a specific action defined, call it
            feature.action();
        } else if (feature.slug) {
            // Otherwise, navigate to the feature's page
            navigate(`/features/${feature.slug}`);
        }
    };
    

    return (
        <>
            <section className='my-5'>
                <div>
                    <h1 className='text-center'>{t('features.title')}</h1>
                </div>
                <div className='container mt-4'>
                    <div className='row  justify-content-center'>
                        {features.map((feature, index) => (
                            <div key={index} className='col-6 col-sm-6 col-lg-2 mb-4  position-relative'>
                                <div className="card my-card shadow-sm h-100" onClick={() => handleFeatureClick(feature)}>
                                    <img src={feature.img} className="card-img-top img-fluid h-100" alt={feature.name}/>
                                    <div className="card-body">
                                        <h6 className="card-title text-center">{feature.name}</h6>
                                    </div>
                                </div>
                                <div className='position-absolute top-0 left-0'>
                                    <span className="d-inline-block" tabIndex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-custom-class="custom-popover" data-bs-title={feature.name} data-bs-content={feature.description}>
                                        <button className="btn border-0" type="button" disabled><i className="fa-solid fa-circle-exclamation"></i></button>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
