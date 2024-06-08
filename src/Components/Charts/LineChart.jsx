import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js';

const LineChart = ({ data, options }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current;

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  return <Line ref={chartRef} data={data} options={options} />;
};

export default LineChart;
