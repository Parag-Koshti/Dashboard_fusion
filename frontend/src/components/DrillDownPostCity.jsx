import React, { useEffect, useState } from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';
import axios from 'axios';

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DrillDownCityPost = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://172.16.23.130:4000/api/drilldown/city-post') // ✅ City → Post endpoint
      .then(res => {
        setChartData({
          type: 'Column2d',
          width: '100%',
          height: '500',
          dataFormat: 'json',
          dataSource: {
            chart: {
              caption: "Total Preferences per City (1st + 2nd + 3rd)",
              xAxisName: "City",
              yAxisName: "Total Preferences",
              theme: "fusion",
              showBackBtn: "1",
              backBtnText: "← Back",
            },
            data: res.data.data,
            linkeddata: res.data.linkeddata
          }
        });
      })
      .catch(err => {
        console.error("❌ Error loading city-post drilldown data:", err);
      });
  }, []);

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginTop: '2rem' }}>
        Drilldown Chart: (City → Post)
      </h3>
      {chartData ? <ReactFC {...chartData} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default DrillDownCityPost;
