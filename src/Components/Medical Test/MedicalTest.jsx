import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import './medicalTest.css';

export default function MedicalTest() {
    const { t, i18n } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [calciumLevel, setCalciumLevel] = useState('');
    const [responseMessage, setResponseMessage] = useState([]);
    const [loading, setLoading] = useState(false);
    const isAuthenticated = localStorage.getItem('userToken');


    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
        setCalciumLevel(''); // Clear the manual input if a file is selected
        setResponseMessage([]);
    };

    const handleCalciumLevelChange = (event) => {
        setCalciumLevel(event.target.value);
        setSelectedFile(null); // Clear the file input if a manual value is entered
        setResponseMessage([]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isAuthenticated) {
            enqueueSnackbar(t('medical_test.auth_token_missing'), { variant: 'error' });
            navigate('/login');
            return;
        }

        if (!selectedFile && !calciumLevel) {
            setResponseMessage([t("medical_test.select_file_or_enter_level")]);
            return;
        }

        const formData = new FormData();
        if (selectedFile) {
            formData.append('file', selectedFile);
        } else {
            formData.append('calciumLevel', calciumLevel);
        }
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/upload-medicalTest', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${isAuthenticated}`
                }
            });
            const data = response.data;
            setResponseMessage([
                `${t("medical_test.condition")} ${data.condition || t("medical_test.not_available")}`,
                `${t("medical_test.status")} ${data.status || t("medical_test.not_available")}`,
                `${t("medical_test.level")} ${data.extracted_value || t("medical_test.not_available")}`,
                `${t("medical_test.value")} ${data.nearest_condition || t("medical_test.not_available")}`,
                `${t("medical_test.result")} ${data.nearest_result_value || t("medical_test.not_available")}`,
                `${t("medical_test.normal_range")} ${data.reference_range || t("medical_test.not_available")}`
            ]);
        } catch (error) {
            setResponseMessage([t("medical_test.error_uploading") + (error.response?.data?.message || error.message)]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
                <div className="col-md-6">
                    <form onSubmit={handleSubmit} className="text-center">
                        <h1 className="h3 mb-3 font-weight-normal">{t("medical_test.upload_title")}</h1>
                        <label htmlFor="customFile" className="input-group test">
                            <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`}>
                                <i className="fa-regular fa-image"></i>
                            </span>
                            <span className={`form-control ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`}>
                                {selectedFile ? selectedFile.name : (i18n.language === 'ar' ? 'اختيار الملف' : 'Choose file')}
                            </span>
                            <input
                                type="file"
                                className="form-control visually-hidden"
                                id="customFile"
                                onChange={handleFileSelect}
                            />
                        </label>
                        <p className='mt-1'>{t("medical_test.or")}</p>
                        <h1 className="h3 mb-3 font-weight-normal">{t("medical_test.insert_manually")}</h1>
                        <label htmlFor="calciumLevel" className="input-group test">
                            <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`}>
                                {t("medical_test.calcium_level")}
                            </span>
                            <input
                                type="number"
                                step="0.01"
                                className={`form-control ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`}
                                id="calciumLevel"
                                value={calciumLevel}
                                onChange={handleCalciumLevelChange}
                            />
                        </label>
                        <button className="btn btn-lg btn-primary btn-block my-3" type="submit" disabled={loading}>
                            {loading ? t("medical_test.uploading") : t("medical_test.upload")}
                        </button>
                        {responseMessage.length > 0 && (
                            <div className="alert alert-info mt-3">
                                {responseMessage.map((msg, index) => (
                                    <p key={index} className='text-start'>{msg}</p>
                                ))}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
