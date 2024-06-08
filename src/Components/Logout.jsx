import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Logout.css";
import { UserContext } from '../context/UserContext';

const LogoutButton = () => {

    const {logout} = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("./login", {replace: true})
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

  return (
    <div className="logoutContainer">
        <button className="logoutButton" onClick={handleLogout}><p className="logoutButtonText">Logout</p></button>
    </div>
  )
}

export default LogoutButton;