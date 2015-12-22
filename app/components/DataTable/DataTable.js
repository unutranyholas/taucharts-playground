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
        <div className="data-table" style={{top: this.state.top, maxHeight: this.state.height}}>
          <Table data={data} sortable={true} {...paging} />
        </div>
      </span>
    )
  }

  componentDidMount () {
    const bounds = this.refs.popupContainer.getBoundingClientRect();
    this.setState({
      top: (bounds.top + bounds.height),
      height: (Math.max(document.documentElement.clientHeight, window.innerHeight || 0)) - (bounds.top + bounds.height + 30)
    });
  }

  componentWillMount () {
    document.addEventListener('click', this.props.actions.togglePopup, false);
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.props.actions.togglePopup, false);
  }

}