import React, { Component } from 'react'
import update from 'react-addons-update'
import * as tauCharts from 'taucharts/build/development/tauCharts'
import tauStyles from 'taucharts/build/production/tauCharts.min.css'
import style from './Chart.css'


export default class Chart extends Component {
  render() {
    const {datasets, config} = this.props.p;
    this.config = this.prepareConfig(config, datasets[config.data]);

    return (
      <div className="chart">
        <div className="error" id="error"></div>
        <div className="container" id="chart"></div>
      </div>
    )
  }
  prepareConfig(config, dataset) {
    const data = (dataset !== undefined) ? dataset.data : [];
    const plugins = (config.plugins !== undefined) ? config.plugins.map(pl => 'tauCharts.api.plugins.get(pl)()') : [];
    return update(config, {$merge: {data: data, plugins: plugins}});
  }
  renderChart() {
    try {
      this.chart = new tauCharts.Chart(this.config);
      this.chart.renderTo('#chart');
    } catch (err) {
      document.getElementById('error').classList.add('show');
      document.getElementById('error').innerHTML = err;
      //TODO: refs, getDOMNode etc
    }
  }
  componentDidMount () {
    this.renderChart();
  }
  componentDidUpdate () {
    this.chart.destroy();
    document.getElementById('chart').innerHTML = '';
    document.getElementById('error').innerHTML = '';
    document.getElementById('error').classList.remove('show');

    this.renderChart();
  }
}