import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

const DashBoard = () => {

  const {user} = useContext(UserContext);

  return (
    <div className="dashboardMainContainer">
      <div className="dashboardHeaderContainer"></div>
      <div className="analyticsOverviewContainer"></div>
      <div className="analyticsDeepDive"></div>
    </div>
  )
}

export default DashBoard