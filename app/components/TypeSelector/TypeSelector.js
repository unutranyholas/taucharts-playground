import React, { Component } from 'react'
import _ from 'lodash'
import style from './TypeSelector.css'

export default class TypeSelector extends Component {
  render() {
    const {name, options, actions} = this.props;

    let list = options.map((opt, i) => {
      return (<OptionsItem key={i} opt={opt} actions={actions} />)
    });

    return (
      <span>
        <div className="fullscreen" onClick={actions.togglePopup}></div>
        <ul className="menu">
          {list}
        </ul>
      </span>
    )
  }
}

class OptionsItem extends Component {
  render() {
    const {opt, actions} = this.props;

    return (
      <li>
        <h3>{opt}</h3>
        <ul>
          <li><a href="javascript: void 0" onClick={actions.update} data-opt={opt} data-type="num">Number</a></li>
          <li><a href="javascript: void 0" onClick={actions.update} data-opt={opt} data-type="date">Date</a></li>
          <li><a href="javascript: void 0" onClick={actions.update} data-opt={opt} data-type="category">Category</a></li>
        </ul>
      </li>
    )
  }
}