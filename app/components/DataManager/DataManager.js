import React, { Component } from 'react'
import { OptionsMenu } from '../'
import * as Papa from 'papaparse'
import style from './DataManager.css'

import _ from 'lodash'
import { addDataset, updateConfig, createFacet, togglePlugin, switchDataset, togglePopup } from '../../actions'

export default class DataManager extends Component {

  render() {
    const { dispatch, popup, options, datasets, config } = this.props;
    const prop = 'data';
    const className = (prop === popup) ? 'active' : null;
    const props = {
      name: prop,
      val: config.data,
      options: options[prop],
      actions: {
        add: (e) => this.addData(e),
        switch: (e) => dispatch(switchDataset(e.target.dataset.opt)),
        togglePopup: (e) => dispatch(togglePopup('data'))
      }
    };
    const optionsMenu = (prop === popup) ? (<OptionsMenu {...props} />) : null;

    return (
      <pre>
        <span className={className}>{optionsMenu}<a href="javascript: void 0" onClick={(e) => dispatch(togglePopup('data'))}>{config.data}</a></span>
      </pre>
    )
  }

  addData(e){
    const { dispatch } = this.props;

    //TODO: errors display
    //TODO: url and name - make different fields
    //TODO: json/csv

    //console.log(e);
    switch (e.target.type) {
      case 'textarea':
        const url = e.target.value;
        d3.json(url, function(error, data){
          if (error) {
            console.log(error);
          } else {
            const name = _.last(url.split('/'));
            dispatch(addDataset(name, data));
            dispatch(switchDataset(name));
          }
        });
        break;
      case 'file':
        const file = e.target.files[0];
        const name = file.name.split('.')[0];

        Papa.parse(file, {
          delimiter: '',	// auto-detect
          newline: '',	// auto-detect
          header: true,
          dynamicTyping: false,
          preview: 0,
          encoding: '',
          worker: false,
          comments: false,
          step: undefined,
          complete: (data) => {
            console.log(456);
            dispatch(addDataset(name, data.data));
            dispatch(switchDataset(name));
          },
          error: (error, file) => {
            //console.log(data);
            //console.log(file);
          },
          download: false,
          skipEmptyLines: false,
          chunk: undefined,
          fastMode: undefined,
          beforeFirstChunk: undefined,
          withCredentials: undefined
        });

        break;
      default:
        console.log(e);
    }

  }


}