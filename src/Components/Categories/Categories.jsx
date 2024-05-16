import React, { useState } from 'react';
import heartImg from '../img/catagoriesImg/heart.jfif';
import skindiseasImg from '../img/catagoriesImg/skindiseas.jpg'
import nephrologyImg from '../img/catagoriesImg/Kidney.jpeg';
import PsychiatricImg from '../img/catagoriesImg/PsychiatricDisturbances.jpg';
import generalImg from '../img/catagoriesImg/generall.jpg';
import noseImg from '../img/catagoriesImg/noseAndear.jpg';
import dentistImg from '../img/catagoriesImg/dentist.jpg';
import liverImg from '../img/catagoriesImg/liver.jpeg';
import chestImg from '../img/catagoriesImg/chestt.jpg';
import obstetricsImg from '../img/catagoriesImg/Obstetricss.png';
import gastroenterolImg from '../img/catagoriesImg/Gastroenterology.jpeg';
import skinCareImg from '../img/catagoriesImg/skin.jpg';
import bathBodyImg from '../img/catagoriesImg/bath.jpg';
import hairCareImg from '../img/catagoriesImg/hair.jpeg';
import babyImg from '../img/catagoriesImg/baby.jpeg';
import nailCareImg from '../img/catagoriesImg/nail.jpeg';
import shavingImg from '../img/catagoriesImg/shavingg.jpg';
import vitaminImg from '../img/catagoriesImg/vitamin.jpeg';
import './categories.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


export default function Categories() {
    const { t , i18n} = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const categories = [
        { name: 'Heart',name_ar: 'القلب', img: heartImg, slug: "heart" },
        { name: 'Nephrology',name_ar: 'أمراض الكلي', img: nephrologyImg, slug: "nephrology" },
        { name: 'Skin Diseases',name_ar: 'الأمراض الجلدية', img: skindiseasImg, slug: "Skin Diseases" },
        { name: 'General',name_ar: 'عام', img: generalImg, slug: "general" },
        { name: 'Nose',name_ar: 'الأنف', img: noseImg, slug: "nose" },
        { name: 'Dentistry',name_ar: 'طب الأسنان', img: dentistImg, slug: "dentistry" },
        { name: 'Liver',name_ar: 'أمراض الكبد', img: liverImg, slug: "liver" },
        { name: 'Chest',name_ar: 'الصدر', img: chestImg, slug: "chest" },
        { name: 'Obstetrics',name_ar: 'طب النساء والولادة', img: obstetricsImg, slug: "obstetrics" },
        { name: 'Gastroenterology',name_ar: ' الجهاز الهضمي', img: gastroenterolImg, slug: "gastroenterology" },
        { name: 'Skin Care',name_ar: 'العناية بالبشرة', img: skinCareImg, slug: "Skin Care" },
        { name: 'Body Care',name_ar: 'العناية بالجسم', img: bathBodyImg, slug: "Body Care" },
        { name: 'Hair Care',name_ar: 'العناية بالشعر', img: hairCareImg, slug: "Hair Care" },
        { name: 'Baby Care',name_ar: '  العناية بالطفل', img: babyImg, slug: "Baby Care" },
        { name: 'Nail Care',name_ar: 'العناية بالأظافر', img: nailCareImg, slug: "Nail Care" },
        { name: 'Shaving',name_ar: 'الحلاقة', img: shavingImg, slug: "shaving" },
        { name: 'Vitamins',name_ar: 'فيتامين', img: vitaminImg, slug: "vitamin" },
        { name: 'Anti-Depressant',name_ar: 'الاضطرابات النفسية', img: PsychiatricImg, slug: "Anti-Depressant" }
    ];

    const handleSearchChange = (e) => {
        const searchTerm = e.target.value.toLowerCase(); // Convert search term to lowercase
        setSearchTerm(searchTerm);
    };

    const filteredCategories = searchTerm.trim() === '' 
    ? categories 
    : categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.name_ar && category.name_ar.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (category.name_ar && category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <>
            <section className='my-5'>
                <div>
                    <h1 className='text-center'>{t('categories.title')}</h1>
                </div>
                <div className='container mt-4'>
                    <div className="search-bar-container d-flex my-4">
                        <div className="search-bar">
                            <i className="fa fa-search" aria-hidden="true"></i>
                            <input 
                                type="text" 
                                placeholder={t('categories.search_placeholder')} 
                                value={searchTerm}
                                onChange={handleSearchChange} 
                                className="search-input shadow-sm py-2 border-info"
                            />
                        </div>
                    </div>
                    <div className='row'>
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category, index) => (
                                <div key={index} className='col-6 col-sm-6 col-md-4 col-lg-2 mb-4'>
                                    <div className="card my-card shadow-sm" onClick={() => navigate(`/products/category/${category.slug}`, { state: { categoryName: category.name, categoryName_ar: category.name_ar } })}>                                        <img src={category.img} className="card-img-top img-fluid rounded-3" alt={category.name}/>
                                        <div className="card-body">
                                            <h5 className="card-title text-center">{i18n.language === 'ar' && category.name_ar ? category.name_ar : category.name}</h5>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center w-100">
                                <p>{t('categories.no_categories_found', { search: `{${searchTerm}}` })}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
