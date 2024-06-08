import React, { useRef, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart } from 'chart.js';

const PieChart = ({ data, options }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current;

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  return <Pie ref={chartRef} data={data} options={options} />;
};

export default PieChart;
