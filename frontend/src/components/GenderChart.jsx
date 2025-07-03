// src/components/GenderChart.jsx
import React, { useEffect, useState } from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';
import axios from 'axios';

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const GenderChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/summary/gender')
      .then(res => {
        const chartData = res.data.map(item => ({
          label: item._id || 'Unknown',
          value: item.count
        }));
        setData(chartData);
      })
      .catch(err => {
        console.error("❌ Error fetching gender data:", err);
      });
  }, []);

  const chartConfigs = {
    type: "pie3d",
    width: "100%",
    height: 400,
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Gender-wise Distribution",
        theme: "zune",
        pieRadius: "70%",
        baseFontSize: "14",
        labelFontSize: "14",
        showValues: "1",
        valueFontSize: "12",
        // plotToolText: "<b>$label</b>: $value applicants"
      },
      data
    }
  };

  return <ReactFC {...chartConfigs} />;
};

export default GenderChart;
