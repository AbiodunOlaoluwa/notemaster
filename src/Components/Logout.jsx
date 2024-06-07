import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Logout.css"

const LogoutButton = () => {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/logout", {withCredentials: true});
            if (response.data.message === "Logout Successful") {
                navigate("/login", {replace: true});
            }
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