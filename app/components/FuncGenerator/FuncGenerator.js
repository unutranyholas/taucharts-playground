import React, { Component } from 'react'
import { TypeSelector } from '../'
import style from './FuncGenerator.css'

import _ from 'lodash'
import { addDataset, updateConfig, createFacet, togglePlugin, switchDataset, togglePopup, updateFunction } from '../../actions'

export default class FuncGenerator extends Component {
  render() {

    const { dispatch, popup, options, datasets, config, functions, dataStates } = this.props;

    const name = 'typeSelector';
    const label = 'row';
    const isPopupShown = (popup === name);
    const keys = _.keys(dataStates.initData[0]);
    const actions = {
      togglePopup: (e) => dispatch(togglePopup(name)),
      update: (e) => {
        this.updateFunctions(e);
        dispatch(togglePopup(name))
      }
    };

    const typeSelector = (isPopupShown) ? (<TypeSelector name={name} options={keys} actions={actions} />) : null;
    const className = (isPopupShown) ? 'active' : null;

    return (
      <span className={className}>{typeSelector}<a href="javascript: void 0" onClick={actions.togglePopup}>{label}</a></span>
    )
  }

  updateFunctions(e) {
    const { dispatch, functions } = this.props;

    let result;
    const opt = e.target.dataset.opt;

    switch(e.target.dataset.type) {
      case 'num':
        result = 'row[\'' + opt + '\'] = +row[\'' + opt + '\'];';
        break;
      case 'date':
        result = 'row[\'' + opt + '\'] = new Date(row[\'' + opt + '\']);';
        break;
      case 'category':
        result = 'row[\'' + opt + '\'] = row[\'' + opt + '\'].toString();';
        break;
    }

    const changes = { parseData: functions.parseData.concat([result]) };
    dispatch(updateFunction(changes));

  }

}