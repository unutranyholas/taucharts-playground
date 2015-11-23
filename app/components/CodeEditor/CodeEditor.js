import React, { Component } from 'react'
import { Property } from '../'
import { addDataset, updateConfig, createFacet, togglePlugin, switchDataset, toggleMenu } from '../../actions'

import style from './CodeEditor.css'

export default class CodeEditor extends Component {
  render() {
    const { dispatch, menu, options, datasets, config } = this.props.p;

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
              dispatch(toggleMenu(name));
            },
            facet: (e) => dispatch(createFacet({[name]: e.target.dataset.opt}))
          };
          break;
        case 'data':
          action = (e) => {
            dispatch(switchDataset(e.target.dataset.opt));
            dispatch(toggleMenu(name));
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
            dispatch(toggleMenu(name));
          }
      }

      const p = {
          name: name,
          val: val,
          options: options[name],
          menu: (name === menu),
          action: action,
          toggleMenu: (e) => dispatch(toggleMenu(name))
      };

      return (
        <Property key={i} p={p} />
      )
    });

    return (
      <div className="code">
        <pre>d3.csv(<a href="javascript: void 0">'{config.data}.csv'</a>, function(row)&#123;</pre>
        <pre className="disabled">// parse rows</pre>
        <pre>&#125;, function(<a href="javascript: void 0">{config.data}</a>) &#123;</pre>
        <pre className="disabled">// transform data</pre>
        <pre>var chart = new tauCharts.Chart(&#123;</pre>
        {props}
        <pre>&#125;);</pre>
        <pre>chart.renderTo('#container');</pre>
        <pre>&#125;);</pre>
        <div id="chart"></div>
      </div>
    )
  }
}