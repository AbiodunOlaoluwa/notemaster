import React from 'react';
import { motion } from 'framer-motion';
import "./LandingPage.css";
import blob1 from "./blob1.svg";
import blob2 from "./blob2.svg";
import lightLogo from "./Assets/light_theme_transparent.png";
import darkLogo from "./Assets/logo_dark_transparent.png";
import TypeWriter from '../../Components/NavBar/TypeWriter';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleButtonClick = (event) => {
        event.preventDefault();
        navigate("/signIn");
    }

    return (
        <motion.div
            className="landingPageContainer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className={`blobContainer`}>
                <img src={blob1} className="blob" alt="blob" />
                <img src={blob2} className="blob" alt="blob" />
            </div>
            <div className={`contentContainer`}>
                <div className="headerContainer">
                    <div className="logoContainer">
                        <motion.div
                            className="lightLogo"
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <img src={lightLogo} alt="lightLogo" className='logo' />
                        </motion.div>
                        <motion.div
                            className="darkLogo"
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <img src={darkLogo} alt="darkLogo" className='logo' />
                        </motion.div>
                    </div>
                    <motion.p
                        className="logotitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        NoteMaster
                    </motion.p>                </div>
                <div className="content">
                    <div className="mainHeaderContainer">
                        <motion.h1
                            className="mainHeaderText"
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            Smart <span className="highlight-purple">AI Assisted</span> Note Taking.
                        </motion.h1>
                    </div>
                    <div className="typeWriterEffectContainer">
                        <motion.h2
                            className="typeWriterText secondary-text"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <TypeWriter />
                        </motion.h2>
                    </div>
                    <div className="getStartedButtonContainer">
                        <div className="getStartedButton">
                            <motion.button
                                onClick={handleButtonClick}
                                className="getStarted purple-bg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                Get Started
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default LandingPage;
