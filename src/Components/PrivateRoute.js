import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

class PrivateRoute extends React.Component {
    state = {
        loading: true,
        authenticated: false,
    };

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/checkAuth`, { withCredentials: true })
            .then(response => {
                this.setState({ authenticated: true, loading: false });
            })
            .catch(error => {
                this.setState({ authenticated: false, loading: false });
            });
    }

    render() {
        const { loading, authenticated } = this.state;
        const { element } = this.props;

        if (loading) {
            return <div className="loaderContainer">
                <l-trefoil
                    size="40"
                    stroke="4"
                    stroke-length="0.15"
                    bg-opacity="0.1"
                    speed="1.4"
                    className="loading-bg"
                ></l-trefoil>
            </div>;
        }

        return authenticated ? element : <Navigate to="/login" />;
    }
}

export default PrivateRoute;
