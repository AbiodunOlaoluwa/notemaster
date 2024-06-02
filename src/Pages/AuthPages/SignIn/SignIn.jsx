import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import blob1 from "../blob1.svg";
import blob2 from "../blob2.svg";
import lightLogo from "../light_theme_transparent.png";
import darkLogo from "../logo_dark_transparent.png";
import "./SignIn.css";
import ComponentLoadingSpinner from '../../../Components/ComponentLoadingSpinner/ComponentLoadingSpinner';

const SignIn = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const newErrors = {};

    const validateForm = () => {
        if (!email) newErrors.email = 'This field is required';
        if (!password) newErrors.password = 'This field is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleLogin = (event) => {
        event.preventDefault();
        if (validateForm()) {
            setLoading(true);
        }

        setTimeout(() => execute(), 3000);

        const execute = () => {
            console.log("Login");
            setLoading(false);
        }
    }

    return (
        <div className="signInPage">
            <div className={`blobContainer`}>
                <img src={blob1} className="blob" alt="blob" />
                <img src={blob2} className="blob" alt="blob" />
            </div>
            <div className="signInCardContainer">
                <div className="logoContainer">
                    <div className="lightLogo">
                        <img src={lightLogo} alt="logo" className='authLogo' />
                    </div>
                    <div className="darkLogo">
                        <img src={darkLogo} alt="logo" className='authLogo' />
                    </div>
                    <p className="authLogoTitle">NoteMaster</p>
                </div>
                <div className="signInCard secondary-bg">
                    <div className="signInHeader">
                        <p className="headerText">Login</p>
                        <p className="descHeaderText secondary-text">Add your details below to get back into the app</p>
                    </div>
                    <div className="inputField">
                        <div className="emailInputContainer">
                            <label htmlFor="emailInput" className="secondary-text">Email</label>
                            <div className={`inputFieldContainer ${errors.email ? "error" : ""}`}>
                                <input id="emailInput" type="text" className="emailInput" autoFocus placeholder="johndoe@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} onClick={() => setErrors(newErrors)} />
                            </div>
                            {errors.email && <i><p className="errorFont">{errors.email}</p></i>}
                        </div>
                        <div className="passwordInputContainer">
                            <label htmlFor="passwordInput" className="secondary-text">Password</label>
                            <div className={`inputFieldContainer ${errors.password ? "error" : ""}`}>
                                <input id="passwordInput" type="password" className="passwordInput" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onClick={() => setErrors(newErrors)}  />
                            </div>
                            {errors.password && <i><p className="errorFont">{errors.password}</p></i>}
                        </div>
                    </div>
                    <div className="buttonContainer">
                        <button type="submit" className='signInButton' onClick={handleLogin}>{loading ? <ComponentLoadingSpinner /> : "Login"}</button>
                    </div>
                    <div className="redirect">
                        <p className="redirectText">Don't have an account? <Link to="/createAccount"><span className="highlight-purple">Create Account</span></Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn