import React, { useState } from 'react'
import './terms.css'
import { useTranslation } from 'react-i18next'; 

export default function Term() {
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
        <section className='my-4'>
            <h1 className='text-center'>{t('terms.title')}</h1>
            <div className='container'>
                <div className='col-12 d-flex justify-content-center align-items-center'>
                    <div className="accordion w-100" id="accordionPanelsStayOpenExample">
                        {[
                            {
                                id: 'collapseOne',
                                titleKey: 'terms.accordion.user_eligibility',
                                contentKey: 'terms.content.user_eligibility'
                            },
                            {
                                id: 'collapseTwo',
                                titleKey: 'terms.accordion.prescription_policy',
                                contentKey: 'terms.content.prescription_policy'
                            },
                            {
                                id: 'collapseThree',
                                titleKey: 'terms.accordion.product_info',
                                contentKey: 'terms.content.product_info'
                            },
                            {
                                id: 'collapseFour',
                                titleKey: 'terms.accordion.order_shipping',
                                contentKey: 'terms.content.order_shipping'
                            },
                            {
                                id: 'collapseFive',
                                titleKey: 'terms.accordion.returns_refunds',
                                contentKey: 'terms.content.returns_refunds'
                            },
                            {
                                id: 'collapseSix',
                                titleKey: 'terms.accordion.privacy_policy',
                                contentKey: 'terms.content.privacy_policy'
                            },
                            {
                                id: 'collapseSeven',
                                titleKey: 'terms.accordion.law_compliance',
                                contentKey: 'terms.content.law_compliance'
                            }
                        ].map(section => (
                            <div className="accordion-item" key={section.id}>
                                <h2 className="accordion-header" id={`${section.id}-heading`}>
                                    <button className={`accordion-button ${openAccordion !== section.id ? 'collapsed' : ''}`} type="button" onClick={() => toggleAccordion(section.id)} data-bs-toggle="collapse" data-bs-target={`#${section.id}`} aria-expanded={openAccordion === section.id} aria-controls={section.id}>
                                        {t(section.titleKey)}
                                    </button>
                                </h2>
                                <div id={section.id} className={`accordion-collapse collapse ${openAccordion === section.id ? 'show' : ''}`} aria-labelledby={`${section.id}-heading`}>
                                    <div className="accordion-body">
                                        {t(section.contentKey)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
