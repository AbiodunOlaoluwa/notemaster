
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch the authenticated user from the backend on initial load
        axios.get('http://localhost:3001/api/getUser', { withCredentials: true })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => console.error('Error fetching user:', error));
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
