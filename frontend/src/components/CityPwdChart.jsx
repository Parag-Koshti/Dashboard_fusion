import React, { useEffect, useState } from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const CityPwdChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch('http://172.16.23.130:4000/api/drilldown/city-preference-breakup') // or city-pwd
      .then(res => res.json())
      .then(data => setChartData(data))
      .catch(err => console.error("Error fetching chart data:", err));
  }, []);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div>
      <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
        Drilldown Chart (City → Preferences)
      </h3>
      <ReactFC
        type="column2d"
        width="100%"
        height="500"
        dataFormat="json"
        dataSource={chartData}
      />
    </div>
  );
};

export default CityPwdChart;
