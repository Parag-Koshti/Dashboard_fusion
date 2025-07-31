import React, { useEffect, useState } from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';
import axios from 'axios';

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DrillDownStreamGender = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://172.16.23.130:4000/api/drilldown/stream-gender')
      .then(res => {
        const config = {
          type: 'column2d',
          width: '100%',
          height: '500',
          dataFormat: 'json',
          dataSource: {
            chart: {
              caption: "Stream-wise Applications",
              xAxisName: "Stream",
              yAxisName: "Applications",
              theme: "fusion",
              showBackBtn: "1",
              backBtnText: "← Back"
            },
            data: res.data.data,
            linkeddata: res.data.linkeddata
          }
        };

        setChartData(config);
      })
      .catch(err => {
        console.error("❌ Error loading Stream-Gender drill-down:", err);
      });
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ textAlign: 'center' }}>Drilldown Chart: (Stream → Gender)</h3>
      {chartData ? <ReactFC {...chartData} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default DrillDownStreamGender;
