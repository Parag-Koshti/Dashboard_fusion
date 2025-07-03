import React, { useEffect, useState } from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';
import axios from 'axios';

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DrillDownPostCity = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/drilldown/post-city') // 👈 UPDATED ENDPOINT
      .then(res => {
        setChartData({
          type: 'Column2d',
          width: '100%',
          height: '500',
          dataFormat: 'json',
          dataSource: {
            chart: {
              caption: "Post-wise Applications",
              xAxisName: "Post",
              yAxisName: "Applications",
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
        console.error("❌ Error loading post-city drilldown data:", err);
      });
  }, []);

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginTop: '2rem' }}>
        Drilldown Chart: (Post → City)
      </h3>
      {chartData ? <ReactFC {...chartData} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default DrillDownPostCity;
