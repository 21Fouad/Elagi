import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';


export default function Favourite() {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('userToken');
        if (!token) {
            console.error('No token found');
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.get('http://localhost:8000/api/favorites', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavorites(data);
        } catch (error) {
            console.error("Failed to fetch favorites:", error);
        }
        setLoading(false);
    }, []);

    const clearAllFavorites = async () => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            console.error(t('favorites.auth_token_missing'));
            return;
        }
    
        try {
            await axios.delete('http://localhost:8000/api/favorites/clear', {
                headers: { Authorization: `Bearer ${token}` },
            });
            enqueueSnackbar(t('favorites.clear_success'), { variant: 'success' });
            setFavorites([]);  // Clear the favorites from the state
        } catch (error) {
            console.error(t('favorites.clear_failed'), error);
            enqueueSnackbar(t('favorites.clear_failed'), { variant: 'error' });
        }
    };
    
    const removeFromFavorites = async (productId) => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            console.error(t('favorites.auth_token_missing'));
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/favorites/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            enqueueSnackbar(t('favorites.removed_success'), { variant: 'success' });
            fetchFavorites();
        } catch (error) {
            console.error(t('favorites.remove_failed'), error);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]); 

    return (
<>
    <div className="container mt-4">
        <h2 className="text-center mb-4">{t('favorites.title')}</h2>
        {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t('loading')}</span>
                </div>
            </div>
        ) : favorites.length > 0 ? (
            <div className="row">
                {favorites.map((favorite) => (
                    <div key={favorite.product.id} className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div className="card my-card shadow" style={{ maxWidth: '18rem' }}>
                            <Link to={`/products/${favorite.product.id}`} className="text-decoration-none text-dark">
                                <img src={`http://localhost:8000/images/${favorite.product.image_url}`} className="card-img-top" alt={favorite.product.name}/>
                                <div className="card-body">
                                    <div className='d-flex justify-content-between'>
                                        <h6 className="card-title h-card">{favorite.product.name}</h6>
                                        {/* <span className="badge text-bg-success my-auto">{favorite.product.category}</span> */}
                                    </div>
                                    <p className="card-text text-success">${favorite.product.price}</p>
                                </div>
                            </Link>
                            <div className="card-footer">
                                <button className="btn btn-outline-danger text-card" onClick={() => removeFromFavorites(favorite.product.id)}>
                                    {t('favorites.remove_button')}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="text-center my-4">
                    <button className="btn btn-danger" onClick={clearAllFavorites}>{t('favorites.clear_all_button')}</button>
                </div>
            </div>
        ) : (
            <p className="text-center" style={{ height: "40vh" }}>{t('favorites.no_favorites')}</p>
        )}
    </div>
</>

    );
}
