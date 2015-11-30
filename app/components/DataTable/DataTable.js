import React, { Component } from 'react'
import _ from 'lodash'
import d3 from 'd3'
import Reactable from 'reactable'
import style from './DataTable.css'

export default class DataTable extends Component {
  render() {
    const {data, toggleMenu} = this.props;
    let Table = Reactable.Table;

    const paging = (data.length > 50) ? {itemsPerPage: 50, pageButtonLimit: 10} : {};
    return (
      <div>
        <div className="fullscreen" onClick={toggleMenu}></div>
        <div className="data-table">
          <Table data={data} sortable={true} {...paging} />
        </div>
      </div>
    )
  }
}