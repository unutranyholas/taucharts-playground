import React, { Component } from 'react'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import _ from 'lodash'
import d3 from 'd3'
import { addDataset, updateConfig, createFacet, togglePlugin, switchDataset } from '../../actions'
import { CodeEditor, Chart } from '../'
import style from './App.css'

class App extends Component {
  render() {
    const {datasets, currentData, popup, dispatch} = this.props;

    if(_.isEmpty(datasets)) {return <div className="playground">No data</div>}

    const cloneConfig = _.cloneDeep(datasets[currentData].config);
    const chartConfig = this.prepareConfig(cloneConfig, datasets[currentData].data.transformed);

    //const cloneDatasets = _.cloneDeep(datasets);
    //const dataStates = this.prepareData(cloneDatasets[config.data].data, functions);
    //const updatedKeys = _.keys(dataStates.transformedData[0]);
    //const updatedOptions = update(options, {$merge: {x: updatedKeys, y: updatedKeys, size: updatedKeys, color: updatedKeys}});
    //const props = update(this.props, {$merge: {datasets: cloneDatasets, options: updatedOptions, dataStates: dataStates}});
    //<CodeEditor {...props} />

    const props = {
      dispatch: dispatch,
      popup: popup,
      options: update(datasets[currentData].options, {$merge: {data: _.keys(datasets)}}),
      config: datasets[currentData].config,
      functions: datasets[currentData].functions,
      data: datasets[currentData].data
    };

    //const { dispatch, popup, options, datasets, config, functions, dataStates } = this.props;
    //

    return (
      <div className="playground">
        <CodeEditor {...props} />
        <Chart config={chartConfig} lightConfig={datasets[currentData].config} functions={datasets[currentData].functions} />
      </div>
    )
  }

  prepareConfig(config, dataset) {
    const data = (dataset !== undefined) ? dataset : [];
    const plugins = (config.plugins !== undefined) ? config.plugins.map(pl => 'tauCharts.api.plugins.get(pl)()') : [];
    return update(config, {$merge: {data: data, plugins: plugins}});
  }
  //
  //prepareData(data, functions) {
  //  const initData = _.cloneDeep(data);
  //  //TODO: catch errors
  //  data = _.cloneDeep(data).map(row => {
  //    eval(functions.parseData.join('\n'));
  //    return row
  //  });
  //  const parsedData = _.cloneDeep(data);
  //  eval(functions.transformData.join('\n'));
  //  const transformedData = _.cloneDeep(data);
  //  return {
  //    initData: initData,
  //    parsedData: parsedData,
  //    transformedData: transformedData
  //  };
  //}

}

export default connect(state => state)(App)