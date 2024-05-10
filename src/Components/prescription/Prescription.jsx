import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './prescription.css';

export default function Prescription() {
    const { t, i18n } = useTranslation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [foundMedicines, setFoundMedicines] = useState([]);
    const [notFoundMedicines, setNotFoundMedicines] = useState([]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setUploadStatus(''); 
    };

    const handleSubmission = async () => {
        if (!selectedFile) {
            setUploadStatus(t("prescription.select_file"));
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post('http://localhost:8000/api/upload-prescription', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUploadStatus(t("prescription.upload_successful"));
            setFoundMedicines(response.data.found || []);
            setNotFoundMedicines(response.data.notFoundAndAlternatives || []);
        } catch (error) {
            console.error("Error uploading file: ", error.response ? error.response.data : error);
            setUploadStatus(t("prescription.error_uploading"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
                <div className="col-lg-6 text-center">
                    <h1 className="h3 mb-3 font-weight-normal">{t("prescription.upload_title")}</h1>
                    <label className="input-group mb-3 prescription">
                        <span className={`input-group-text ${i18n.language === 'ar' ? 'rounded-end' : 'rounded-start'}`} htmlFor="customFile">
                            <i className="fa-regular fa-image"></i>
                        </span>
                        <span htmlFor="customFile" className={`form-control ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`}>
                            {selectedFile ? selectedFile.name : (i18n.language === 'ar' ? 'اختيار الملف' : 'Choose file')}
                        </span>
                        <input
                            type="file"
                            className={`form-control ${i18n.language === 'ar' ? 'rounded-start' : 'rounded-end'}`} 
                            id="customFile"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </label>
                    <button
                        className="btn btn-lg btn-primary"
                        type="button"
                        onClick={handleSubmission}
                        disabled={loading}
                    >
                        {loading ? t("prescription.uploading") : t("prescription.upload_prescription")}
                    </button>
                    {uploadStatus && <div className="alert alert-info mt-2">{uploadStatus}</div>}
                </div>
            </div>

            {/* Display Found Medicines */}
            {foundMedicines.length > 0 && (
                <div className="row">
                    <h3>{t("prescription.found_medicines")}</h3>
                    {foundMedicines.map((medicine, index) => (
                        <div key={index} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{medicine.name}</h5>
                                    <p className="card-text">{medicine.description}</p>
                                    <p className="card-text text-success">{t("prescription.available")}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Display Not Found Medicines and Alternatives */}
            {notFoundMedicines.length > 0 && (
                <div className="alert alert-warning mt-4">
                    <h5 className="text-danger">{t("prescription.not_found_medicines")}</h5>
                    {notFoundMedicines.map((item, index) => (
                        <div key={index}>
                            <p>{item.notFoundName}, {t("prescription.not_found")}</p>
                            {item.alternative && (
                                <div>
                                    <p><strong>{t("prescription.alternatives")}</strong> {item.alternative.name}</p>
                                    <p>{item.alternative.description}</p>
                                    <p>{t("prescription.status")}: {item.alternative.status}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
