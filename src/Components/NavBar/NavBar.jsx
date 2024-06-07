import React from 'react';
import "./NavBar.css"
import { Link } from 'react-router-dom';
import LogoutButton from '../Logout';

const NavBar = () => {
  return (
    <div className="navBarContainer">
      <div className="linksContainer">
        <Link to="/dashboard">
          <div className="linkContainer">
            <p>Dashboard</p>
          </div>
        </Link>
        <Link to="/createText">
          <div className="linkContainer">
            <p>New Text</p>
          </div>
        </Link>
        <Link to="/textsPage">
          <div className="linkContainer">
            <p>My Texts</p>
          </div>
        </Link>
      </div>
      <div className="logoutContainer">
        <div className="logoutButtonContainer">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

export default NavBar