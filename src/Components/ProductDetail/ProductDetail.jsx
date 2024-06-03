import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useCart } from '../CartContext';
import { useFavorites } from '../FavoritesContext';
import { useTranslation } from 'react-i18next'; 
import './productdetail.css'

export default function ProductDetail() {
    const { t, i18n } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const { addToCart } = useCart();
    const { favorites, toggleFavorite } = useFavorites();
    const [showFullDescription, setShowFullDescription] = useState(false);

    
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/medicines/${productId}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product details:', error);
                enqueueSnackbar(t('productDetail.error.fetchProductDetails'), { variant: 'error' });
            }
        };
        fetchProduct();
    }, [productId, t, i18n.language,enqueueSnackbar]);

    const handleToggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const displayName = i18n.language === 'ar' ? product?.name_ar : product?.name;
    const displayDescription = i18n.language === 'ar' ? product?.description_ar : product?.description;
    const displayCategory = i18n.language === 'ar' ? product?.category_ar : product?.category;

    const handleIncrement = () => {
        if (quantity >= 3) {
            enqueueSnackbar(t('productDetail.error.maxQuantity'), { variant: 'error' });
            setErrorMessage(t('productDetail.error.maxQuantity'))
            return;
        }
        if (quantity >= product.stock) {
            enqueueSnackbar(t('productDetail.error.notEnoughStock', { stock: product.stock }), { variant: 'error' });
            setErrorMessage(t('productDetail.error.notEnoughStock', { stock: product.stock }));
            return;
        }
        setQuantity(quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // const handleFavoriteClick = async (event) => {
    //     event.preventDefault();
    //     const token = localStorage.getItem('userToken');
    //     if (!token) {
    //         enqueueSnackbar(t('productDetail.error.loginToAddFavorites'), { variant: 'error' });
    //         return;
    //     }
    //     try {
    //         await axios.post(`http://localhost:8000/api/favorites/add/${productId}`, {}, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         enqueueSnackbar(t('productDetail.addedToFavorites'), { variant: 'success' });
    //     } catch (error) {
    //         if (error.response && error.response.status === 409) {
    //             enqueueSnackbar(t('productDetail.alreadyInFavorites'), { variant: 'info' });
    //         } else {
    //             console.error('Error adding product to favorites:', error);
    //             enqueueSnackbar(t('productDetail.error.addFavoritesFailed'), { variant: 'error' });
    //         }
    //     }
    // };

    const handleAddToCart = (event) => {
        event.preventDefault();
        if (!product || product.stock === 0) {
            enqueueSnackbar(t('productDetail.error.outOfStock'), { variant: 'error' });
            return;
        }
        if (quantity > product.stock) {
            enqueueSnackbar(t('productDetail.error.notEnoughStock', { stock: product.stock }), { variant: 'error' });
            return;
        }
        addToCart(product, quantity);
        // enqueueSnackbar(t('productDetail.cart_add_success'), { variant: 'success' });
    };


    if (!product) {
        return <div>{t('productDetail.loading')}</div>;
    }

    return (
        <>
        <div className="container h-75 my-5">
            <div className="row">
                <div className="col-md-12 col-lg-6 mb-3 d-flex justify-content-center">
                    <img src={`http://localhost:8000/images/${product.image_url}`} alt={product.name} className="img-fluid" style={{ maxHeight: '75vh' }} />
                </div>
                <div className="col-md-12 col-lg-6 my-auto">
                    <div className='d-flex flex-column flex-lg-row'>
                        <h2 className="flex-fill">{displayName}</h2>
                        <span className="badge text-bg-success my-1 my-md-auto">{displayCategory}</span>
                    </div>
                    <p className='price-title'>{t('productDetail.price')}: <span className='text-primary price'>{t('productDetail.EGP')} {product.price}</span></p>
                    <div>
                        <p className={product.stock > 0 ? 'text-success' : 'text-danger'}>
                            <span className='text-black'>{t('productDetail.status')} : </span> {product.stock > 0 ? t('productDetail.inStock') : t('productDetail.unavailable')}
                        </p>
                        {errorMessage && <p className='text-danger'>{errorMessage}</p>}
                    </div>
                    <ul>
                        {displayDescription &&
                            displayDescription.split('\n').map((paragraph, index) => {
                                const parts = paragraph.split(':');
                                if (index === 0 || index === 1 || showFullDescription) {
                                    // Display the first two paragraphs and all paragraphs when "Read More" is clicked
                                    if (parts.length === 2) {
                                        return (
                                            <li className="mb-2" key={index}>
                                                <span>
                                                    <strong>{parts[0]}</strong>: {parts[1]}
                                                </span>
                                            </li>
                                        );
                                    } else {
                                        return (
                                            <li className="mb-2" key={index}>
                                                {paragraph}
                                            </li>
                                        );
                                    }
                                } else if (index === 2) {
                                    // Display the "Read More" button
                                    return (
                                        <li className="mb-1 d-flex" key={index}>
                                            <button className="btn btn-link" onClick={handleToggleDescription}>
                                                {t('productDetail.readMore')}
                                            </button>
                                        </li>
                                    );
                                } else {
                                    return null; // Hide the remaining paragraphs until "Read More" is clicked
                                }
                            })}
                        {showFullDescription && (
                            <li className="mb-1">
                                <button className="btn btn-link" onClick={handleToggleDescription}>
                                    {t('productDetail.readLess')}
                                </button>
                            </li>
                        )}
                    </ul>
                    <div className='d-flex justify-content-between align-baseline'>
                        <div className="d-flex align-items-center justify-content-between col-3 col-lg-2 mb-3 text-black border border-secondary rounded">
                            <button className="btn text-black border-0 rounded-0" onClick={handleDecrement} disabled={product.stock === 0}>-</button>
                            <span className="border-0 border-left border-right px-2 fa-1x">{quantity}</span>
                            <button className="btn text-black border-0 rounded-0" onClick={handleIncrement} disabled={product.stock === 0}>+</button>
                        </div>
                        <div className='w-100 text-center'>
                            <button 
                                className={`btn btn-primary w-75 ${i18n.language === 'ar' ? 'ms-1' : 'me-1'}`}  
                                onClick={handleAddToCart} 
                                disabled={product.stock === 0 || quantity > product.stock}
                            >
                                <i className="fas fa-shopping-cart text-white icon-cart p-1"></i>
                                {t('productDetail.addToCart')}
                            </button>
                        </div>
                        <div>
                            <button
                            className="btn"
                            style={{ backgroundColor: 'transparent', border: 'none' }}
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                toggleFavorite(product.id);
                            }}
                            >
                                <i className={`fa${favorites.has(product.id) ? 's' : 'r'} fa-heart text-danger heart-icon`}></i>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        </>
    );
}
