import React, { Component } from 'react'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import _ from 'lodash'
import d3 from 'd3'
import { addDataset, updateConfig, createFacet, togglePlugin, switchDataset } from '../../actions'
import { CodeEditor, Chart } from '../'
import style from './App.css'
import * as tauCharts from 'tauCharts'


class App extends Component {
  render() {
    const {datasets, currentData, popup, dispatch} = this.props;

    if(_.isEmpty(datasets)) {return <div className="playground">No data</div>}

    const cloneConfig = _.cloneDeep(datasets[currentData].config);
    const chartConfig = this.prepareConfig(cloneConfig, datasets[currentData].data.transformed);

    const props = {
      dispatch: dispatch,
      popup: popup,
      options: update(datasets[currentData].options, {$merge: {data: _.keys(datasets)}}),
      config: datasets[currentData].config,
      functions: datasets[currentData].functions,
      data: datasets[currentData].data
    };

    return (
      <div className="playground">
        <CodeEditor {...props} />
        <Chart config={chartConfig} lightConfig={datasets[currentData].config} functions={datasets[currentData].functions} />
      </div>
    )
  }

  prepareConfig(config, dataset) {
    const data = (dataset !== undefined) ? dataset : [];
    const plugins = (config.plugins !== undefined) ? config.plugins.map(pl => tauCharts.api.plugins.get(pl)()) : [];
    return update(config, {$merge: {data: data, plugins: plugins}});
  }

}

export default connect(state => state)(App)