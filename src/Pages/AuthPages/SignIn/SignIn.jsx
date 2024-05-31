import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import blob1 from "../blob1.svg";
import blob2 from "../blob2.svg";
import lightLogo from "../light_theme_transparent.png";
import darkLogo from "../logo_dark_transparent.png";
import "./SignIn.css"

const SignIn = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event) => {
        event.preventDefault();
        console.log("Login")
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
                            <div className="inputFieldContainer">
                                <input id="emailInput" type="text" className="emailInput" autoFocus placeholder="johndoe@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>
                        <div className="passwordInputContainer">
                            <label htmlFor="passwordInput" className="secondary-text">Password</label>
                            <div className="inputFieldContainer">
                                <input id="passwordInput" type="password" className="passwordInput" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="buttonContainer">
                        <button type="submit" className='signInButton' onClick={handleLogin}>Login</button>
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