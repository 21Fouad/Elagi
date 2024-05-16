import React, { useState } from 'react'
import helpImg from '../img/help.png'
import './help.css'
import { useTranslation } from 'react-i18next';

export default function Help() {
    const { t } = useTranslation();

    const [openAccordion, setOpenAccordion] = useState(null);

    const toggleAccordion = (accordionId) => {
        if (openAccordion === accordionId) {
            setOpenAccordion(null);
        } else {
            setOpenAccordion(accordionId);
        }
    };
    return (
        <>
        
            <section className='my-5'>
                <h1 className='text-center'>{t('help.title')}</h1>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <div>
                                <img src={helpImg} alt={t('help.image_alt')} className='img-fluid' />
                            </div>
                        </div>
                        <div className='col-md-6 d-flex justify-content-center align-items-center'>
                            <div className="accordion w-100" id="accordionPanelsStayOpenExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                <button className={`accordion-button ${openAccordion !== 'collapseOne' ? 'collapsed' : ''}`} type="button" onClick={() => toggleAccordion('collapseOne')} data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                    {t('help.faq1_question')}
                                </button>
                                </h2>
                                <div id="panelsStayOpen-collapseOne" className={`accordion-collapse collapse ${openAccordion === 'collapseOne' ? 'show' : ''}`} aria-labelledby="panelsStayOpen-headingOne">
                                <div className="accordion-body">
                                    {t('help.faq1_answer')}
                                </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                                <button className={`accordion-button ${openAccordion !== 'collapseTwo' ? 'collapsed' : ''}`} type="button" onClick={() => toggleAccordion('collapseTwo')}  data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                                    {t('help.faq2_question')}
                                </button>
                                </h2>
                                <div id="panelsStayOpen-collapseTwo" className={`accordion-collapse collapse ${openAccordion === 'collapseTwo' ? 'show' : ''}`} aria-labelledby="panelsStayOpen-headingTwo">
                                    <div className="accordion-body">
                                        {t('help.faq2_answer')}
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                                <button className={`accordion-button ${openAccordion !== 'collapseThree' ? 'collapsed' : ''}`} type="button" onClick={() => toggleAccordion('collapseThree')} data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                                    {t('help.faq3_question')}
                                </button>
                                </h2>
                                <div id="panelsStayOpen-collapseThree" className={`accordion-collapse collapse ${openAccordion === 'collapseThree' ? 'show' : ''}`} aria-labelledby="panelsStayOpen-headingThree">
                                    <div className="accordion-body">
                                        {t('help.faq3_answer')}
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="panelsStayOpen-headingFour">
                                <button className={`accordion-button ${openAccordion !== 'collapseFour' ? 'collapsed' : ''}`} type="button" onClick={() => toggleAccordion('collapseFour')} data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="false" aria-controls="panelsStayOpen-collapseFour">
                                    {t('help.faq4_question')}
                                </button>
                                </h2>
                                <div id="panelsStayOpen-collapseFour" className={`accordion-collapse collapse ${openAccordion === 'collapseFour' ? 'show' : ''}`} aria-labelledby="panelsStayOpen-headingFour">
                                    <div className="accordion-body">
                                        {t('help.faq4_answer')}
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
