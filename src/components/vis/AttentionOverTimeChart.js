import React from 'react';
import ReactHighcharts from 'react-highcharts';
import highchartsMore from 'highcharts-more';
highchartsMore(ReactHighcharts.Highcharts);
import highchartsExporting from 'highcharts-exporting';
highchartsExporting(ReactHighcharts.Highcharts);
import highchartsOfflineExporting from 'highcharts-offline-exporting';
highchartsOfflineExporting(ReactHighcharts.Highcharts);

class AttentionOverTime extends React.Component {

  getConfig() {
    const config = {
      chart: {
        type: 'spline',
        zoomType: 'x',
      },
      plotOptions: {
        series: {
          marker: {
            enabled: true,
          },
        },
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          millisecond: '%m/%e/%y',
          second: '%m/%e/%y',
          minute: '%m/%e/%y',
          hour: '%m/%e/%y',
          day: '%m/%e/%y',
          week: '%m/%e/%y',
          month: '%m/%y',
          year: '%Y',
        },
      },
      yAxis: {
        min: 0,
      },
    };
    return config;
  }

  render() {
    const { data, height, title, onDataPointClick, yAxisLabel, health } = this.props;
    const config = this.getConfig();
    config.title = { text: title };
    config.chart.height = height;
    config.yAxis.title = { text: yAxisLabel };
    // config.exporting.filename = title;
    config.xAxis = {
      type: 'datetime',
      plotBands: health,
    };
    config.series = data;
    if (onDataPointClick !== null) {
      config.plotOptions.series.point = { events: { click: onDataPointClick } };
    }
    config.plotOptions.series.marker.enabled = (data.length < 30);   // don't show dots on line if more than N data points
    // clean up the data
    const dates = data.map((d) => d.date);
    const intervalMs = (dates[1] - dates[0]);
    const intervalDays = intervalMs / (1000 * 60 * 60 * 24);
    const allSeries = [{
      id: 0,
      name: yAxisLabel,
      color: '#000066',
      // turning variable time unit into days
      data: data.map((d) => d.count / intervalDays),
      pointStart: dates[0],
      pointInterval: intervalMs,
      cursor: 'pointer',
    }];
    config.series = allSeries;
    // render out the chart
    return (
      <ReactHighcharts config={config} />
    );
  }

}

AttentionOverTime.propTypes = {
  data: React.PropTypes.array.isRequired,
  height: React.PropTypes.number.isRequired,
  title: React.PropTypes.string,
  yAxisLabel: React.PropTypes.string,
  health: React.PropTypes.array,
  onDataPointClick: React.PropTypes.func,
};

export default AttentionOverTime;
