import React, { Component } from 'react'
import { DataTable } from '../'
import style from './DataPoint.css'

export default class DataPoint extends Component {
  render() {
    const { isPopupShown, label, data, actions } = this.props;
    const dataTable = (isPopupShown) ? (<DataTable data={data} actions={actions} />) : null;
    const className = (isPopupShown) ? 'active' : null;

    return (
      <span className={className}>{dataTable}<a href="javascript: void 0" onClick={actions.togglePopup}>{label}</a></span>
    )
  }
}