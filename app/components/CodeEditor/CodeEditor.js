import React, { Component } from 'react'
import Textarea from 'react-textarea-autosize'
import { Property, FileManager, DataTable } from '../'
import { addDataset, updateConfig, createFacet, togglePlugin, switchDataset, toggleMenu } from '../../actions'

import style from './CodeEditor.css'

export default class CodeEditor extends Component {
  render() {
    const { dispatch, menu, options, datasets, config } = this.props.p;
    const isDataTableShown = ('dataTable' === menu);
    let props = _.pairs(config).map((pair, i) => {

      const name = pair[0];
      const val = pair[1];

      let action;

      switch (name) {
        case 'x':
        case 'y':
          action = {
            update: (e) => {
              dispatch(updateConfig({[name]: e.target.dataset.opt}));
              //dispatch(toggleMenu(name));
            },
            facet: (e) => dispatch(createFacet({[name]: e.target.dataset.opt}))
          };
          break;
        case 'data':
          action = (e) => {
            dispatch(switchDataset(e.target.dataset.opt));
            //dispatch(toggleMenu(name));
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
            //dispatch(toggleMenu(name));
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

    return (
      <div className="code">
        <FileManager p={this.props.p} />
        <Textarea placeholder="// parse rows" className="editor" />
        <pre className={(isDataTableShown) ? 'show-menu' : null}>&#125;, function(<a href="javascript: void 0" onClick={(e) => dispatch(toggleMenu('dataTable'))}>data</a>) &#123; {(isDataTableShown) ? <DataTable data={datasets[config.data]} toggleMenu={(e) => dispatch(toggleMenu('dataTable'))} /> : null}</pre>
        <Textarea placeholder="// transform data" className="editor" />
        <pre>var chart = new tauCharts.Chart(&#123;</pre>
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