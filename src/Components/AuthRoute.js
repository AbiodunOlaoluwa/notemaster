import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { trefoil } from 'ldrs';

axios.defaults.withCredentials = true;

const AuthRoute = ({ element }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    trefoil.register();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/checkAuth`, { withCredentials: true })
            .then(response => {
                setAuthenticated(true);
                setLoading(false);
            })
            .catch(error => {
                setAuthenticated(false);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="loaderContainerFull">
                <l-trefoil
                    size="40"
                    stroke="4"
                    stroke-length="0.15"
                    bg-opacity="0.1"
                    speed="1.4"
                    color="white"
                ></l-trefoil>
            </div>
        );
    }

    return authenticated ? <Navigate to="/dashboard" /> : element;
};

export default AuthRoute;
