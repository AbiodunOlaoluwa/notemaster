import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import blob1 from "../blob1.svg";
import blob2 from "../blob2.svg";
import lightLogo from "../light_theme_transparent.png";
import darkLogo from "../logo_dark_transparent.png";
import "./CreateAccount.css";
import ComponentLoadingSpinner from '../../../Components/ComponentLoadingSpinner/ComponentLoadingSpinner';

const CreateAccount = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
  });

  const newErrors = {};

  const validateForm = () => {
    if (!email) newErrors.email = 'This field is required';
    if (!firstName) newErrors.firstName = 'This field is required';
    if (!lastName) newErrors.lastName = 'This field is required';
    if (!userName) newErrors.userName = 'This field is required';
    if (!password) newErrors.password = 'This field is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    if (validateForm() && validatePassword(password)) {
      setLoading(true);

      // Simulate a network request
      try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log("Account Created");
        // Handle successful account creation logic here
      } catch (error) {
        console.error("Account creation failed", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Form validation failed");
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
      }));
      return false;
    }
    setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
    return true;
  };

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
                <div className={`inputFieldContainer ${errors.firstName ? "error" : ""}`}>
                  <input
                    id="firstNameInput"
                    type="text"
                    className="firstNameInput"
                    autoFocus
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onClick={() => setErrors(newErrors)}
                  />
                </div>
                {errors.firstName && <i><p className="errorFont">{errors.firstName}</p></i>}
              </div>
              <div className="lastNameInputContainer">
                <label htmlFor="lastNameInput" className="secondary-text">Last Name</label>
                <div className={`inputFieldContainer ${errors.lastName ? "error" : ""}`}>
                  <input
                    id="lastNameInput"
                    type="text"
                    className="lastNameInput"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onClick={() => setErrors(newErrors)}
                  />
                </div>
                {errors.lastName && <i><p className="errorFont">{errors.lastName}</p></i>}
              </div>
            </div>
            <div className="username-email">
              <div className="userNameInputContainer">
                <label htmlFor="userNameInput" className="secondary-text">Username</label>
                <div className={`inputFieldContainer ${errors.userName ? "error" : ""}`}>
                  <input
                    id="userNameInput"
                    type="text"
                    className="userNameInput"
                    placeholder="johndoe"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onClick={() => setErrors(newErrors)}
                  />
                </div>
                {errors.userName && <i><p className="errorFont">{errors.userName}</p></i>}
              </div>
              <div className="emailInputContainer">
                <label htmlFor="emailInput" className="secondary-text">Email</label>
                <div className={`inputFieldContainer ${errors.email ? "error" : ""}`}>
                  <input
                    id="emailInput"
                    type="text"
                    className="emailInput"
                    placeholder="johndoe@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onClick={() => setErrors(newErrors)}
                  />
                </div>
                {errors.email && <i><p className="errorFont">{errors.email}</p></i>}
              </div>
            </div>
            <div className="passwordInputContainer">
              <label htmlFor="passwordInput" className="secondary-text">Password</label>
              <div className={`inputFieldContainer ${errors.password ? "error" : ""}`}>
                <input
                  id="passwordInput"
                  type="password"
                  className="passwordInput"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onClick={() => setErrors(newErrors)}
                />
              </div>
              {errors.password && <i><p className="errorFont">{errors.password}</p></i>}
            </div>
          </div>
          <div className="buttonContainer">
            <button type="submit" className='signInButton' onClick={handleCreateAccount} disabled={loading}>
              {loading ? <ComponentLoadingSpinner /> : "Create Account"}
            </button>
          </div>
          <div className="redirect">
            <p className="redirectText">Have an account? <Link to="/login"><span className="highlight-purple">Login</span></Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
