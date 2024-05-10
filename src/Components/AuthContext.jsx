import React, { createContext, useContext, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check login status on component mount
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        setIsLoggedIn(!!token);
    }, []);

    const login = (token) => {
        localStorage.setItem('userToken', token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};
export const useAuth = () => useContext(AuthContext);

