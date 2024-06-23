// src/context/UserContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch the authenticated user from the backend on initial load
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getUser`, { withCredentials: true })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => console.error('Error fetching user:', error));
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, { email, password }, { withCredentials: true });
            setUser(response.data.user); // Update user context
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, { withCredentials: true });
            setUser(null); // Clear user context
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
