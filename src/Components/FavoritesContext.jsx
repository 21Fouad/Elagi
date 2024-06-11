import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';


const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(new Set());
    const { t} = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    
    const fetchFavorites = useCallback(async () => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/api/favorites', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavorites(new Set(response.data.map(item => item.productId))); // Assuming you want to store product IDs
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
            enqueueSnackbar(t('favorites.fetch_error'), { variant: 'error' });
        }
    }, [enqueueSnackbar, t]); // Dependencies for useCallback

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]); // Correct dependency

    
    const toggleFavorite = async (productId) => {
        const isFavorited = favorites.has(productId);
        const token = localStorage.getItem('userToken');
        if (!token) {
            enqueueSnackbar(t('favorites.auth_token_missing'), { variant: 'error' });
            navigate('/login');
            return;
        }
    
        const headers = { Authorization: `Bearer ${token}` };
        const urlBase = 'http://localhost:8000/api/favorites/';
        const method = isFavorited ? 'delete' : 'post';
        const url = `${urlBase}${isFavorited ? 'remove/' : 'add/'}${productId}`;
    
        try {
            const response = await axios({
                method: method,
                url: url,
                headers: headers,
            });
    
            if (response.status === 200 || response.status === 201) {
                // Create a new Set from the existing favorites to trigger state update
                const updatedFavorites = new Set(favorites);
                if (isFavorited) {
                    updatedFavorites.delete(productId);
                    enqueueSnackbar(t('products.favorite_remove_success'), { variant: 'success' });
                } else {
                    updatedFavorites.add(productId);
                    enqueueSnackbar(t('products.favorite_add_success'), { variant: 'success' });
                }
                setFavorites(updatedFavorites);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            enqueueSnackbar(t('products.favorite_already'), { variant: 'info' });
        }
    };
    

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite,fetchFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

FavoritesProvider.propTypes = {
    children: PropTypes.node.isRequired,
};