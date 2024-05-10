import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('userToken');
        try {
            const response = await axios.get('http://localhost:8000/api/cart', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = async (product, quantity) => {
        setIsLoading(true);
        const token = localStorage.getItem('userToken');
    
        if (!token) {
            setIsLoading(false);
            return;
        }
    
        // Check if adding this quantity exceeds the allowed maximum of 3 or the available stock.
        const currentCartItem = cartItems.find(item => item.product.id === product.id);
        const currentQuantityInCart = currentCartItem ? currentCartItem.quantity : 0;
        const newTotalQuantity = currentQuantityInCart + quantity;
    
        if (newTotalQuantity > 3) {
            setIsLoading(false);
            return;
        }
    
        if (newTotalQuantity > product.stock) {
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
        } catch (error) {
            console.error('Error adding to cart:', error);
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
        } catch (error) {
            console.error('Error removing item from cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearCart = async () => {
        const token = localStorage.getItem('userToken');
        try {
            // Assuming your API has an endpoint to clear the cart
            await axios.delete('http://localhost:8000/api/cart/clear', {
                headers: { Authorization: `Bearer ${token}` },
            });
            // After clearing the cart on the backend, clear the frontend state
            setCartItems([]);
        } catch (error) {
            console.error('Error clearing the cart:', error);
        }
    };

    const updateCart = (cart) => {
        setCartItems(cart);
    };


    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart,clearCart ,updateCart,isLoading }}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
