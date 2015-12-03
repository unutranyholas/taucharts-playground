import React, { Component } from 'react'
import Textarea from 'react-textarea-autosize'
import _ from 'lodash'
import d3 from 'd3'
import style from './OptionsMenu.css'

export default class OptionsMenu extends Component {
  render() {
    const {name, val, options, actions} = this.props;
    let values = _.flatten([val]);

    let list = options.map((opt, i) => {
      const isSelected = (values.indexOf(opt) > -1);

      switch (opt + '-' + name) {
        case 'file-data':
          return (<UploadFile key={i} action={actions.add} />);
        case 'url-data':
          return (<ProvideURL key={i} action={actions.add} />);
        default:
          return (<OptionsItem key={i} opt={opt} isSelected={isSelected} actions={actions} />)
      }
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
    const {opt, isSelected, actions} = this.props;
    const actionsList = _.keys(actions);
    const facetButton = (actionsList.indexOf('facet') > -1 && !isSelected) ? (<a href="javascript: void 0" onClick={actions.facet} data-opt={opt} className="add"> </a>) : null;
    const mainAction = (actionsList.indexOf('switch') > -1) ? actions.switch : actions.update;
    const className = (isSelected) ? 'selected' : '';

    return (
      <li className={className}>
        <a href="javascript: void 0" onClick={mainAction} data-opt={opt}>{opt}</a>{facetButton}
      </li>
    )
  }
}