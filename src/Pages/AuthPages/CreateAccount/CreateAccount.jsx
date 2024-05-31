import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import blob1 from "../blob1.svg";
import blob2 from "../blob2.svg";
import lightLogo from "../light_theme_transparent.png";
import darkLogo from "../logo_dark_transparent.png";
import "./CreateAccount.css"

const SignIn = () => {

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateAccount = (event) => {
    event.preventDefault();
    console.log("Creating Account")
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
            <p className="headerText">Create Account</p>
            <p className="descHeaderText secondary-text">Let's get you started creating masterpieces!</p>
          </div>
          <div className="inputField">
            <div className="nameContainer">
              <div className="firstNameInputContainer">
                <label htmlFor="firstNameInput" className="secondary-text">First Name</label>
                <div className="inputFieldContainer">
                  <input id="firstNameInput" type="text" className="firstNameInput" autoFocus placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
              </div>
              <div className="lastNameInputContainer">
                <label htmlFor="lastNameInput" className="secondary-text">Last Name</label>
                <div className="inputFieldContainer">
                  <input id="lastNameInput" type="text" className="lastNameInput" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="username-email">
            <div className="userNameInputContainer">
              <label htmlFor="userNameInput" className="secondary-text">Username</label>
              <div className="inputFieldContainer">
                <input id="userNameInput" type="text" className="userNameInput" placeholder="johndoe" value={userName} onChange={(e) => setUserName(e.target.value)} />
              </div>
            </div>
            <div className="emailInputContainer">
              <label htmlFor="emailInput" className="secondary-text">Email</label>
              <div className="inputFieldContainer">
                <input id="emailInput" type="text" className="emailInput" placeholder="johndoe@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
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
            <button type="submit" className='signInButton' onClick={handleCreateAccount}>Create Account</button>
          </div>
          <div className="redirect">
            <p className="redirectText">Have an account? <Link to="/signIn"><span className="highlight-purple">Login</span></Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn