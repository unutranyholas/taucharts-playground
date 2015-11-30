import React, { Component } from 'react'

import Textarea from 'react-textarea-autosize'
import { Property, FileManager, DataTable } from '../'
import { addDataset, updateConfig, createFacet, togglePlugin, switchDataset, toggleMenu, updateFunction } from '../../actions'

import style from './CodeEditor.css'

export default class CodeEditor extends Component {
  constructor (props) {
    super(props);
    this.state = props.functions;
  }

  componentWillReceiveProps(nextProps){
    this.state = nextProps.functions;
  }
  render() {
    const { dispatch, menu, options, datasets, config, functions, transformations } = this.props;
    const isDataTable1Shown = ('dataTable1' === menu);
    const isDataTable2Shown = ('dataTable2' === menu);
    let props = _.pairs(config).filter(pair => pair[0]!=='data').map((pair, i) => {

      const name = pair[0];
      const val = pair[1];

      let action;

      switch (name) {
        case 'x':
        case 'y':
          action = {
            update: (e) => {
              dispatch(updateConfig({[name]: e.target.dataset.opt}));
            },
            facet: (e) => dispatch(createFacet({[name]: e.target.dataset.opt}))
          };
          break;
        case 'plugins':
          action = (e) => {
            dispatch(togglePlugin(e.target.dataset.opt));
            dispatch(toggleMenu(name));
          };
          break;
        default:
          action = (e) => {
            dispatch(updateConfig({[name]: e.target.dataset.opt}));
          }
      }

      const p = {
          name: name,
          val: val,
          options: options[name],
          isMenuShown: (name === menu),
          action: action,
          toggleMenu: (e) => dispatch(toggleMenu(name))
      };

      return (
        <Property key={i} p={p} />
      )
    });

    console.log(functions);

    return (
      <div className="code">
        <FileManager {...this.props} />
        <Textarea
          placeholder="// parse rows"
          className="editor"
          onBlur={e => dispatch(updateFunction({parseData: e.target.value}))}
          onChange={e => this.setState({parseData: e.target.value})}
          defaultValue={functions.parseData}
          value={this.state.parseData} />
        <pre>return row;</pre>
        <pre className={(isDataTable1Shown) ? 'show-menu' : null}>&#125;, function(<a href="javascript: void 0" onClick={(e) => dispatch(toggleMenu('dataTable1'))}>data</a>) &#123; {(isDataTable1Shown) ? <DataTable data={transformations[1]} toggleMenu={(e) => dispatch(toggleMenu('dataTable1'))} /> : null}</pre>
        <Textarea
          placeholder="// transform data"
          className="editor"
          onBlur={e => dispatch(updateFunction({transformData: e.target.value}))}
          onChange={e => this.setState({transformData: e.target.value})}
          defaultValue={functions.transformData}
          value={this.state.transformData} />
        <pre>var chart = new tauCharts.Chart(&#123;</pre>
        <pre className={(isDataTable2Shown) ? 'show-menu' : null}>&nbsp;&nbsp;data:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript: void 0" onClick={(e) => dispatch(toggleMenu('dataTable2'))}>data</a>, {(isDataTable2Shown) ? <DataTable data={transformations[2]} toggleMenu={(e) => dispatch(toggleMenu('dataTable2'))} /> : null}</pre>
        {props}
        <pre>&#125;);</pre>
        <pre>chart.renderTo('#container');</pre>
        <pre>&#125;);</pre>
      </div>
    )
    //TODO: wrap DataTable call into component
    //<Property p={fileSwitcherProps} />
    //<pre>d3.csv(<a href="javascript: void 0">'{config.data}.csv'</a>, function(row)&#123;</pre>
  }
}