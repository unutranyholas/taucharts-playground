import React, { Component } from 'react'
import update from 'react-addons-update'
import _ from 'lodash'

import * as tauCharts from 'tauCharts'
import tooltip from 'tauCharts-tooltip'
import legend from 'tauCharts-legend'
import quickFilter from 'tauCharts-quick-filter'
import trendline from 'tauCharts-trendline'

////import Export from 'tauCharts-export'
//import annotations from 'tauCharts-annotations'

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

        //// test plugins
        //this.config.plugins = this.config.plugins || [];
        //this.config.plugins.push(tooltip());
        //this.config.plugins.push(legend());

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
    //console.log('chart updated');

    this.chart.destroy();
    document.getElementById('chart').innerHTML = '';
    document.getElementById('error').innerHTML = '';
    document.getElementById('error').classList.remove('show');

    this.renderChart();
  }
  shouldComponentUpdate (nextProps, nextState) {

    //TODO: not to update chart if visible data wasn't changed ?
    return JSON.stringify(nextProps.lightConfig) !== JSON.stringify(this.props.lightConfig) || JSON.stringify(nextProps.functions) !== JSON.stringify(this.props.functions)
  }
}