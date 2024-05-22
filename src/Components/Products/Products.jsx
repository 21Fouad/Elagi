import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams} from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { CartContext } from '../CartContext'; 
import { useFavorites } from '../FavoritesContext';
import './product.css'


export default function Products() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [searchAttempted, setSearchAttempted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { categorySlug } = useParams();
    const { cartItems, addToCart } = useContext(CartContext);
    const { favorites, toggleFavorite } = useFavorites();
    const { categoryName, categoryName_ar } = location.state || { categoryName: '', categoryName_ar: '' }; // Fallback if no state is passed


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = 'http://localhost:8000/api/medicines';
                if (categorySlug) {
                    url += `/category/${categorySlug}`;
                }
                url += `?page=${currentPage}`;
    
                const response = await axios.get(url);
                // Check if the response structure differs when a category slug is used
                if (categorySlug) {
                    // Assuming when fetching by category, the response data is directly in response.data
                    setProducts(response.data);
                } else {
                    // Assuming the normal list comes with pagination structure
                    setProducts(response.data.data || []);
                    setTotalPages(response.data.last_page || 0);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                enqueueSnackbar(t('products.fetch_error'), { variant: 'error' });
                setProducts([]);
                if (!categorySlug) {
                    setTotalPages(0);
                }
            }
        };
        fetchProducts();
    }, [categorySlug, currentPage,enqueueSnackbar,t]);
    

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setSearchAttempted(true);
    };
    
    const filteredProducts = searchTerm.trim() === '' 
        ? products 
        : products.filter(product =>
            (product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (product.name_ar && product.name_ar.toLowerCase().includes(searchTerm.toLowerCase())))
        );


        const handleAddToCart = async (product, event) => {
            event.preventDefault();
            if (!product || product.stock === 0) {
                enqueueSnackbar(t('products.stock_out'), { variant: 'error' });
                return;
            }
        
            // Check if the product is already in the cart and count its quantity
            const existingItem = cartItems.find(item => item.product.id === product.id);
            const currentQuantity = existingItem ? existingItem.quantity : 0;
        
            if (currentQuantity >= 3) {
                enqueueSnackbar(t('products.order_limit'), { variant: 'error' });
                return;
            }
        
            if (currentQuantity > product.stock) {
                enqueueSnackbar(t('products.stock_limit'), { variant: 'error' });
                return;
            }
        
            // If the conditions are met, add the product to the cart
            enqueueSnackbar(t('products.cart_add_success'), { variant: 'success' });
            addToCart(product, 1);
        };
        
        

        
        

    const handleDisabledClick = (product) => {
        const existingItem = cartItems.find(item => item.product.id === product.id);
        if (existingItem && existingItem.quantity > 3) {
            enqueueSnackbar(t('products.only_three'), { variant: 'error' });
        }
    };
    // Render pagination controls
        
    const goToPreviousPage = () => {
    setCurrentPage((prevCurrent) => Math.max(prevCurrent - 1, 1));
    };

    const goToNextPage = () => {
    setCurrentPage((prevCurrent) => Math.min(prevCurrent + 1, totalPages));
    };

    const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    };
    

    return (
            <>
            <section className='my-5'>
                <div className='text-center mb-4'>
                    <h1>{t('products.header')}</h1>
                </div>
                <div className="container">
                    <div className='row justify-content-between'>
                        <div className="col-6 search-bar-container d-flex my-4">
                            <div className="search-bar">
                                <i className="fa fa-search" aria-hidden="true"></i>
                                <input 
                                    type="text" 
                                    placeholder={t('products.search_placeholder')} 
                                    value={searchTerm}
                                    onChange={handleSearchChange} 
                                    className="search-input shadow-sm py-2 border-info"
                                />
                            </div>
                        </div>
                        <div className={`col-4 col-md-2 py-2 category-name badge text-bg-success my-auto ${i18n.language === 'ar' ? 'ms-2' : 'me-2'}`}>
                            {i18n.language === 'ar' ? categoryName_ar : categoryName}
                        </div>
                    </div>
                    <div className="row">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div key={product.id} className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4">
                                    <Link to={`/medicines/${product.id}`} className="text-decoration-none text-dark">
                                        <div className="card my-card h-100 shadow position-relative">
                                            <img src={`http://localhost:8000/images/${product.image_url}`} className="card-img-top" alt={product.name} />
                                            <div className="badge w-100 product-badge d-flex align-items-center justify-content-center position-absolute bottom-50" 
                                                style={{color: 'white', textAlign: 'center', padding: '10px 0' }}>
                                                {product.stock > 10 ? (
                                                    <span className="text-bg-success w-100 py-1 rounded-2 d-none">In Stock</span>
                                                ) : product.stock > 0 ? (
                                                    <span className="text-bg-warning w-100 py-1 rounded-1">Limited Stock</span>
                                                ) : (
                                                    <span className="text-bg-secondary w-100 py-1 rounded-1">Out of Stock</span>
                                                )}
                                            </div>
                                            <button
                                            className="btn position-absolute top-0 end-0 p-2"
                                            style={{ backgroundColor: 'transparent', border: 'none' }}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                toggleFavorite(product.id);
                                            }}
                                            >
                                                <i className={`fa${favorites.has(product.id) ? 's' : 'r'} fa-heart text-danger`}></i>
                                            </button>
                                            <div className="card-body">
                                                <div className='d-flex justify-content-between'>
                                                    <h6 className="card-title">{i18n.language === 'ar' && product.name_ar ? product.name_ar : product.name}</h6>
                                                    {/* <span className="badge text-bg-success my-auto">{i18n.language === 'ar' && product.category_ar ? product.category_ar : product.category}</span> */}
                                                </div>
                                                <p className="card-text text-success">{product.price} EGP</p>
                                                <hr />
                                                {product.stock > 0 ? (
                                                    <div className="d-flex justify-content-center">
                                                        <button 
                                                            className="btn btn-primary text-card" 
                                                            onClick={(event) => handleAddToCart(product, event)}     
                                                            disabled={cartItems.find(item => item.product.id === product.id && item.quantity > 3)}
                                                            onMouseDown={() => handleDisabledClick(product)}
                                                        >
                                                            <i className="fas fa-shopping-cart text-white icon-cart p-1"></i>
                                                            {t('products.add_to_cart')}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="d-flex justify-content-center">
                                                            <button 
                                                                className="btn btn-danger text-card" 
                                                                disabled
                                                            >
                                                                {t('products.out_of_stock')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            searchAttempted && (
                                <div className="text-center text-danger w-100">
                                    <p>{t('products.no_products_found', { search: `{${searchTerm}}` })}</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <nav aria-label="Page navigation example" className='mt-3'>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <a className="page-link" href="#!" aria-label="Previous" onClick={goToPreviousPage}>
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        {[...Array(totalPages).keys()].map((page) => (
                            <li key={page + 1} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                                <a className="page-link" href="#!" onClick={(e) => { e.preventDefault(); goToPage(page + 1); }}>
                                    {page + 1}
                                </a>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <a className="page-link" href="#!" aria-label="Next" onClick={goToNextPage}>
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
    
            </section>    
        </>
    );
    
}