import React, { useState } from 'react';
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
import "./CreateAccount.css";
import ComponentLoadingSpinner from '../../../Components/ComponentLoadingSpinner/ComponentLoadingSpinner';

const CreateAccount = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [type, setType] = useState("password");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    email: '',
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
  });

  const newErrors = {};

  const handleTypeClick = () => {
    if (type === "password") {
      setType("text")
    }
    else setType("password");
  }

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

      try {
        const response = await axios.post("http://localhost:3001/api/createAccount", {
          email,
          firstName,
          lastName,
          userName,
          password
        });
        setLoading(false);
        setSuccess(response.data.message);
        setError("");
        setTimeout(() => navigate('/login', { replace: true }), 2500)
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 409) {
          setError("An account with this email or username already exists.")
        } else {
          console.error("Error creating account:", error);
          setError("Failed to create account. Please try again.");
          setSuccess("");
        }
      }

    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
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
          <div className="light">
            <img src={lightLogo} alt="logo" className='authLogo' />
          </div>
          <div className="dark">
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
                    autoComplete="off"
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
                    autoComplete="off"
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
                    autoComplete="off"
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
                    autoComplete="off"
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
                  type={type === "password" ? "password" : "text"}
                  className="passwordInput"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onClick={() => setErrors(newErrors)}
                />
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
          {error && <p className="errorFont">{error}</p>}
          {success && <p className="success">{success}</p>}
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
