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
    const {datasets, currentData, popup, dispatch, collapsing} = this.props;

    if(_.isEmpty(datasets)) {return <div className="playground">No data</div>}

    const cloneConfig = _.cloneDeep(datasets[currentData].config);
    const chartConfig = this.prepareConfig(cloneConfig, datasets[currentData].data.transformed, collapsing);

    //console.log(chartConfig);

    const props = {
      dispatch: dispatch,
      popup: popup,
      options: update(datasets[currentData].options, {$merge: {data: _.keys(datasets)}}),
      config: datasets[currentData].config,
      functions: datasets[currentData].functions,
      data: datasets[currentData].data,
      collapsing: collapsing
    };

    return (
      <div className="playground">
        <CodeEditor {...props} />
        <Chart config={chartConfig} lightConfig={datasets[currentData].config} functions={datasets[currentData].functions} collapsing={collapsing} />
      </div>
    )
  }

  prepareConfig(config, dataset, collapsing) {
    const data = (dataset !== undefined) ? dataset : [];
    const plugins = (config.plugins !== undefined) ? config.plugins.map(pl => tauCharts.api.plugins.get(pl)()) : [];
    let changes = [{$merge: {data: data, plugins: plugins}}];

    collapsing.forEach(c => {

      const path = c.split('__');
      path.shift();

      //console.log(path);

      changes.push(_.reduceRight(path, function (memo, arrayValue) {
        var obj = {};
        obj[arrayValue] = memo;
        return obj;
      }, {$set: {}}));

    });

    return changes.reduce((config, change) => { return update(config, change) }, config);
  }

}

export default connect(state => state)(App)