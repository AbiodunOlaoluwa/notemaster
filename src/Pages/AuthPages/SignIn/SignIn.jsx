import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import blob1 from "../blob1.svg";
import blob2 from "../blob2.svg";
import lightLogo from "../light_theme_transparent.png";
import darkLogo from "../logo_dark_transparent.png";
import lightModeOpenEye from "../openEye_lightMode.png";
import lightModeClosedEye from "../closedEye_lightMode.png";
import darkModeOpenEye from "../openEye_darkMode.png";
import darkModeClosedEye from "../closedEye_darkMode.png";
import "./SignIn.css";
import ComponentLoadingSpinner from '../../../Components/ComponentLoadingSpinner/ComponentLoadingSpinner';
import { UserContext } from '../../../context/UserContext';

const SignIn = () => {
    axios.defaults.withCredentials = true; //for session cookie handling

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [type, setType] = useState("password");
    const {login} = useContext(UserContext);

    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const newErrors = {};

    const handleTypeClick = () => {
        if (type === "password") {
            setType("text")
        }
        else setType("password")
    }

        const validateForm = () => {
            if (!email) newErrors.email = 'This field is required';
            if (!password) newErrors.password = 'This field is required';
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        }

        const handleLogin = async (event) => {
            event.preventDefault();
            if (validateForm()) {
                setLoading(true);

                try {
                    await login(email, password);
                    setLoading(false);
                    navigate('/dashboard', {replace: true})
                } catch (error) {
                    setLoading(false);
                    setError("Failed to login. Please check your credentials and try again.");
                }
            }
        }

        //breaks the code when implemented; will figure out why later
        // const handleKeyDown = (event) => {
        //     if (event.key === "Enter") {
        //         handleLogin();
        //     }
        // }

        return (
            <div className="signInPage">
                <div className={`blobContainer`}>
                    <img src={blob1} className="blob" alt="blob" />
                    <img src={blob2} className="blob" alt="blob" />
                </div>
                <div className="signInCardContainer">
                    <div className="logoContainer">
                        <div className="light">
                            <img src={lightLogo} alt="logo" className='authLogo' />
                        </div>
                        <div className="dark">
                            <img src={darkLogo} alt="logo" className='authLogo' />
                        </div>
                        <p className="authLogoTitle">NoteMaster</p>
                    </div>
                    <div className="signInCard">
                        <div className="signInHeader">
                            <p className="headerText">Login</p>
                            <p className="descHeaderText secondary-text">Add your details below to get back into the app</p>
                        </div>
                        <div className="inputField">
                            <div className="emailInputContainer">
                                <label htmlFor="emailInput" className="secondary-text">Email</label>
                                <div className={`inputFieldContainer ${errors.email ? "error" : ""}`}>
                                    <input id="emailInput" type="text" className="emailInput" autoFocus autocomplete="off" placeholder="johndoe@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} onClick={() => setErrors(newErrors)} />
                                </div>
                                {errors.email && <i><p className="errorFont">{errors.email}</p></i>}
                            </div>
                            <div className="passwordInputContainer">
                                <label htmlFor="passwordInput" className="secondary-text">Password</label>
                                <div className={`inputFieldContainer ${errors.password ? "error" : ""}`}>
                                    <input id="passwordInput" type={type === "password" ? "password" : "text"} className="passwordInput" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onClick={() => setErrors(newErrors)} />
                                    <div className="typeChange" onClick={handleTypeClick}>
                                        {
                                            type === "password" ? 
                                            <div className="eyeContainer">
                                                <div className="light">
                                                    <img src={lightModeOpenEye} alt="CT" />
                                                </div>
                                                <div className="dark">
                                                    <img src={darkModeOpenEye} alt="CT" />
                                                </div>
                                            </div> :
                                            <div className="eyeContainer">
                                                <div className="light">
                                                    <img src={lightModeClosedEye} alt="CT" />
                                                </div>
                                                <div className="dark">
                                                    <img src={darkModeClosedEye} alt="CT" />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                {errors.password && <i><p className="errorFont">{errors.password}</p></i>}
                            </div>
                        </div>
                        {error && <p className='errorFont'>{error}</p>}
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