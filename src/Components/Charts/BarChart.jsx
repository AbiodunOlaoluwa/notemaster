import React, { useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js';

const BarChart = ({ data, options }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current;

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  return <Bar ref={chartRef} data={data} options={options} />;
};

export default BarChart;
