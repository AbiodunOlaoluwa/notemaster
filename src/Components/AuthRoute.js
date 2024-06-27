import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

class AuthRoute extends React.Component {
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
            return <div>Loading...</div>;
        }

        return authenticated ? <Navigate to="/dashboard" /> : element;
    }
}

export default AuthRoute;
