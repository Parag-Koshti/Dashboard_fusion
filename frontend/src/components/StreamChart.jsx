import React, { useEffect, useState } from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const StreamChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://172.16.23.130:4000/api/summary/stream')
      .then(res => res.json())
      .then(data => {
        const chartData = data.map(item => ({
          label: item._id || 'Unknown',
          value: item.count
        }));
        setData(chartData);
      });
  }, []);

  const chartConfigs = {
    type: 'Column3d',
    width: '100%',
    height: 600,
    dataFormat: 'json',
    dataSource: {
      chart: {
        caption: 'Stream-wise Applications',
        theme: 'fusion',
        xAxisName: 'Stream',
        yAxisName: 'Applications',
        decimals: 0
      },
      data
    }
  };

  return <ReactFC {...chartConfigs} />;
};

export default StreamChart;