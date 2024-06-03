import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        setIsLoading(true);
        const token = localStorage.getItem('userToken');
        if (!token) {
            enqueueSnackbar(t('cart.auth_token_missing'), { variant: 'error' });
            setIsLoading(false);
            return;
        }
        try {
            const response = await axios.get('http://localhost:8000/api/cart', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
            enqueueSnackbar(t('cart.fetch_error'), { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [enqueueSnackbar, t]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (product, quantity) => {
        setIsLoading(true);
        const token = localStorage.getItem('userToken');
        if (!token) {
            enqueueSnackbar(t('cart.auth_token_missing'), { variant: 'error' });
            setIsLoading(false);
            return;
        }

        const currentCartItem = cartItems.find(item => item.product.id === product.id);
        const currentQuantityInCart = currentCartItem ? currentCartItem.quantity : 0;
        const newTotalQuantity = currentQuantityInCart + quantity;

        if (newTotalQuantity > 3) {
            enqueueSnackbar(t('cart.max_quantity_exceeded'), { variant: 'warning' });
            setIsLoading(false);
            return;
        }

        if (newTotalQuantity > product.stock) {
            enqueueSnackbar(t('cart.stock_exceeded'), { variant: 'warning' });
            setIsLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/cart/add', {
                product_id: product.id,
                quantity: quantity
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCart();
            enqueueSnackbar(t('cart.add_success'), { variant: 'success' });
        } catch (error) {
            console.error('Error adding to cart:', error);
            enqueueSnackbar(t('cart.add_error'), { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (itemId) => {
        setIsLoading(true);
        const token = localStorage.getItem('userToken');
        try {
            await axios.delete(`http://localhost:8000/api/cart/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartItems(currentItems => currentItems.filter(item => item.id !== itemId));
            enqueueSnackbar(t('cart.remove_success'), { variant: 'success' });
        } catch (error) {
            console.error('Error removing item from cart:', error);
            enqueueSnackbar(t('cart.remove_error'), { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const clearCart = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('userToken');
        try {
            await axios.delete('http://localhost:8000/api/cart/clear', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartItems([]);
            enqueueSnackbar(t('cart.clear_success'), { variant: 'success' });
        } catch (error) {
            console.error('Error clearing the cart:', error);
            enqueueSnackbar(t('cart.clear_error'), { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const updateCart = (cart) => {
        setCartItems(cart);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateCart, isLoading }}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
