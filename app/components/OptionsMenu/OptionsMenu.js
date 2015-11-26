import React, { Component } from 'react'
import Textarea from 'react-textarea-autosize'
import _ from 'lodash'
import d3 from 'd3'
import style from './OptionsMenu.css'

export default class OptionsMenu extends Component {
  render() {
    const {name, val, options, action, toggleMenu} = this.props.p;
    let values = _.flatten([val]);

    let list = options.map((opt, i) => {
      const isSelected = (values.indexOf(opt) > -1);

      switch (opt + '-' + name) {
        case 'file-data':
          return (<UploadFile key={i} action={action.add} />);
        case 'url-data':
          return (<ProvideURL key={i} action={action.add} />);
        default:
          return (<OptionsItem key={i} opt={opt} isSelected={isSelected} action={action} />)
      }
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

class ProvideURL extends Component {
  render() {
    //TODO: add confirm button and handle pressing 'enter'
    //TODO: loader
    return (
      <li className="sep">
        <Textarea type="text" placeholder="Paste URL" onChange={this.props.action} />
      </li>
    )
  }
}

class UploadFile extends Component {
  render() {
    //TODO: link instead form
    const {action} = this.props;
    return (
      <li className="sep">
        <input type="file" onChange={this.props.action} accept="text/csv,text/json" />
      </li>
    )
  }
}

class OptionsItem extends Component {
  render() {
    const {opt, isSelected, action} = this.props;
    const actions = _.keys(action);
    const update = action.update || action;
    const isFacet = (actions.indexOf('facet') > -1 && !isSelected);

    if (actions.indexOf('switch') > -1) {
      return (
        <li className={(isSelected) ? 'selected' : ''}>
          <a href="javascript: void 0" onClick={action.switch} data-opt={opt}>{opt}</a>
        </li>
      )
    }

    return (
      <li className={(isSelected) ? 'selected' : ''}>
        <a href="javascript: void 0" onClick={update} data-opt={opt}>{opt}</a>
        {(isFacet) ? (<a href="javascript: void 0" onClick={action.facet} data-opt={opt} className="add"> </a>) : null}
      </li>
    )
  }
}