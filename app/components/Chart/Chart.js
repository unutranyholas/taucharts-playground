import React, { Component } from 'react'
import update from 'react-addons-update'
import _ from 'lodash'
import * as tauCharts from 'taucharts/build/development/tauCharts'
import tauStyles from 'taucharts/build/production/tauCharts.min.css'

import style from './Chart.css'


export default class Chart extends Component {
  render() {
    this.config = this.props.config;

    return (
      <div className="chart">
        <div className="error" id="error"></div>
        <div className="container" id="chart"></div>
      </div>
    )
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
    console.log('updated');

    this.chart.destroy();
    document.getElementById('chart').innerHTML = '';
    document.getElementById('error').innerHTML = '';
    document.getElementById('error').classList.remove('show');

    this.renderChart();
  }
  shouldComponentUpdate (nextProps, nextState) {
    return !_.isEqual(this.props.config, nextProps.config);
  }
}