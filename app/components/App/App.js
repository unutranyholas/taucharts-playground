import React, { Component } from 'react'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import SplitPane from 'react-split-pane'
import _ from 'lodash'
import d3 from 'd3'
import { addDataset, updateConfig, createFacet, togglePlugin, switchDataset } from '../../actions'
import { CodeEditor, Chart } from '../'
import style from './App.css'
import * as tauCharts from 'tauCharts'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: '25%',
      userSelect: true
    };

    this.handleChange = this.handleChange.bind(this);
  }
  render() {
    const {datasets, currentData, popup, dispatch, collapsing} = this.props;

    if(_.isEmpty(datasets)) {return <div className="loading">Loading...</div>}

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
      <div className={(this.state.userSelect) ? 'allow-user-select' : null}>
        <SplitPane split="vertical" minSize="150" defaultSize={this.state.width} onChange={this.handleChange} >
          <CodeEditor {...props} width={this.state.width} />
          <Chart config={chartConfig} lightConfig={datasets[currentData].config} functions={datasets[currentData].functions} collapsing={collapsing} width={this.state.width} />
        </SplitPane>
      </div>
    )
  }

  handleChange(e) {
    this.setState({width: e, userSelect: false});
    const self = this;
    setTimeout(() => {self.setState({userSelect: true})}, 3000)
  }

  prepareConfig(config, dataset, collapsing) {
    const data = (dataset !== undefined) ? dataset : [];
    const plugins = (config.plugins !== undefined) ? config.plugins.map(pl => tauCharts.api.plugins.get(pl)()) : [];
    let changes = [{$merge: {data: data, plugins: plugins}}];

    collapsing.forEach(c => {
      const path = c.split('__');
      path.shift();

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