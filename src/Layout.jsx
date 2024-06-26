import React from 'react';
import NavBar from './Components/NavBar/NavBar'
import blob1 from "./Pages/AuthPages/blob1.svg";
import blob2 from "./Pages/AuthPages/blob2.svg";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="layoutContainer">
      <div className={`blobContainer`}>
        <img src={blob1} className="blob" alt="blob" />
        <img src={blob2} className="blob" alt="blob" />
      </div>
      <div className="layoutContent">
        <NavBar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout