import React, { useEffect, useState } from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';
import axios from 'axios';

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const DrillDownChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://172.16.23.130:4000/api/drilldown/post-stream-gender')
      .then(res => {
        if (!res.data.data || !res.data.linkeddata) {
          console.error("❌ Missing data or linkeddata");
          return;
        }

        // 🔁 Remove Level 3: Keep only Level 2 data
        const level2OnlyLinkedData = res.data.linkeddata.filter(ld =>
          ld.id.startsWith("post-")
        );

        const config = {
          type: 'column2d',
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
              backBtnText: "← Back"
            },
            data: res.data.data,
            linkeddata: level2OnlyLinkedData
          }
        };

        setChartData(config);
      })
      .catch(err => {
        console.error("❌ Error loading drill-down data:", err);
      });
  }, []);

  return (
    <div>
      <h3 style={{ textAlign: 'center' }}>  Drilldown Chart (Post → Stream)</h3>
      {chartData ? <ReactFC {...chartData} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default DrillDownChart;
