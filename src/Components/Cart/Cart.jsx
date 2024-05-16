import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import cartImg from '../img/cart.png';
import { useCart } from '../CartContext';
import { useTranslation } from 'react-i18next';
import './cart.css'

export default function Cart() {
    const { enqueueSnackbar } = useSnackbar(); 
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { removeFromCart } = useCart();
    const { t, i18n } = useTranslation();
    const {updateCart,clearCart} = useCart();

    const fetchCart = useCallback(async () => {
        setIsLoading(true);
        const token = localStorage.getItem('userToken');
        try {
            const response = await axios.get('http://localhost:8000/api/cart', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
            enqueueSnackbar(t('cart.loading_fail'), { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [t,enqueueSnackbar]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    
    const handleIncrement = (itemId) => {
        const item = cartItems.find(item => item.id === itemId);
        if (item.quantity >= 3) {
            enqueueSnackbar(t('cart.only_three'), { variant: 'info' });
            return;
        }
        if (item.quantity >= item.product.stock) {
            enqueueSnackbar(t('cart.stock_limit', { count: item.product.stock }), { variant: 'info' });
            return;
        }
        if (item.quantity < 3) {
            updateQuantity(itemId, item.quantity + 1);
        }
        const updatedItems = cartItems.map(item => item.id === itemId ? {...item, quantity: item.quantity + 1} : item);
        updateCart(updatedItems);
    };

    const handleDecrement = (itemId) => {
        const item = cartItems.find(item => item.id === itemId);
        if (item.quantity > 1) {
            updateQuantity(itemId, item.quantity - 1);
        }
        const updatedItems = cartItems.map(item => item.id === itemId ? {...item, quantity: item.quantity - 1} : item);
        updateCart(updatedItems);
    };

    const updateQuantity = async (itemId, newQuantity) => {
        const token = localStorage.getItem('userToken');
        try {
            await axios.patch(`http://localhost:8000/api/cart/${itemId}`, {
                quantity: newQuantity,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const updatedCartItems = cartItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
            setCartItems(updatedCartItems);
            enqueueSnackbar(t('cart.update_success'), { variant: 'success' });
        } catch (error) {
            console.error('Error updating quantity:', error);
            enqueueSnackbar(t('cart.update_fail'), { variant: 'error' });
        }
    };

    const handleRemoveItem = (itemId, event) => {
        event.preventDefault();
        removeFromCart(itemId);
        const updatedCartItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedCartItems);
        enqueueSnackbar(t('cart.remove_success'), { variant: 'success' });
    };

    const handleClearCart = async () => {
        try {
          // Assume this is the function that clears the cart in context
            await clearCart();
            setCartItems([]);
            enqueueSnackbar(t('cart.cartClearSuccess'), { variant: 'success' });
            } catch (error) {
            enqueueSnackbar(t('cart.cartClearError'), { variant: 'error' });
            }
        };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.quantity * item.product.price, 0).toFixed(2);
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };
    
    return (
        <div className="container" style={{ height: "75vh" }}>
            <h2 className="my-3 text-center cartEmptyH">{t('cart.title')}</h2>
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    {t('cart.loading')}
                </div>
            ) : cartItems.length === 0 ? (
                <div className='text-center mt-5 '>
                    <img src={cartImg} alt={t('cart.empty')} className='cartImg'/>
                    <p className='my-5 ms-5 cartEmptyP'>{t('cart.empty')}</p>
                    <Link to='/products' className='btn btn-primary ms-5 cartEmptyL'>{t('cart.discover')}</Link>
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{t('cart.name')}</th>
                                    <th>{t('cart.price')}</th>
                                    <th>{t('cart.quantity')}</th>
                                    <th>{t('cart.subtotal')}</th>
                                    <th>{t('cart.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.id}>
                                        <td onClick={() => navigate(`/products/${item.product.id}`)}>{i18n.language === 'ar' && item.product.name_ar ? item.product.name_ar : item.product.name}</td>
                                        <td>EGP {item.product.price}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <button className="btn btn-secondary btn-sm" onClick={() => handleDecrement(item.id)}>-</button>
                                                <span className="mx-2">{item.quantity}</span>
                                                <button className="btn btn-secondary btn-sm" onClick={() => handleIncrement(item.id)}>+</button>
                                            </div>
                                        </td>
                                        <td>EGP {(item.product.price * item.quantity).toFixed(2)}</td>
                                        <td>
                                            <button className="btn btn-danger" onClick={(event) => handleRemoveItem(item.id, event)}>{t('cart.remove')}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="3">{t('cart.total')}</th>
                                    <th colSpan="2">EGP {calculateTotal()}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="text-center d-flex justify-content-center my-3">
                        <button className="btn btn-primary" onClick={handleCheckout}>
                            {t('cart.proceed')}
                        </button>
                        <button className={`btn btn-danger ${i18n.language === 'ar' ? 'me-2' : 'ms-2'}`} onClick={handleClearCart}>
                            {t('cart.clear_all')}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
