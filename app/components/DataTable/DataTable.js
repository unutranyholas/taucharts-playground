import React, { Component } from 'react'
import _ from 'lodash'
import d3 from 'd3'
import Reactable from 'reactable'
import style from './DataTable.css'

export default class DataTable extends Component {
  constructor(props) {
    super(props)
    this.state = {top: 0, height: 200}
  }

  render() {
    const {data, actions} = this.props;
    let Table = Reactable.Table;

    const paging = (data.length > 50) ? {itemsPerPage: 50, pageButtonLimit: 10} : {};
    return (
      <span ref="popupContainer">
        <div className="fullscreen" onClick={actions.togglePopup}></div>
        <div className="data-table" style={{top: this.state.top, maxHeight: this.state.height}}>
          <Table data={data} sortable={true} {...paging} />
        </div>
      </span>
    )
  }

  componentDidMount () {
    const bound = this.refs.popupContainer.getBoundingClientRect();
    this.setState({
      top: (bound.top + bound.height),
      height: (Math.max(document.documentElement.clientHeight, window.innerHeight || 0)) - (bound.top + bound.height + 30)
    });
  }
}