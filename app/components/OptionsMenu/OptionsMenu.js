import React, { Component } from 'react'
import _ from 'lodash'
import style from './OptionsMenu.css'

export default class OptionsMenu extends Component {
  render() {
    const {name, val, options, action, toggleMenu} = this.props.p;
    let values = _.flatten([val]);

    let list = options.map((opt, i) => {
      const isSelected = (values.indexOf(opt) > -1);
      return (
        <OptionsItem key={i} opt={opt} isSelected={isSelected} action={action}/>
      )
    });

    return (
      <div>
        <div className="fullscreen" onClick={toggleMenu}></div>
        <ul className="menu">
          {list}
        </ul>
      </div>
    )
  }
}

class OptionsItem extends Component {
  render() {
    const {opt, isSelected, action} = this.props;
    let update = action.update || action;

    if (!_.isFunction(action) && !isSelected) {
      return (
        <li className={(isSelected) ? 'selected' : ''}>
          <a href="javascript: void 0" onClick={action.update} data-opt={opt}>{opt}</a>
          <a href="javascript: void 0" onClick={action.facet} data-opt={opt} className="add"> </a>
        </li>
      )
    }

    return (
      <li className={(isSelected)? 'selected' : ''}>
        <a href="javascript: void 0" onClick={update} data-opt={opt}>{opt}</a>
      </li>
    )

  }
}