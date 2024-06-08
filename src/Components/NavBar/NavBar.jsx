import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import "./NavBar.css";
import { UserContext } from '../../context/UserContext';
import { Link } from 'react-router-dom';
import LogoutButton from '../Logout';

const NavBar = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user])

  return (
    <div className="navBarContainer">
      {loading && <div className="loaderContainer">
        <l-trefoil
          size="40"
          stroke="4"
          stroke-length="0.15"
          bg-opacity="0.1"
          speed="1.4"
          color="white"
        ></l-trefoil>
      </div>}
      {
        user &&
        <div className="linksContainer">
          <div className="headerContainer">
            <h1 className="headerText">
              {user.firstname}
            </h1>
          </div>
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
      }
      <div className="logoutContainer">
        <div className="logoutButtonContainer">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

export default NavBar