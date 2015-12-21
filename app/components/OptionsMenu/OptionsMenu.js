import React, { Component } from 'react'
import Textarea from 'react-textarea-autosize'
import _ from 'lodash'
import d3 from 'd3'
import style from './OptionsMenu.css'

export default class OptionsMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {top: '0px', left: '0px'}
  }
  render() {
    const {name, val, options, actions, popupName} = this.props;
    let values = _.flatten([val]);

    let list = options.map((opt, i) => {
      const isSelected = (values.indexOf(opt) > -1);

      switch (opt + '-' + name) {
        case 'file-data':
          return (<UploadFile key={i} action={actions.add} />);
        case 'url-data':
          return (<ProvideURL key={i} action={actions.add} />);
        default:
          return (<OptionsItem key={i} name={name} opt={opt} isSelected={isSelected} popupName={popupName} actions={actions} />)
      }
    });

    return (
      <span ref="popupContainer">
        <div className="fullscreen" onClick={actions.togglePopup}></div>
        <ul className="menu" style={{left: this.state.left, top: this.state.top}}>
          {list}
        </ul>
      </span>
    )
  }

  componentDidMount () {
    const bound = this.refs.popupContainer.getBoundingClientRect();
    this.setState({
      left: bound.left + 'px',
      top: (bound.top + bound.height) + 'px'
    });
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
        <input type="file" onChange={this.props.action} accept="text/csv,text/json,text/plain" />
      </li>
    )
  }
}

class OptionsItem extends Component {
  render() {
    const {name, opt, isSelected, actions, popupName} = this.props;
    const fixedOpt = opt || 'undefined';
    const actionsList = _.keys(actions);
    const facetButton = ((name === 'x' || name==='y') && !isSelected) ? (<a href="javascript: void 0" onClick={actions.facet} data-opt={opt} data-popup={popupName} className="add"> </a>) : null;
    const mainAction = (actionsList.indexOf('switch') > -1) ? actions.switch : actions.update;
    const className = (isSelected) ? 'selected' : '';

    return (
      <li className={className}>
        <a href="javascript: void 0" onClick={mainAction} data-opt={opt} data-popup={popupName}>{fixedOpt}</a>{facetButton}
      </li>
    )
  }
}