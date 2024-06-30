import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { trefoil } from 'ldrs';
import { UserContext } from '../context/UserContext';

axios.defaults.withCredentials = true;

const AuthRoute = ({ element }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const { user } = useContext(UserContext);

    trefoil.register();

    useEffect(() => {
        // axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/checkAuth`, { withCredentials: true })
        //     .then(response => {
        //         setAuthenticated(true);
        //         setLoading(false);
        //     })
        //     .catch(error => {
        //         setAuthenticated(false);
        //         setLoading(false);
        //     });

        if (user) {
            setAuthenticated(true);
            setLoading(false);
        }
        else setLoading(false);
    }, [user]);

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
