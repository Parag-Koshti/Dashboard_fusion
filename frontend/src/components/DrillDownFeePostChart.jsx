import React, { useEffect, useState } from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFusioncharts from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

Charts(FusionCharts);
FusionTheme(FusionCharts);

const DrillDownFeePostChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch('http://172.16.23.130:4000/api/drilldown/fee-post')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Chart Data:', data);

        // Validation
        const links = [];

        if (data?.data) {
          data.data.forEach(d => {
            if (d.link) links.push(d.link);
          });
        }

        if (data?.linkeddata) {
          data.linkeddata.forEach(ld => {
            if (ld.linkedchart?.data) {
              ld.linkedchart.data.forEach(d => {
                if (d.link) links.push(d.link);
              });
            }
          });
        }

        console.log("🔍 Validating links...");
        links.forEach(link => {
          const id = link.replace("newchart-json-", "");
          const found = data.linkeddata.find(ld => ld.id === id);
          console.log(`🔗 ${link} → ${found ? '✅ Found' : '❌ Not Found'}`);
        });

        setChartData(data);
      })
      .catch(err => console.error("❌ Fetch error:", err));
  }, []);

  return (
    <div>
      <h3 style={{ fontWeight: 'bold', marginBottom: '1rem',textAlign: 'center' }}>
        Drilldown Chart (Fee Status → Post)
      </h3>
      {chartData ? (
        <ReactFusioncharts
          type="column2d"
          width="100%"
          height="500"
          dataFormat="json"
          dataSource={chartData}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default DrillDownFeePostChart;
