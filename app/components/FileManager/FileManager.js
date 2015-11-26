import React, { Component } from 'react'
import { OptionsMenu } from '../'
import * as Papa from 'papaparse'
import style from './FileManager.css'

import _ from 'lodash'
import { addDataset, updateConfig, createFacet, togglePlugin, switchDataset, toggleMenu } from '../../actions'

export default class FileManager extends Component {

  render() {
    const { dispatch, menu, options, datasets, config } = this.props.p;
    const prop = 'data';
    const isMenuShown = (prop === menu);
    const p = {
      name: prop,
      val: config.data,
      options: options[prop].concat(['file'/*, 'url'*/]),
      isMenuShown: isMenuShown,
      action: {
        add: (e) => this.addData(e),
        switch: (e) => dispatch(switchDataset(e.target.dataset.opt))
      },
      toggleMenu: (e) => dispatch(toggleMenu('data'))
    };

    return (
      <pre className={(isMenuShown) ? 'show-menu' : null}>
        d3.csv(<a href="javascript: void 0" onClick={(e) => dispatch(toggleMenu('data'))}>{config.data}</a>, function(row)&#123;
        {(isMenuShown) ? <OptionsMenu p={p}/> : null}
      </pre>
    )
  }

  addData(e){
    const { dispatch } = this.props.p;

    //TODO: errors display
    //TODO: url and name - make different fields
    //TODO: json/csv

    console.log(e);
    switch (e.target.type) {
      case 'textarea':
        const url = e.target.value;
        d3.json(url, function(error, data){
          if (error) {
            console.log(error);
          } else {
            console.log(123);
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
          dynamicTyping: true,
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