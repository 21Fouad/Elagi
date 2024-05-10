import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './medicalTest.css';

export default function MedicalTest() {
    const { t, i18n } = useTranslation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [responseMessage, setResponseMessage] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
        setResponseMessage([]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setResponseMessage([t("medical_test.select_file")]);
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/upload-medicalTest', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const data = response.data;
            setResponseMessage([
                `${t("medical_test.condition")} ${data.condition || t("medical_test.not_available")}`,
                `${t("medical_test.status")} ${data.status || t("medical_test.not_available")}`,
                `${t("medical_test.level")} ${data.nearest_condition || t("medical_test.not_available")}`,
                `${t("medical_test.value")} ${data.extracted_value || t("medical_test.not_available")}`,
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
