import React, { useEffect, useState } from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import OceanTheme from 'fusioncharts/themes/fusioncharts.theme.ocean';
import ReactFC from 'react-fusioncharts';

ReactFC.fcRoot(FusionCharts, Charts, OceanTheme);

const PostChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://172.16.23.130:4000/api/summary/post')
      .then(res => res.json())
      .then(res => {
        const chartData = res.map(item => ({
          label: item._id || 'Unknown',
          value: item.count
        }));
        setData(chartData);
      });
  }, []);

  const chartConfigs = {
    type: 'column2d',
    width: '100%',
    height: 400,
    dataFormat: 'json',
    dataSource: {
      chart: {
        caption: 'Post-wise Applications',
        xAxisName: 'Post',
        yAxisName: 'Applications',
        theme: 'ocean',
        labelFontSize: '14',
        labelFontBold: '1',
        labelDisplay: 'rotate',
        slantLabel: '1',
        labelStep: '1'
      },
      data
    }
  };

  return <ReactFC {...chartConfigs} />;
};

export default PostChart;