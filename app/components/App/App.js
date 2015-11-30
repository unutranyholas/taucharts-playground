import React, { Component } from 'react'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import _ from 'lodash'
import d3 from 'd3'
import { addDataset, updateConfig, createFacet, togglePlugin, switchDataset, toggleMenu } from '../../actions'
import { CodeEditor, Chart } from '../'
import style from './App.css'

class App extends Component {
  render() {
    const {datasets, config, functions, options} = this.props;

    if(_.isEmpty(datasets)) {return <div className="playground">No data</div>}

    const cloneDatasets = _.cloneDeep(datasets);
    const cloneConfig = _.cloneDeep(config);
    const [initData, parsedData, transformedData] = this.prepareData(cloneDatasets[config.data].data, functions);

    const chartConfig = this.prepareConfig(cloneConfig, transformedData);

    const updatedKeys = _.keys(transformedData[0]);
    const updatedOptions = update(options, {$merge: {x: updatedKeys, y: updatedKeys, size: updatedKeys, color: updatedKeys}});

    const props = update(this.props, {$merge: {datasets: cloneDatasets, options: updatedOptions, transformations: [initData, parsedData, transformedData]}});

    return (
      <div className="playground">
        <CodeEditor {...props} />
        <Chart config={chartConfig} />
      </div>
    )
  }

  prepareConfig(config, dataset) {
    const data = (dataset !== undefined) ? dataset : [];
    const plugins = (config.plugins !== undefined) ? config.plugins.map(pl => 'tauCharts.api.plugins.get(pl)()') : [];
    return update(config, {$merge: {data: data, plugins: plugins}});
  }

  prepareData(data, functions) {
    const initData = _.cloneDeep(data);
    //TODO: catch errors
    data = _.cloneDeep(data).map(row => {
      eval(functions.parseData);
      return row
    });
    const parsedData = _.cloneDeep(data);
    eval(functions.transformData);
    const transformedData = _.cloneDeep(data);
    return [initData, parsedData, transformedData];
  }

}

export default connect(state => state)(App)