import React, { Component } from 'react'

import Textarea from 'react-textarea-autosize'
import _ from 'lodash'
import { ConfigProp, DataManager, DataTable, DataPoint, FuncEditor } from '../'
import { addDataset, updateConfig, createFacet, togglePlugin, switchDataset, togglePopup, updateFunction } from '../../actions'

import style from './CodeEditor.css'

export default class CodeEditor extends Component {
  render() {
    const { dispatch, popup, options, datasets, config, functions, dataStates } = this.props;
    let configProp = _.mapValues(config, (val, name) => {

      let actions = {
        update: (e) => dispatch(updateConfig({[name]: e.target.dataset.opt})),
        togglePopup: (e) => dispatch(togglePopup(name))
      };

      switch (name) {
        case 'data':
          actions.update = (e) => dispatch(switchDataset(e.target.dataset.opt));
          actions.addFile = (e) => dispatch(addData(e));
          actions.addURL = (e) => dispatch(addData(e));
          break;
        case 'x':
        case 'y':
          actions.facet = (e) => dispatch(createFacet({[name]: e.target.dataset.opt}));
          break;
        case 'plugins':
          actions.update = (e) => {
            dispatch(togglePlugin(e.target.dataset.opt));
            //dispatch(togglePopup(name));
          };
          break;
      }

      const props = {
          name: name,
          val: val,
          options: options[name],
          isPopupShown: (popup === name),
          actions: actions
      };

      return (
        <ConfigProp key={name} {...props} />
      )

    });

    let dataPoint = _.mapValues(dataStates, (data, name) => {

      const props = {
        isPopupShown: (popup === name),
        label: 'data',
        data: data,
        actions: {
          togglePopup: (e) => dispatch(togglePopup(name))
        }
      };

      return (
        <DataPoint key={name} {...props} />
      )

    });


    let funcEditor = _.mapValues(functions, (func, name) => {

      const props = {
        name: name,
        label: name,
        func: func,
        actions: {
          update: e => dispatch(updateFunction({parseData: e.target.value}))
        }
      };

      return (
        <FuncEditor key={name} {...props} />
      )
    });

    return (
      <div className="code">
        <pre>
          d3.csv({configProp.data}, function({dataPoint.initData})&#123;{'\n'}
          {funcEditor.parseData}{'\n'}
          return data;{'\n'}
          &#125;, function({dataPoint.parsedData})&#123;{'\n'}
          {funcEditor.transformData}{'\n'}
          var chart = tauCharts.Chart(&#123;{'\n'}
          {'  '}data:{'      '}{dataPoint.transformedData},{'\n'}
          {'  '}x:{'       '}{configProp.x},{'\n'}
          {'  '}y:{'       '}{configProp.y},{'\n'}
          {'  '}size:{'    '}{configProp.size},{'\n'}
          {'  '}color:{'   '}{configProp.color},{'\n'}
          {'  '}plugins:{' '}{configProp.plugins}{'\n'}
          &#125;);{'\n'}
          chart.renderTo('#container');{'\n'}
          &#125;)
        </pre>
      </div>
    )
  }
}