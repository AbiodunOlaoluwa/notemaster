import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import "./DashBoard.css";
import { trefoil } from 'ldrs';
import PieChart from '../../Components/Charts/PieChart';
import BarChart from '../../Components/Charts/BarChart';
import LineChart from '../../Components/Charts/LineChart';
import "../../Components/Charts/ChartSetup";


const DashBoard = () => {

  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  trefoil.register();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user])

  const pieData = {
    labels: ['Writing Time', 'Break Time', 'Other Activities'],
    datasets: [{
      data: [60, 25, 15], // example data
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  };

  const barData = {
    labels: ['Session 1', 'Session 2', 'Session 3'],
    datasets: [{
      label: 'Writing Duration (minutes)',
      data: [30, 45, 50], // example data
      backgroundColor: '#36A2EB'
    }]
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Monthly Writing Time (minutes)',
      data: [120, 150, 180, 200, 210], // example data
      fill: false,
      borderColor: '#FF6384'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true
  };

  return (
    <div className="dashboardMainContainer">
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
        <>
          <div className="analyticsOverviewContainer">
            <div className="chartGroup1">
              <div className="chartContainer">
                <h2>Activity Breakdown</h2>
                <PieChart data={pieData} options={chartOptions} />
              </div>
            </div>
            <div className="chartGroup2">
              <div className="chartContainer G2">
                <h2>Session Durations</h2>
                <BarChart data={barData} options={chartOptions} />
              </div>
              <div className="chartContainer G2">
                <h2>Monthly Progress</h2>
                <LineChart data={lineData} options={chartOptions} />
              </div>
            </div>
          </div>
        </>
      }
    </div>

  )
}

export default DashBoard