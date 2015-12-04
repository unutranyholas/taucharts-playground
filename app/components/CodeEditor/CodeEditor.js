import React, { Component } from 'react'

import Textarea from 'react-textarea-autosize'
import _ from 'lodash'
import { ConfigProp, DataManager, DataTable, DataPoint, FuncEditor, FuncGenerator } from '../'
import { addDataset, updateConfig, createFacet, togglePlugin, switchDataset, togglePopup, updateFunction } from '../../actions'

import style from './CodeEditor.css'

export default class CodeEditor extends Component {
  render() {
    const { dispatch, popup, options, datasets, config, functions, data } = this.props;

    //Properties
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

    //Data states
    const labelsMatch = {
      init: 'row',
      parsed: 'data',
      transformed: 'data'
    };
    let dataPoint = _.mapValues(data, (data, name) => {

      const props = {
        isPopupShown: (popup === name),
        label: labelsMatch[name],
        data: data,
        actions: {
          togglePopup: (e) => dispatch(togglePopup(name))
        }
      };

      return (
        <DataPoint key={name} {...props} />
      )

    });


    //Editors
    const placeholdersMatch = {
      parse: '// parse rows',
      transform: '// transform data'
    };
    let funcEditor = _.mapValues(functions, (func, name) => {

      const props = {
        name: name,
        label: placeholdersMatch[name],
        func: func,
        actions: {
          update: e => dispatch(updateFunction({[name]: e.target.value.split('\n')}))
        }
      };

      return (
        <FuncEditor key={name} {...props} />
      )
    });


    //Data manager
    const dataManager = (<DataManager {...this.props} />);

    //Functions generator
    const funcGenerator = (<FuncGenerator {...this.props} />);


    return (
      <div className="code">
        <pre>
          d3.csv({dataManager}, function({funcGenerator})&#123;{'\n'}
          {funcEditor.parse}{'\n'}
          return row;{'\n'}
          &#125;, function({dataPoint.parsed})&#123;{'\n'}
          {funcEditor.transform}{'\n'}
          var chart = tauCharts.Chart(&#123;{'\n'}
          {'  '}data:{'      '}{dataPoint.transformed},{'\n'}
          {'  '}type:{'    '}{configProp.type},{'\n'}
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

  //shouldComponentUpdate (nextProps, nextState) {
  //  return JSON.stringify(nextProps.functions) === JSON.stringify(this.props.functions);
  //}
}