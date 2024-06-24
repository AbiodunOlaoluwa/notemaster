import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import "./DashBoard.css";
import { trefoil } from 'ldrs';
import PieChart from '../../Components/Charts/PieChart';
import BarChart from '../../Components/Charts/BarChart';
import LineChart from '../../Components/Charts/LineChart';
import "../../Components/Charts/ChartSetup";

const DashBoard = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [lineData, setLineData] = useState(null);

  trefoil.register();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard-data/${user.id}`);
      const { activityBreakdown, sessionDurations, monthlyProgress } = response.data;

      if (activityBreakdown && sessionDurations && monthlyProgress) {
        setPieData({
          labels: ['Writing Duration (minutes)', 'Break Duration (minutes)', 'Inactive Duration (minutes)'],
          datasets: [{
            data: [activityBreakdown.writing_time, activityBreakdown.break_time, activityBreakdown.inactive_time],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }]
        });

        setBarData({
          labels: sessionDurations.sessions.map((session, index) => `Session ${index + 1}`),
          datasets: [{
            label: 'Writing Duration (minutes)',
            data: sessionDurations.sessions.map(session => session.writing_duration),
            backgroundColor: '#36A2EB'
          }]
        });

        setLineData({
          labels: monthlyProgress.months,
          datasets: [{
            label: 'Monthly Writing Duration (minutes)',
            data: monthlyProgress.writingTimes,
            fill: false,
            borderColor: '#FF6384'
          }]
        });
      } else {
        // Set default data for new users
        setPieData({
          labels: ['Writing Duration (minutes)', 'Break Duration (minutes)', 'Inactive Duration (minutes)'],
          datasets: [{
            data: [0, 0, 0],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }]
        });

        setBarData({
          labels: ['Session 1', 'Session 2', 'Session 3'],
          datasets: [{
            label: 'Writing Duration (minutes)',
            data: [0, 0, 0],
            backgroundColor: '#36A2EB'
          }]
        });

        setLineData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{
            label: 'Monthly Writing Duration (minutes)',
            data: [0, 0, 0, 0, 0],
            fill: false,
            borderColor: '#FF6384'
          }]
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
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
                {pieData && <PieChart data={pieData} options={chartOptions} />}
              </div>
              <div className="recommendationsButtonContainer">
                <Link to={"/recommendations"}>
                  <button className="recommendationsButton">Recommendations</button>
                </Link>
              </div>
            </div>
            <div className="chartGroup2">
              <div className="chartContainer G2">
                <h2>Session Durations</h2>
                {barData && <BarChart data={barData} options={chartOptions} />}
              </div>
              <div className="chartContainer G2">
                <h2>Monthly Progress</h2>
                {lineData && <LineChart data={lineData} options={chartOptions} />}
              </div>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default DashBoard;
